# 📅 Syllabus → Calendar

**Transform your PDF syllabus into an interactive calendar instantly**

A smart web application that automatically parses PDF syllabi and converts assignments, exams, and deadlines into a beautiful calendar view. Built for the Lawbandit programming competition.

![App Preview](https://img.shields.io/badge/Built_with-TypeScript_%2B_Next.js-blue?style=for-the-badge)
![Competition](https://img.shields.io/badge/Lawbandit-Competition_Entry-green?style=for-the-badge)

## ✨ Features

### 🧠 Intelligent PDF Parsing
- **Advanced Date Recognition**: Uses both regex patterns and natural language processing (chrono-node) to detect dates in various formats
- **Smart Event Classification**: Automatically categorizes events as exams, assignments, lectures, office hours, etc.
- **Multiple Date Formats**: Supports MM/dd, MM/dd/yyyy, "Sep 15", "September 15", and natural language dates
- **Error Reporting**: Shows unparsed lines for manual review

### 🎨 Modern User Interface
- **Responsive Design**: Works perfectly on desktop and mobile
- **Color-coded Categories**: Visual distinction between exams (red), assignments (blue), lectures (green), etc.
- **Loading States**: Elegant loading animations with progress feedback
- **Dark Mode Ready**: Full dark mode support with Tailwind CSS
- **Toast Notifications**: Real-time feedback for all user actions

### 📊 Calendar Features
- **FullCalendar Integration**: Professional calendar with month/week views
- **Event Legend**: Clear color-coded legend for different event types
- **Interactive Events**: Click events to see details
- **Responsive Layout**: Adapts to different screen sizes
- **LocalStorage Persistence**: Events automatically saved and restored between sessions
- **Clear Calendar**: One-click option to clear all events and start fresh

### 📤 Export Options
- **ICS Export**: Download .ics files compatible with Google Calendar, Outlook, Apple Calendar
- **One-click Download**: Instant calendar file generation
- **Event Metadata**: Preserves categories and descriptions in exported files

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/lamarana20/syllabus-calendar-test.git
cd syllabus-calendar-test.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
syllabus-calendar/
├── components/           # React components
│   ├── CalendarView.tsx  # FullCalendar wrapper with events
│   └── UploadBox.tsx     # File upload with drag-and-drop
├── pages/
│   ├── api/
│   │   └── parse.ts      # PDF parsing API endpoint
│   └── index.tsx         # Main application page
├── utils/
│   └── parseSyllabus.ts  # Core parsing logic
├── styles/
│   └── globals.css       # Tailwind CSS + custom styles
└── public/              # Static assets
```

## 🛠️ Technical Architecture

### Backend (Next.js API Routes)
- **File Upload**: Handles PDF files with formidable
- **PDF Processing**: Extracts text using pdf-parse
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full TypeScript coverage

### Frontend (React + Next.js)
- **State Management**: React hooks for events and UI state
- **UI Framework**: Tailwind CSS for styling
- **Notifications**: react-hot-toast for user feedback
- **Calendar**: FullCalendar for event display
- **Export**: ics library for calendar file generation

### Parsing Engine
- **Dual Strategy**: Fast regex + fallback natural language processing
- **Pattern Recognition**: Detects various date formats and separators
- **Event Classification**: Keyword-based categorization
- **Error Recovery**: Collects unparsed lines for user review

## 🎯 Competition Features

### Core Requirements ✅
- **TypeScript + Node.js**: Built with Next.js (React + TypeScript on Node.js)
- **Clean Code**: ESLint + TypeScript for code quality
- **Documentation**: Comprehensive README with setup instructions
- **Deployment Ready**: Optimized for Vercel deployment

### Advanced Features 🚀
- **Smart Parsing**: Goes beyond basic date detection with AI-powered parsing
- **Beautiful UI**: Professional design with animations and responsive layout
- **Export Functionality**: ICS file generation for calendar app integration
- **Error Handling**: Graceful error states with user feedback
- **Performance**: Optimized build with code splitting

### Bonus Features ⭐
- **Category Detection**: Automatically classifies event types
- **Color Coding**: Visual categorization of events
- **Mobile Responsive**: Works on all device sizes
- **Dark Mode Support**: Modern UI with theme support

## 🔧 API Reference

### POST /api/parse
Parses a PDF syllabus file and returns structured events.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: PDF file (required)

**Response:**
```typescript
{
  events: Array<{
    title: string;
    date: string;        // ISO 8601 date
    category: string;    // "exam" | "assignment" | "lecture" | etc.
    color: string;       // Hex color for category
  }>;
  unparsed: string[];    // Lines that couldn't be parsed
}
```

## 🎨 Customization

### Adding New Event Categories
Edit `utils/parseSyllabus.ts`:

```typescript
// Add to detectCategory function
if (lower.match(/\b(your-keyword)\b/)) return "your-category";

// Add to CATEGORY_COLORS
const CATEGORY_COLORS = {
  // ...existing colors
  "your-category": "#your-color",
};
```

### Styling
The app uses Tailwind CSS. Customize colors, spacing, and components in:
- `tailwind.config.js` - Theme configuration
- `styles/globals.css` - Global styles
- Component files - Component-specific styles

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically with zero configuration

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

### Test with Sample Syllabi
1. Create PDFs with various date formats:
   - "9/15 - Assignment 1 Due"
   - "September 20 - Midterm Exam"
   - "Oct 5: Project Presentation"
   - "Final Exam: December 15th"

2. Upload and verify parsing accuracy
3. Check calendar display and export functionality

## 🤝 Contributing

This project was built for the Lawbandit programming competition. Key areas for future enhancement:

- **Google Calendar Sync**: OAuth integration for direct calendar sync
- **OCR Support**: Handle scanned PDFs with tesseract.js
- **Multi-semester Support**: Parse multiple syllabi into one calendar
- **Time Detection**: Extract specific times, not just dates
- **Recurring Events**: Handle "every Monday" type patterns

## 📝 License

MIT License - see LICENSE file for details.

## 🏆 Competition Submission

**Built by:** Mamadou Lamarana  Diallo
**For:** Lawbandit Programming Competition  intership
**Category:** Syllabus → Calendar Feature  
**Tech Stack:** TypeScript, Next.js, React, Tailwind CSS  
**Deployment:** Vercel  

**Key Innovations:**
- Dual parsing strategy (regex + NLP)
- Smart event categorization
- Professional UI/UX with dark mode
- Export functionality with .ics support
- Comprehensive error handling

## 🎓 Development Process

This project was built using extensive research and learning from multiple sources:

- **AI Assistance**: Leveraged AI tools for code generation, debugging, and architectural decisions
- **Google Search**: Comprehensive research on TypeScript, Next.js best practices, and PDF parsing libraries
- **YouTube Tutorials**: Followed video tutorials for React patterns, Tailwind CSS techniques, and calendar integration(traversy)
- **Documentation**: Deep dive into official docs for FullCalendar, pdf-parse, and other libraries
- **Stack Overflow**: Community-driven solutions for specific implementation challenges

The combination of AI-powered development, traditional research methods, and community resources enabled rapid prototyping and feature implementation for this competition entry.

---

*Transform your academic planning with intelligent syllabus parsing! 🎓*
