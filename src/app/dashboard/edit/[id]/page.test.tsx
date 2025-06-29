import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProjectPage from './page';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock ProjectForm component with display name and typed props
const MockProjectForm: React.FC<{ initialTitle?: string; onSubmit: (title: string) => void; isSubmitting: boolean }> = (props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit('Updated Project');
      }}
      data-testid="project-form"
    >
      <button type="submit">Submit</button>
    </form>
  );
};
MockProjectForm.displayName = 'MockProjectForm';

jest.mock('@/components/project/ProjectForm', () => MockProjectForm);

describe('EditProjectPage', () => {
  const mockPush = jest.fn();
  const originalAlert = window.alert;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: '1',
    });
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    window.alert = jest.fn();
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockReturnValue(
      new Promise(() => {}) // never resolves
    );
    render(<EditProjectPage />);
    expect(screen.getByText(/Loading project.../i)).toBeInTheDocument();
  });

  it('renders project form after fetch', async () => {
    const projects = [{ id: '1', title: 'Project 1' }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => projects,
    });

    render(<EditProjectPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading project.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('project-form')).toBeInTheDocument();
  });

  it('handles form submission success', async () => {
    const projects = [{ id: '1', title: 'Project 1' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => projects,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<EditProjectPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading project.../i)).not.toBeInTheDocument();
    });

    const form = screen.getByTestId('project-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows alert and redirects if project not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<EditProjectPage />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Project not found');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows alert on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<EditProjectPage />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to load project');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows alert on update failure', async () => {
    const projects = [{ id: '1', title: 'Project 1' }];
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => projects,
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    render(<EditProjectPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading project.../i)).not.toBeInTheDocument();
    });

    const form = screen.getByTestId('project-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to update project');
    });
  });
});
