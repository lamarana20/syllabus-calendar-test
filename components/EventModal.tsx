import React, { useState, useEffect } from "react";
import { EventItem, EventCategory } from "../utils/parseSyllabus";

type Props = {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onSave: (event: EventItem) => void;
  onDelete?: () => void;
};

const CATEGORY_COLORS = {
  exam: "#ef4444",
  quiz: "#f97316", 
  assignment: "#3b82f6",
  project: "#8b5cf6",
  lecture: "#10b981",
  "office-hours": "#06b6d4",
  holiday: "#84cc16",
  other: "#6b7280",
};

export default function EventModal({ isOpen, event, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<EventCategory>("other");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(new Date(event.date).toISOString().split('T')[0]);
      setCategory(event.category);
    } else {
      setTitle("");
      setDate("");
      setCategory("other");
    }
  }, [event]);

  const handleSave = () => {
    if (!title || !date) return;

    const savedEvent: EventItem = {
      title,
      date: new Date(date).toISOString(),
      category,
      color: CATEGORY_COLORS[category],
    };

    onSave(savedEvent);
    onClose();
  };

  if (!isOpen) return null;

  const categories: { value: EventCategory; label: string; icon: string }[] = [
    { value: "exam", label: "Exam", icon: "📝" },
    { value: "quiz", label: "Quiz", icon: "❓" },
    { value: "assignment", label: "Assignment", icon: "📋" },
    { value: "project", label: "Project", icon: "🎯" },
    { value: "lecture", label: "Lecture", icon: "🎓" },
    { value: "office-hours", label: "Office Hours", icon: "🏢" },
    { value: "holiday", label: "Holiday", icon: "🎉" },
    { value: "other", label: "Other", icon: "📌" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass dark:glass-dark rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {event ? "✏️ Edit Event" : "➕ Add Event"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              className="w-full px-4 py-3 glass dark:glass-dark rounded-xl border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 glass dark:glass-dark rounded-xl border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    category === cat.value
                      ? "text-white shadow-lg transform scale-105"
                      : "glass dark:glass-dark hover:scale-105 text-gray-700 dark:text-gray-300 hover:bg-white/20"
                  }`}
                  style={category === cat.value ? { backgroundColor: CATEGORY_COLORS[cat.value] } : {}}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!title || !date}
            className="flex-1 btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {event ? "Update Event" : "Create Event"}
          </button>
          
          {event && onDelete && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              🗑️
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-3 glass dark:glass-dark rounded-xl hover:scale-105 transition-all duration-300 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
