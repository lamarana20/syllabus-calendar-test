import React from "react";

type Props = { 
  onUpload: (file: File) => void;
  isLoading?: boolean;
};

export default function UploadBox({ onUpload, isLoading = false }: Props) {
  const [dragOver, setDragOver] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && !isLoading) {
      onUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-dashed transition-all duration-300 ${
      dragOver 
        ? "border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-900/50 scale-105" 
        : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-102"
    }`}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoading) return;
          const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
          if (file) onUpload(file);
        }}
        className="flex flex-col gap-4 sm:gap-6"
      >
        <div className="text-center">
          <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce">
            {isLoading ? "⚡" : dragOver ? "📥" : "📄"}
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {isLoading ? "Parsing Your Syllabus..." : "Upload Your Syllabus PDF"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-2">
            {dragOver 
              ? "Drop your PDF here!" 
              : isLoading 
                ? "AI is analyzing your document..." 
                : "Drag & drop your PDF here, or click to browse"
            }
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <input 
            type="file" 
            name="file" 
            accept=".pdf,application/pdf"
            className="w-full border-2 border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-sm sm:text-base file:mr-3 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-purple-500 file:to-blue-500 file:text-white hover:file:from-purple-600 hover:file:to-blue-600 disabled:opacity-50 transition-all duration-300 touch-manipulation"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-xl flex items-center justify-center gap-2 sm:gap-3 min-h-[56px] touch-manipulation"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                <span>Analyzing PDF with AI...</span>
              </>
            ) : (
              <>
                <span className="text-lg sm:text-xl">🚀</span>
                <span>Parse Syllabus with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div className="text-center p-2 sm:p-3 bg-white/30 dark:bg-gray-700/30 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base">🧠</span> Smart Parsing
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detects multiple date formats</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/30 dark:bg-gray-700/30 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base">🎨</span> Auto-Categorize
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Exams, assignments, lectures</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/30 dark:bg-gray-700/30 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1">
              <span className="text-sm sm:text-base">💾</span> Auto-Save
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Persists between sessions</div>
          </div>
        </div>
      </form>
    </div>
  );
}
