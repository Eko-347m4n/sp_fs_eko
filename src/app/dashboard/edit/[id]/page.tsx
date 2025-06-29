/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/project/ProjectForm';

const EditProjectPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/project');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const projects = await res.json();
      const project = projects.find((p: { id: string }) => p.id === projectId);
      if (!project) {
        alert('Project not found');
        router.push('/dashboard');
        return;
      }
      setTitle(project.title);
    } catch (error) {
      console.error(error);
      alert('Failed to load project');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [fetchProject, projectId]);

  const handleSubmit = async (newTitle: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId, title: newTitle }),
      });
      if (!res.ok) {
        throw new Error('Failed to update project');
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading project...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <ProjectForm initialTitle={title} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default EditProjectPage;
