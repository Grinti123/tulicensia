import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useProcedureForm } from '../hooks/useProcedureForm';
import { FormField } from './FormField';
import { apiService } from '../services/api';
import { API_ENDPOINTS } from '../config/api';

interface ProcedureBookingFormProps {
  procedureId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const ProcedureBookingForm: React.FC<ProcedureBookingFormProps> = ({
  procedureId,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation(['common', 'forms', 'errors']);
  const { form, formData, isLoading } = useProcedureForm(procedureId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiService.post(API_ENDPOINTS.procedures.book, {
        procedureId,
        formData: data,
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error
        ? t(`errors:${error.message}`)
        : t('errors:general.somethingWentWrong');
      setSubmitError(errorMessage);
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-8"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">{t('common:loading')}</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div
        role="alert"
        className="bg-red-50 border-l-4 border-red-500 p-4"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {t('errors:form.submissionFailed')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      aria-labelledby="form-title"
    >
      <h2
        id="form-title"
        className="text-2xl font-semibold mb-6"
      >
        {formData.name}
      </h2>

      <p className="text-gray-600 mb-6">
        {formData.description}
      </p>

      {submitError && (
        <div
          role="alert"
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            </div>
          </div>
        </div>
      )}

      {formData.fields.map((field) => (
        <FormField key={field.id} field={field} form={form} />
      ))}

      <button
        type="submit"
        disabled={isSubmitting || form.formState.isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
          isSubmitting || form.formState.isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        }`}
        aria-busy={isSubmitting || form.formState.isSubmitting}
      >
        {isSubmitting || form.formState.isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('common:loading')}
          </span>
        ) : (
          t('forms:buttons.bookNow')
        )}
      </button>
    </form>
  );
};
