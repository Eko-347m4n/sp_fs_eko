'use client';

import React, { useState, useEffect } from 'react';

interface ProjectFormProps {
  initialTitle?: string;
  onSubmit: (title: string) => void;
  isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialTitle = '', onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onSubmit(title.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <label htmlFor="title" className="block mb-2 font-semibold">
        Project Title
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};

export default ProjectForm;
