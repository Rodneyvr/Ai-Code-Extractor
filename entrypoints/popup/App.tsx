import React, { useEffect, useState } from 'react';
import { useProjects } from '@storage/hooks';
import type { ExtractedProject } from '@types/index';

export default function App() {
  const projects = useProjects();
  const [activeTab, setActiveTab] = useState<'projects' | 'extract' | 'settings'>('projects');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects !== null) {
      setLoading(false);
    }
  }, [projects]);

  return (
    <div className="w-96 h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">AC</span>
          </div>
          <h1 className="text-lg font-bold">AI Code Extractor</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'projects'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Projects ({projects?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('extract')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'extract'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Extract
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full mb-2"></div>
              <p className="text-sm text-slate-600">Loading...</p>
            </div>
          </div>
        ) : activeTab === 'projects' ? (
          <ProjectsTab projects={projects || []} />
        ) : activeTab === 'extract' ? (
          <ExtractTab />
        ) : (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

function ProjectsTab({ projects }: { projects: ExtractedProject[] }) {
  if (projects.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        <p className="text-sm mb-2">No projects extracted yet.</p>
        <p className="text-xs">Navigate to an AI platform and click Extract.</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
        >
          <h3 className="font-medium text-sm text-slate-900">{project.name}</h3>
          <p className="text-xs text-slate-600 mt-1">
            {project.files.length} files • {project.platform}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

function ExtractTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How to extract:</h3>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Visit an AI chat platform (ChatGPT, Claude, etc.)</li>
          <li>Generate code or paste code blocks</li>
          <li>Click the Extract button below</li>
          <li>Review and download as ZIP</li>
        </ol>
      </div>

      <button className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition">
        Extract from Page
      </button>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Enabled Platforms</h3>
        <div className="space-y-2">
          {['ChatGPT', 'Claude', 'Gemini', 'DeepSeek'].map((platform) => (
            <label key={platform} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-700">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Export Options</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-slate-700">Auto-merge split files</span>
        </label>
      </div>
    </div>
  );
}
