import React from 'react';

export default function App() {
  return (
    <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AC</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900">AI Code Extractor Pro</h1>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          Extension foundation initialized. Ready to extract code blocks from AI platforms.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">Getting Started</h2>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Visit any AI chat platform</li>
            <li>This extension will detect code blocks</li>
            <li>Click extract and download as ZIP</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition">
            View Project
          </button>
          <button className="px-3 py-2 bg-slate-200 text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-300 transition">
            Settings
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">v0.1.0</p>
      </div>
    </div>
  );
}