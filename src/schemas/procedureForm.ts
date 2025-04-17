import { z } from 'zod';

export const procedureFormFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'email', 'tel', 'date', 'textarea', 'select', 'checkbox']),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
  }).optional(),
});

export const procedureFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  fields: z.array(procedureFormFieldSchema),
});

export type ProcedureFormField = z.infer<typeof procedureFormFieldSchema>;
export type ProcedureForm = z.infer<typeof procedureFormSchema>;
