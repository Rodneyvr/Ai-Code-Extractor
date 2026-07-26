import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AC</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Code Extractor Pro</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Settings</h2>

          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-medium text-slate-900 mb-3">Platform Detection</h3>
              <p className="text-sm text-slate-600 mb-4">
                Select which platforms to monitor for code blocks.
              </p>
              <div className="space-y-2">
                {[
                  'ChatGPT',
                  'Claude',
                  'Gemini',
                  'DeepSeek',
                  'Devin',
                  'Grok',
                  'Perplexity',
                  'Microsoft Copilot',
                ].map((platform) => (
                  <label key={platform} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <span className="text-sm text-slate-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-3">Export Options</h3>
              <p className="text-sm text-slate-600 mb-4">Configure ZIP export behavior.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-700">Include file tree visualization</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-700">
                    Auto-detect and merge split files
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}