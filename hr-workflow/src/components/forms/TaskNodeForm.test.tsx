import { describe, expect, test, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskNodeForm } from './TaskNodeForm.tsx';
import { useWorkflow } from '../../hooks/useWorkflow';

vi.mock('../../hooks/useWorkflow', () => ({
  useWorkflow: vi.fn()
}));

describe('TaskNodeForm', () => {
  test('submitting with empty title shows validation error', async () => {
    const mockUpdate = vi.fn();
    (useWorkflow as Mock).mockReturnValue({ updateNodeData: mockUpdate });

    render(<TaskNodeForm nodeId="1" data={{ nodeType: 'task', label: 'T', title: 'Test', description: '', assignee: 'A', dueDate: '', customFields: [] }} />);
    
    // Clear the title input
    const titleInput = screen.getByDisplayValue('Test');
    fireEvent.change(titleInput, { target: { value: '' } });
    
    // Wait for zod validation failure text
    // Note: react-hook-form watch/onChange might need slightly different trigger in tests without a submit button.
    // In this form, it uses watch() but the errors span displays on validation
    // To trigger form validation, we blur or submit.
    fireEvent.blur(titleInput);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('filling form calls updateNodeData correctly', async () => {
    const mockUpdate = vi.fn();
    (useWorkflow as Mock).mockReturnValue({ updateNodeData: mockUpdate });

    render(<TaskNodeForm nodeId="1" data={{ nodeType: 'task', label: 'T', title: 'Task1', description: '', assignee: 'A', dueDate: '', customFields: [] }} />);
    
    const assigneeInput = screen.getByDisplayValue('A');
    fireEvent.change(assigneeInput, { target: { value: 'New Assignee' } });
    
    await waitFor(() => {
      // Mock should be called due to watch() and useEffect synchronization
      expect(mockUpdate).toHaveBeenCalledWith('1', expect.objectContaining({ assignee: 'New Assignee' }));
    });
  });
});
