import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProcedureFormField } from '../schemas/procedureForm';
import { useTranslation } from 'next-i18next';

interface FormFieldProps {
  field: ProcedureFormField;
  form: UseFormReturn<any>;
}

export const FormField: React.FC<FormFieldProps> = ({ field, form }) => {
  const { t } = useTranslation(['forms', 'errors']);
  const { register, formState: { errors, isSubmitting } } = form;
  const error = errors[field.id];
  const fieldId = `field-${field.id}`;
  const errorId = `${fieldId}-error`;

  const getAriaDescribedBy = () => {
    const describedBy = [];
    if (error) describedBy.push(errorId);
    if (field.placeholder) describedBy.push(`${fieldId}-description`);
    return describedBy.length > 0 ? describedBy.join(' ') : undefined;
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if (error.type === 'required') {
      return t('forms:validation.required', { field: field.label });
    }

    if (error.type === 'pattern') {
      return t('forms:validation.pattern', { field: field.label });
    }

    if (error.type === 'minLength') {
      return t('forms:validation.minLength', {
        field: field.label,
        min: field.validation?.minLength
      });
    }

    if (error.type === 'maxLength') {
      return t('forms:validation.maxLength', {
        field: field.label,
        max: field.validation?.maxLength
      });
    }

    if (error.type === 'min') {
      return t('forms:validation.min', {
        field: field.label,
        min: field.validation?.min
      });
    }

    if (error.type === 'max') {
      return t('forms:validation.max', {
        field: field.label,
        max: field.validation?.max
      });
    }

    return error.message as string;
  };

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      'aria-invalid': error ? 'true' : 'false',
      'aria-describedby': getAriaDescribedBy(),
      'aria-required': field.required ? 'true' : 'false',
      disabled: isSubmitting,
      className: `w-full px-3 py-2 border rounded-md transition-colors duration-200 ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
      } focus:outline-none focus:ring-2 focus:ring-primary-200`,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...register(field.id)}
            {...commonProps}
            placeholder={t(`forms:placeholders.${field.id}`, field.placeholder)}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            {...register(field.id)}
            {...commonProps}
          >
            <option value="">{t('forms:labels.selectOption')}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(field.id)}
              {...commonProps}
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                error ? 'border-red-500' : ''
              }`}
            />
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            {...register(field.id)}
            {...commonProps}
            placeholder={t(`forms:placeholders.${field.id}`, field.placeholder)}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {t(`forms:labels.${field.id}`, field.label)}
        {field.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>

      {field.placeholder && (
        <div id={`${fieldId}-description`} className="sr-only">
          {t(`forms:placeholders.${field.id}`, field.placeholder)}
        </div>
      )}

      {renderInput()}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-sm text-red-600 flex items-center"
        >
          <svg
            className="h-4 w-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {getErrorMessage()}
        </p>
      )}
    </div>
  );
};
