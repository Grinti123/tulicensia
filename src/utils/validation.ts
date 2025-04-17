import { validationMessages } from '../locales/es/validation';

type ValidationRule = {
  type: keyof typeof validationMessages;
  params?: any[];
};

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export const validateField = (
  value: string | number | File | null | undefined,
  rules: ValidationRule[],
  fieldName: string
): ValidationResult => {
  for (const rule of rules) {
    const result = validateRule(value, rule, fieldName);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};

const validateRule = (
  value: string | number | File | null | undefined,
  rule: ValidationRule,
  fieldName: string
): ValidationResult => {
  const { type, params = [] } = rule;

  switch (type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return {
          isValid: false,
          message: validationMessages.required(fieldName),
        };
      }
      break;

    case 'minLength':
      if (typeof value === 'string' && value.length < params[0]) {
        return {
          isValid: false,
          message: validationMessages.minLength(fieldName, params[0]),
        };
      }
      break;

    case 'maxLength':
      if (typeof value === 'string' && value.length > params[0]) {
        return {
          isValid: false,
          message: validationMessages.maxLength(fieldName, params[0]),
        };
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return {
          isValid: false,
          message: validationMessages.email,
        };
      }
      break;

    case 'phone':
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (typeof value === 'string' && !phoneRegex.test(value)) {
        return {
          isValid: false,
          message: validationMessages.phone,
        };
      }
      break;

    case 'number':
      if (typeof value === 'string' && isNaN(Number(value))) {
        return {
          isValid: false,
          message: validationMessages.number.decimal,
        };
      }
      if (params[0] !== undefined && Number(value) < params[0]) {
        return {
          isValid: false,
          message: validationMessages.number.min(fieldName, params[0]),
        };
      }
      if (params[1] !== undefined && Number(value) > params[1]) {
        return {
          isValid: false,
          message: validationMessages.number.max(fieldName, params[1]),
        };
      }
      break;

    case 'file':
      if (value instanceof File) {
        if (params[0] && value.size > params[0] * 1024 * 1024) {
          return {
            isValid: false,
            message: validationMessages.file.size(params[0]),
          };
        }
        if (params[1] && !params[1].includes(value.type)) {
          return {
            isValid: false,
            message: validationMessages.file.type(params[1]),
          };
        }
      }
      break;

    case 'document':
      if (typeof value === 'string') {
        const documentType = params[0];
        const documentRegex = {
          dni: /^\d{8}$/,
          ruc: /^\d{11}$/,
          license: /^[A-Z0-9]{6,}$/,
        }[documentType];

        if (documentRegex && !documentRegex.test(value)) {
          return {
            isValid: false,
            message: validationMessages.document[documentType],
          };
        }
      }
      break;
  }

  return { isValid: true };
};

export const validateForm = (
  formData: Record<string, any>,
  validationRules: Record<string, ValidationRule[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const value = formData[fieldName];
    const result = validateField(value, rules, fieldName);

    if (!result.isValid && result.message) {
      errors[fieldName] = result.message;
    }
  }

  return errors;
};
