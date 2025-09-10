import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { EventItem } from "../utils/parseSyllabus";
import { loadEventsFromStorage, clearStorageEvents, saveEventsToStorage } from "../utils/localStorage";

export default function History() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [unparsedLines, setUnparsedLines] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<number>>(new Set());

  useEffect(() => {
    const { events: savedEvents, unparsed: savedUnparsed } = loadEventsFromStorage();
    setEvents(savedEvents);
    setUnparsedLines(savedUnparsed);
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved events?")) {
      clearStorageEvents();
      setEvents([]);
      setUnparsedLines([]);
      toast.success("All events cleared");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEvents.size === 0) {
      toast.error("No events selected");
      return;
    }

    const remainingEvents = events.filter((_, index) => !selectedEvents.has(index));
    setEvents(remainingEvents);
    saveEventsToStorage(remainingEvents, unparsedLines);
    setSelectedEvents(new Set());
    toast.success(`Deleted ${selectedEvents.size} events`);
  };

  const toggleEventSelection = (index: number) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedEvents(newSelected);
  };

  const selectAll = () => {
    setSelectedEvents(new Set(events.map((_, index) => index)));
  };

  const selectNone = () => {
    setSelectedEvents(new Set());
  };

  const exportSelectedToIcs = async () => {
    if (selectedEvents.size === 0) {
      toast.error("No events selected");
      return;
    }

    try {
      const { createEvents } = await import("ics");
      const selectedEventsList = events.filter((_, index) => selectedEvents.has(index));
      
      const icsEvents = selectedEventsList.map(event => {
        const date = new Date(event.date);
        return {
          start: [date.getFullYear(), date.getMonth() + 1, date.getDate()] as [number, number, number],
          duration: { hours: 1 },
          title: event.title,
          description: `Category: ${event.category}`,
          categories: [event.category],
        };
      });

      const { error, value } = createEvents(icsEvents);
      if (error) throw error;

      const blob = new Blob([value!], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "selected-events.ics";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Selected events exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export events");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exam": return "📝";
      case "quiz": return "❓";
      case "assignment": return "📋";
      case "project": return "🎯";
      case "lecture": return "🎓";
      case "office-hours": return "🏢";
      case "holiday": return "🎉";
      default: return "📅";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full transition-all duration-300 border border-white/30"
            >
              ← Back to Calendar
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              📚 Event History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your saved calendar events. Select events to export or delete them individually.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{events.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Events</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedEvents.size}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Selected</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{unparsedLines.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Unparsed Lines</div>
          </div>
        </div>

        {/* Actions */}
        {events.length > 0 && (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={selectAll}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Select All
              </button>
              <button
                onClick={selectNone}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Select None
              </button>
              <button
                onClick={exportSelectedToIcs}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                📄 Export Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                🗑️ Delete Selected
              </button>
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                🔥 Clear All
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              No Events in History
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Upload a syllabus to start building your event history
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Upload Syllabus
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={index}
                className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                  selectedEvents.has(index)
                    ? "border-blue-400 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50"
                    : "border-white/30 hover:border-white/50"
                }`}
                onClick={() => toggleEventSelection(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{getCategoryIcon(event.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.category}
                    </div>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.has(index)}
                      onChange={() => toggleEventSelection(index)}
                      className="w-5 h-5 rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unparsed Lines */}
        {unparsedLines.length > 0 && (
          <div className="mt-8">
            <div className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                Unparsed Lines ({unparsedLines.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {unparsedLines.map((line, i) => (
                  <div
                    key={i}
                    className="text-sm text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}
