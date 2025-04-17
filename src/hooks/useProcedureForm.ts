import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { ProcedureForm, ProcedureFormField } from '../schemas/procedureForm';

const createFormSchema = (fields: ProcedureFormField[]) => {
  const schemaFields: Record<string, any> = {};

  fields.forEach((field) => {
    let fieldSchema = z.string();

    switch (field.type) {
      case 'number':
        fieldSchema = z.number();
        break;
      case 'email':
        fieldSchema = z.string().email();
        break;
      case 'tel':
        fieldSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
        break;
      case 'date':
        fieldSchema = z.string().datetime();
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
    }

    if (field.required) {
      fieldSchema = fieldSchema.nonempty();
    }

    if (field.validation) {
      if (field.validation.min !== undefined) {
        fieldSchema = fieldSchema.min(field.validation.min);
      }
      if (field.validation.max !== undefined) {
        fieldSchema = fieldSchema.max(field.validation.max);
      }
      if (field.validation.pattern) {
        fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern));
      }
      if (field.validation.minLength !== undefined) {
        fieldSchema = fieldSchema.min(field.validation.minLength);
      }
      if (field.validation.maxLength !== undefined) {
        fieldSchema = fieldSchema.max(field.validation.maxLength);
      }
    }

    schemaFields[field.id] = fieldSchema;
  });

  return z.object(schemaFields);
};

export const useProcedureForm = (procedureId: string) => {
  const { data: formData, isLoading } = useQuery<ProcedureForm>({
    queryKey: ['procedure-form', procedureId],
    queryFn: () => apiService.get(`${API_ENDPOINTS.procedures.forms}/${procedureId}`),
  });

  const formSchema = formData ? createFormSchema(formData.fields) : z.object({});
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData?.fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as Record<string, any>) || {},
  });

  return {
    form,
    formData,
    isLoading,
  };
};
