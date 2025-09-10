import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UploadBox from "../components/UploadBox";
import CalendarView from "../components/CalendarView";
import DarkModeToggle from "../components/DarkModeToggle";
import EventSearch from "../components/EventSearch";
import EventModal from "../components/EventModal";
import FloatingStats from "../components/FloatingStats";
import { EventItem } from "../utils/parseSyllabus";
import { saveEventsToStorage, loadEventsFromStorage, clearStorageEvents } from "../utils/localStorage";

export default function Home() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [unparsedLines, setUnparsedLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Load events from localStorage on component mount
  useEffect(() => {
    const { events: savedEvents, unparsed: savedUnparsed } = loadEventsFromStorage();
    if (savedEvents.length > 0) {
      setAllEvents(savedEvents);
      setFilteredEvents(savedEvents);
      setUnparsedLines(savedUnparsed);
      toast.success(`Loaded ${savedEvents.length} saved events`);
    }
  }, []);

  // Update filtered events when all events change
  useEffect(() => {
    if (!showSearch) {
      setFilteredEvents(allEvents);
    }
  }, [allEvents, showSearch]);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    const toastId = toast.loading("Parsing your syllabus...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/parse", formData);
      const { events: parsedEvents, unparsed } = res.data;
      
      setAllEvents(parsedEvents);
      setFilteredEvents(parsedEvents);
      setUnparsedLines(unparsed);
      
      // Save to localStorage
      saveEventsToStorage(parsedEvents, unparsed);
      
      toast.success(
        `Found ${parsedEvents.length} events${unparsed.length ? ` (${unparsed.length} lines couldn't be parsed)` : "!"}`,
        { id: toastId }
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to parse PDF. Please try a different file.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToIcs = async () => {
    if (allEvents.length === 0) {
      toast.error("No events to export");
      return;
    }

    try {
      const { createEvents } = await import("ics");
      const icsEvents = allEvents.map((event: EventItem) => {
        const date = new Date(event.date);
        return {
          start: [date.getFullYear(), date.getMonth() + 1, date.getDate()] as [number, number, number],
          duration: { hours: 1 }, // Default 1 hour duration
          title: event.title,
          description: `Category: ${event.category}`,
          categories: [event.category],
        };
      });

      const { error, value } = createEvents(icsEvents);
      if (error) throw error;

      // Download the .ics file
      const blob = new Blob([value!], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "syllabus-calendar.ics";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Calendar exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export calendar");
    }
  };

  const clearCalendar = () => {
    setAllEvents([]);
    setFilteredEvents([]);
    setUnparsedLines([]);
    clearStorageEvents();
    toast.success("Calendar cleared");
  };

  const handleSaveEvent = (event: EventItem) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = allEvents.map(e => 
        e.title === editingEvent.title && e.date === editingEvent.date ? event : e
      );
      setAllEvents(updatedEvents);
      saveEventsToStorage(updatedEvents, unparsedLines);
      toast.success("Event updated!");
    } else {
      // Add new event
      const newEvents = [...allEvents, event];
      setAllEvents(newEvents);
      saveEventsToStorage(newEvents, unparsedLines);
      toast.success("Event added!");
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    
    const updatedEvents = allEvents.filter(e => 
      !(e.title === editingEvent.title && e.date === editingEvent.date)
    );
    setAllEvents(updatedEvents);
    saveEventsToStorage(updatedEvents, unparsedLines);
    toast.success("Event deleted!");
    setEditingEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 relative z-10">
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
              <span className="text-4xl sm:text-5xl md:text-7xl">📅</span> Syllabus → Calendar
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your PDF syllabus into an interactive, color-coded calendar with AI-powered parsing
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 px-4">
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/30">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                <span className="text-sm sm:text-base mr-1">✨</span>AI-Powered
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/30">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                <span className="text-sm sm:text-base mr-1">🎨</span>Color-Coded
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/30">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                <span className="text-sm sm:text-base mr-1">📱</span>Responsive
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <UploadBox onUpload={handleUpload} isLoading={isLoading} />
          
          {/* Navigation & Actions */}
          <div className="glass dark:glass-dark rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/history"
                className="btn-gradient flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
              >
                <span className="text-lg sm:text-xl">📚</span>
                <span>History ({allEvents.length})</span>
              </Link>
              
              {allEvents.length > 0 && (
                <>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`btn-gradient flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] touch-manipulation ${showSearch ? 'pulse-glow' : ''}`}
                  >
                    <span className="text-lg sm:text-xl">🔍</span>
                    <span>{showSearch ? 'Hide' : 'Show'} Search</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[48px] touch-manipulation"
                  >
                    <span className="text-lg sm:text-xl">➕</span>
                    <span>Add Event</span>
                  </button>
                  <button
                    onClick={exportToIcs}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[48px] touch-manipulation"
                  >
                    <span className="text-lg sm:text-xl">📄</span>
                    <span>Export</span>
                  </button>
                  <button
                    onClick={clearCalendar}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[48px] touch-manipulation"
                  >
                    <span className="text-lg sm:text-xl">🗑️</span>
                    <span>Clear All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search & Filter */}
          {showSearch && allEvents.length > 0 && (
            <EventSearch 
              events={allEvents} 
              onFilteredEvents={setFilteredEvents} 
            />
          )}

          <CalendarView events={filteredEvents} />

          {unparsedLines.length > 0 && (
            <div className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Lines that couldn't be parsed ({unparsedLines.length})
              </h3>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {unparsedLines.slice(0, 8).map((line, i) => (
                  <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl text-sm text-amber-700 dark:text-amber-300 border border-amber-200/50">
                    {line}
                  </div>
                ))}
                {unparsedLines.length > 8 && (
                  <div className="text-center py-2">
                    <Link
                      href="/history"
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium underline"
                    >
                      View all {unparsedLines.length} unparsed lines in history →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Floating Stats */}
      <FloatingStats events={allEvents} />

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        event={editingEvent}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}
