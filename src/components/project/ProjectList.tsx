'use client';

import React from 'react';

interface Project {
  id: string;
  title: string;
}

interface ProjectListProps {
  projects: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete }) => {
  if (projects.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id} className="flex justify-between items-center py-2 border-b">
          <span>{project.title}</span>
          <div>
            <button
              className="mr-2 text-blue-600 hover:underline"
              onClick={() => onEdit(project.id)}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => onDelete(project.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
