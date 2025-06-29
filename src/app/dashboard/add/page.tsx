'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/project/ProjectForm';

const AddProjectPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (title: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        throw new Error('Failed to create project');
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Project</h1>
      <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddProjectPage;
