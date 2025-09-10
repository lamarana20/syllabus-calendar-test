import React, { useState } from "react";
import { EventItem } from "../utils/parseSyllabus";

type Props = {
  events: EventItem[];
};

export default function FloatingStats({ events }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (events.length === 0) return null;

  const stats = {
    total: events.length,
    upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
    thisWeek: events.filter(e => {
      const eventDate = new Date(e.date);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      return eventDate >= now && eventDate <= new Date(now.getTime() + oneWeek);
    }).length,
    categories: events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const nextEvent = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40">
      <div 
        className={`glass dark:glass-dark rounded-2xl transition-all duration-300 touch-manipulation ${
          isExpanded ? 'p-3 sm:p-4 w-72 sm:w-80' : 'p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 min-h-[44px] min-w-[44px]'
        } cursor-pointer card-hover`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-xl sm:text-2xl animate-pulse">📊</span>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-1">
                <span className="text-base sm:text-lg">📊</span> Quick Stats
              </h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <span className="text-sm">✕</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-1 sm:p-2">
                <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-xs text-blue-500 dark:text-blue-300">Total</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-1 sm:p-2">
                <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">{stats.upcoming}</div>
                <div className="text-xs text-green-500 dark:text-green-300">Upcoming</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-1 sm:p-2">
                <div className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">{stats.thisWeek}</div>
                <div className="text-xs text-orange-500 dark:text-orange-300">This Week</div>
              </div>
            </div>

            {nextEvent && (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-3">
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Next Event</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 truncate">{nextEvent.title}</div>
                <div className="text-xs text-purple-500 dark:text-purple-400">
                  {new Date(nextEvent.date).toLocaleDateString()}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div
                  key={category}
                  className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full"
                >
                  {category}: {count}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
