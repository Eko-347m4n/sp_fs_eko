'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectList from '@/components/project/ProjectList';

interface Project {
  id: string;
  title: string;
}

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/project');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/project?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete project');
      }
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Failed to delete project');
    }
  };

  const handleAdd = () => {
    router.push('/dashboard/add');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Project
      </button>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default DashboardPage;
