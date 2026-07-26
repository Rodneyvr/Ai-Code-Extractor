import React, { useState } from 'react';
import { useProjects } from '@storage/hooks';
import { ProjectDetail } from './ProjectDetail';
import type { ExtractedProject } from '@types/index';

export function ProjectsList() {
  const projects = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (selectedProjectId && projects) {
    return (
      <ProjectDetail
        projectId={selectedProjectId}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        <p className="text-sm">No projects extracted yet.</p>
        <p className="text-xs mt-2">Navigate to an AI platform and click Extract.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => setSelectedProjectId(project.id)}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ExtractedProject;
  onClick: () => void;
}) {
  const totalSize = project.files.reduce((sum, f) => sum + f.content.length, 0);
  const totalSizeKB = Math.round(totalSize / 1024);

  return (
    <button
      onClick={onClick}
      className="w-full p-3 hover:bg-slate-50 transition text-left border-b border-slate-100"
    >
      <h3 className="font-medium text-sm text-slate-900">{project.name}</h3>
      <div className="flex items-center gap-4 mt-2">
        <span className="text-xs text-slate-600">{project.files.length} files</span>
        <span className="text-xs text-slate-600">{totalSizeKB} KB</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {project.platform}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {new Date(project.createdAt).toLocaleDateString()}
      </p>
    </button>
  );
}
