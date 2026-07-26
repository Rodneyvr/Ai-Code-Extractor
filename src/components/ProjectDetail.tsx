import React, { useState } from 'react';
import { useProject } from '@storage/hooks';
import { downloadZip } from '@exporter/zip';
import { getFileIcon } from '@exporter/preview';
import type { ExtractedProject } from '@types/index';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const project = useProject(projectId);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!project) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-600">Loading project...</p>
      </div>
    );
  }

  const selectedFile = project.files.find((f) => f.id === selectedFileId);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      await downloadZip(project, {}, (progress) => {
        setExportProgress(progress.percentage);
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 sticky top-0 bg-white">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 text-sm mb-2"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
        <p className="text-xs text-slate-500 mt-1">
          {project.files.length} files • {project.platform}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File List */}
        <div className="w-1/3 border-r border-slate-200 overflow-y-auto">
          <div className="p-3 space-y-1">
            {project.files.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  selectedFileId === file.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="mr-2">{getFileIcon(file.filename)}</span>
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>
        </div>

        {/* File Preview */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              <div className="border-b border-slate-200 p-3 bg-slate-50">
                <p className="text-xs text-slate-600 font-mono">
                  {selectedFile.path ? `${selectedFile.path}/` : ''}
                  {selectedFile.filename}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedFile.content.length} bytes • {selectedFile.language}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap break-words">
                  {selectedFile.content.substring(0, 2000)}
                  {selectedFile.content.length > 2000 && '\n... (truncated)'}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-500">Select a file to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 disabled:bg-slate-400 transition"
        >
          {isExporting ? `Exporting ${exportProgress}%...` : 'Export as ZIP'}
        </button>
        <button className="px-4 py-2 bg-slate-200 text-slate-900 text-sm font-medium rounded hover:bg-slate-300 transition">
          Share
        </button>
      </div>
    </div>
  );
}
