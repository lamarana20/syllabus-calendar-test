import dynamic from "next/dynamic";
import React from "react";
import { EventItem } from "../utils/parseSyllabus";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });
import dayGridPlugin from "@fullcalendar/daygrid";

type Props = { events: EventItem[] };

export default function CalendarView({ events }: Props) {
  const calendarEvents = events.map(event => ({
    title: event.title,
    start: event.date,
    backgroundColor: event.color,
    borderColor: event.color,
    textColor: '#ffffff',
    extendedProps: {
      category: event.category,
    }
  }));

  if (events.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center border border-white/20">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">📅</div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          Your Calendar Awaits
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-4">
          Upload a syllabus PDF to see your beautiful, color-coded calendar events
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 sm:p-4 rounded-xl">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base">✨</span> Smart Detection
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 sm:p-4 rounded-xl">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base">🎨</span> Color Coded
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/20">
      {/* Legend */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-white/20">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">Event Categories</h4>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {[
            { name: "Exams", color: "#ef4444", icon: "📝" },
            { name: "Quizzes", color: "#f97316", icon: "❓" },
            { name: "Assignments", color: "#3b82f6", icon: "📋" },
            { name: "Projects", color: "#8b5cf6", icon: "🎯" },
            { name: "Lectures", color: "#10b981", icon: "🎓" },
            { name: "Other", color: "#6b7280", icon: "📅" }
          ].map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-white font-medium shadow-lg transform hover:scale-105 transition-all duration-200 touch-manipulation"
              style={{ backgroundColor: category.color }}
            >
              <span className="text-sm sm:text-base">{category.icon}</span>
              <span className="text-xs sm:text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 border border-white/30 shadow-inner">
        <FullCalendar 
          plugins={[dayGridPlugin]} 
          initialView="dayGridMonth" 
          events={calendarEvents}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: window.innerWidth < 768 ? '' : 'dayGridMonth,dayGridWeek'
          }}
          eventDisplay="block"
          dayMaxEvents={window.innerWidth < 768 ? 2 : 3}
          eventDidMount={(info) => {
            // Add custom styling to events
            const isMobile = window.innerWidth < 768;
            info.el.style.borderRadius = '8px';
            info.el.style.border = 'none';
            info.el.style.fontSize = isMobile ? '11px' : '12px';
            info.el.style.fontWeight = '600';
            info.el.style.padding = isMobile ? '3px 6px' : '4px 8px';
            info.el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            info.el.style.cursor = 'pointer';
          }}
          dayHeaderClassNames="text-xs sm:text-sm"
          dayCellClassNames="text-xs sm:text-sm"
        />
      </div>
      
      {/* Statistics */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {[
          { name: "Total Events", count: events.length, color: "from-blue-500 to-cyan-500", icon: "📊" },
          { name: "Exams", count: events.filter(e => e.category === "exam").length, color: "from-red-500 to-pink-500", icon: "📝" },
          { name: "Assignments", count: events.filter(e => e.category === "assignment").length, color: "from-blue-500 to-indigo-500", icon: "📋" },
          { name: "Projects", count: events.filter(e => e.category === "project").length, color: "from-purple-500 to-violet-500", icon: "🎯" }
        ].map((stat) => (
          <div
            key={stat.name}
            className={`bg-gradient-to-r ${stat.color} text-white p-3 sm:p-4 rounded-xl text-center shadow-lg transform hover:scale-105 transition-all duration-200 touch-manipulation`}
          >
            <div className="text-lg sm:text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg sm:text-2xl font-bold">{stat.count}</div>
            <div className="text-xs opacity-90">{stat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
