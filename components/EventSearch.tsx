import React, { useState } from "react";
import { EventItem, EventCategory } from "../utils/parseSyllabus";

type Props = {
  events: EventItem[];
  onFilteredEvents: (filtered: EventItem[]) => void;
};

export default function EventSearch({ events, onFilteredEvents }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [dateRange, setDateRange] = useState<"all" | "upcoming" | "past">("all");

  const filterEvents = (search: string, category: EventCategory | "all", range: "all" | "upcoming" | "past") => {
    let filtered = [...events];

    // Filter by search term
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(event => event.category === category);
    }

    // Filter by date range
    const now = new Date();
    if (range === "upcoming") {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (range === "past") {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    onFilteredEvents(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    filterEvents(value, selectedCategory, dateRange);
  };

  const handleCategoryChange = (category: EventCategory | "all") => {
    setSelectedCategory(category);
    filterEvents(searchTerm, category, dateRange);
  };

  const handleDateRangeChange = (range: "all" | "upcoming" | "past") => {
    setDateRange(range);
    filterEvents(searchTerm, selectedCategory, range);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setDateRange("all");
    onFilteredEvents(events);
  };

  const categories: { value: EventCategory | "all"; label: string; icon: string }[] = [
    { value: "all", label: "All Events", icon: "📅" },
    { value: "exam", label: "Exams", icon: "📝" },
    { value: "quiz", label: "Quizzes", icon: "❓" },
    { value: "assignment", label: "Assignments", icon: "📋" },
    { value: "project", label: "Projects", icon: "🎯" },
    { value: "lecture", label: "Lectures", icon: "🎓" },
    { value: "office-hours", label: "Office Hours", icon: "🏢" },
    { value: "holiday", label: "Holidays", icon: "🎉" },
    { value: "other", label: "Other", icon: "📌" },
  ];

  return (
    <div className="glass dark:glass-dark rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🔍 Search & Filter Events
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-3 glass dark:glass-dark rounded-xl border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.value
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105"
                  : "glass dark:glass-dark hover:scale-105 text-gray-700 dark:text-gray-300 hover:bg-white/20"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Range
        </label>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All Time", icon: "📅" },
            { value: "upcoming", label: "Upcoming", icon: "⏭️" },
            { value: "past", label: "Past", icon: "⏮️" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handleDateRangeChange(range.value as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                dateRange === range.value
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                  : "glass dark:glass-dark hover:scale-105 text-gray-700 dark:text-gray-300 hover:bg-white/20"
              }`}
            >
              <span>{range.icon}</span>
              <span>{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200/20">
        {searchTerm || selectedCategory !== "all" || dateRange !== "all" ? (
          <span>
            Found {events.length} events matching your filters
          </span>
        ) : (
          <span>Showing all {events.length} events</span>
        )}
      </div>
    </div>
  );
}
