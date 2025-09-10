import { parse, isValid } from "date-fns";
import * as chrono from "chrono-node";

export type EventCategory = "exam" | "assignment" | "lecture" | "holiday" | "office-hours" | "quiz" | "project" | "other";

export type EventItem = {
  title: string;
  date: string;
  category: EventCategory;
  color: string;
};

export type ParseResult = {
  events: EventItem[];
  unparsed: string[];
};

const CATEGORY_COLORS = {
  exam: "#ef4444", // red
  quiz: "#f97316", // orange
  assignment: "#3b82f6", // blue
  project: "#8b5cf6", // purple
  lecture: "#10b981", // emerald
  "office-hours": "#06b6d4", // cyan
  holiday: "#84cc16", // lime
  other: "#6b7280", // gray
};

function detectCategory(text: string): EventCategory {
  const lower = text.toLowerCase();
  
  if (lower.match(/\b(exam|test|midterm|final)\b/)) return "exam";
  if (lower.match(/\b(quiz|pop quiz)\b/)) return "quiz";
  if (lower.match(/\b(assignment|hw|homework|due)\b/)) return "assignment";
  if (lower.match(/\b(project|paper|presentation)\b/)) return "project";
  if (lower.match(/\b(office hours?|office|hours)\b/)) return "office-hours";
  if (lower.match(/\b(holiday|break|no class)\b/)) return "holiday";
  if (lower.match(/\b(lecture|class|session)\b/)) return "lecture";
  
  return "other";
}

export function parseSyllabus(text: string): ParseResult {
  const lines = text.split("\n");
  const events: EventItem[] = [];
  const unparsed: string[] = [];
  const dateFormats = ["MMM d", "MMMM d", "MM/dd/yyyy", "M/d/yyyy", "M/dd", "MM/d"];

  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line || line.length < 5) return;

    let matched = false;

    // Try fast regex patterns first
    const quickMatch = line.match(/^(?<date>(\d{1,2}\/\d{1,2}(\/\d{2,4})?|[A-Za-z]{3,9}\s+\d{1,2}))\s*[-–—:]\s*(?<title>.+)$/);
    if (quickMatch?.groups) {
      for (const fmt of dateFormats) {
        try {
          const parsed = parse(quickMatch.groups.date, fmt, new Date());
          if (isValid(parsed)) {
            const category = detectCategory(line);
            events.push({
              title: quickMatch.groups.title.trim(),
              date: parsed.toISOString(),
              category,
              color: CATEGORY_COLORS[category]
            });
            matched = true;
            break;
          }
        } catch {}
      }
    }

    // Fallback to chrono for natural language dates
    if (!matched) {
      try {
        const results = chrono.parse(line);
        if (results.length > 0) {
          const result = results[0];
          const dateStr = result.text;
          const title = line.replace(dateStr, "").replace(/^[-–—:]\s*/, "").trim() || "Class Event";
          
          if (title.length > 0) {
            const category = detectCategory(line);
            events.push({
              title,
              date: result.start.date().toISOString(),
              category,
              color: CATEGORY_COLORS[category]
            });
            matched = true;
          }
        }
      } catch (error) {
        // chrono failed, continue to unparsed
      }
    }

    if (!matched) {
      unparsed.push(line);
    }
  });

  return { events, unparsed };
}
