import React, { useState } from 'react';
import { sendToBackground } from '@shared/messaging';
import { generateId } from '@shared/utils';
import type { MessageRequest, ExtractedProject } from '@types/index';

export function ExtractorPanel() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');

  const handleExtract = async () => {
    setIsExtracting(true);
    setError(null);

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active tab');

      // Request extraction from content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'EXTRACT_VISIBLE_CODE',
      });

      if (response.success && response.data?.codeBlocks) {
        const codeBlocks = response.data.codeBlocks;
        setExtractedFiles(codeBlocks.length);

        // Create project
        const project: ExtractedProject = {
          id: generateId('project'),
          name: projectName || `Extracted ${new Date().toLocaleString()}`,
          files: codeBlocks.map((block: any, index: number) => ({
            id: generateId('file'),
            filename: `code-${index}`,
            path: '',
            language: block.language || 'unknown',
            content: block.content,
            isFragment: false,
            sourceUrl: tab.url,
            extractedAt: Date.now(),
          })),
          platform: response.data.platform || 'unknown',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Save to storage
        await sendToBackground({
          type: 'SAVE_PROJECT',
          payload: project,
        } as MessageRequest);

        setProjectName('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="p-4 space-y-3">
      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1">
          Project Name (optional)
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="My Extracted Project"
          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          disabled={isExtracting}
        />
      </div>

      <button
        onClick={handleExtract}
        disabled={isExtracting}
        className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 disabled:bg-slate-400 transition"
      >
        {isExtracting ? 'Extracting...' : 'Extract from Page'}
      </button>

      {extractedFiles > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            ✓ Extracted {extractedFiles} code block{extractedFiles !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-green-700 mt-1">Check your projects to download.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 font-medium">Error</p>
          <p className="text-xs text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
