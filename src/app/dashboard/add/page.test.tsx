import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddProjectPage from './page';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock ProjectForm component
jest.mock('components/project/ProjectForm', () => (props: any) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit('Test Project');
      }}
      data-testid="project-form"
    >
      <button type="submit">Submit</button>
    </form>
  );
});

describe('AddProjectPage', () => {
  const mockPush = jest.fn();
  const originalAlert = window.alert;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    window.alert = jest.fn();
  });

  afterAll(() => {
    window.alert = originalAlert;
  });

  it('renders the page and submits form successfully', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: true,
    });

    render(<AddProjectPage />);

    const form = screen.getByTestId('project-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows alert on submission failure', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(<AddProjectPage />);

    const form = screen.getByTestId('project-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to create project');
    });
  });
});
