import { EventItem } from "./parseSyllabus";

const STORAGE_KEY = "syllabus-calendar-events";
const UNPARSED_KEY = "syllabus-calendar-unparsed";

export const saveEventsToStorage = (events: EventItem[], unparsed: string[] = []) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    localStorage.setItem(UNPARSED_KEY, JSON.stringify(unparsed));
  } catch (error) {
    console.error("Failed to save events to localStorage:", error);
  }
};

export const loadEventsFromStorage = (): { events: EventItem[]; unparsed: string[] } => {
  if (typeof window === "undefined") return { events: [], unparsed: [] };
  
  try {
    const eventsData = localStorage.getItem(STORAGE_KEY);
    const unparsedData = localStorage.getItem(UNPARSED_KEY);
    
    const events = eventsData ? JSON.parse(eventsData) : [];
    const unparsed = unparsedData ? JSON.parse(unparsedData) : [];
    
    return { events, unparsed };
  } catch (error) {
    console.error("Failed to load events from localStorage:", error);
    return { events: [], unparsed: [] };
  }
};

export const clearStorageEvents = () => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(UNPARSED_KEY);
  } catch (error) {
    console.error("Failed to clear events from localStorage:", error);
  }
};
