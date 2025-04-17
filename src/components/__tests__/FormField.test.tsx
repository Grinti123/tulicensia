import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from '../FormField';
import { useForm } from 'react-hook-form';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

describe('FormField', () => {
  const mockField = {
    id: 'test-field',
    label: 'Test Field',
    type: 'text',
    required: true,
    placeholder: 'Enter test value',
  };

  const mockForm = {
    register: jest.fn(),
    formState: {
      errors: {},
      isSubmitting: false,
    },
  };

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue(mockForm);
  });

  it('renders correctly', () => {
    render(<FormField field={mockField} form={mockForm as any} />);

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter test value')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles text input correctly', () => {
    render(<FormField field={mockField} form={mockForm as any} />);

    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockForm.register).toHaveBeenCalledWith('test-field');
  });

  it('displays error message when validation fails', () => {
    const formWithError = {
      ...mockForm,
      formState: {
        ...mockForm.formState,
        errors: {
          'test-field': {
            type: 'required',
            message: 'This field is required',
          },
        },
      },
    };

    render(<FormField field={mockField} form={formWithError as any} />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders select field correctly', () => {
    const selectField = {
      ...mockField,
      type: 'select',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ],
    };

    render(<FormField field={selectField} form={mockForm as any} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders checkbox field correctly', () => {
    const checkboxField = {
      ...mockField,
      type: 'checkbox',
    };

    render(<FormField field={checkboxField} form={mockForm as any} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('disables input when form is submitting', () => {
    const formSubmitting = {
      ...mockForm,
      formState: {
        ...mockForm.formState,
        isSubmitting: true,
      },
    };

    render(<FormField field={mockField} form={formSubmitting as any} />);

    expect(screen.getByLabelText('Test Field')).toBeDisabled();
  });
});
