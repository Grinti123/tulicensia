export const validationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: {
    minLength: 'Password must be at least 8 characters',
    uppercase: 'Password must contain at least one uppercase letter',
    lowercase: 'Password must contain at least one lowercase letter',
    number: 'Password must contain at least one number',
    special: 'Password must contain at least one special character',
    match: 'Passwords do not match',
  },
  document: {
    dni: 'Please enter a valid DNI',
    ruc: 'Please enter a valid RUC',
    license: 'Please enter a valid license number',
  },
  date: {
    format: 'Please enter a valid date',
    min: (field: string, date: string) => `${field} must not be before ${date}`,
    max: (field: string, date: string) => `${field} must not be after ${date}`,
  },
  file: {
    size: (maxSize: number) => `File must not exceed ${maxSize}MB`,
    type: (allowedTypes: string[]) => `Only the following file types are allowed: ${allowedTypes.join(', ')}`,
  },
  number: {
    min: (field: string, min: number) => `${field} must be greater than or equal to ${min}`,
    max: (field: string, max: number) => `${field} must be less than or equal to ${max}`,
    integer: 'Please enter a valid integer',
    decimal: 'Please enter a valid decimal number',
  },
  select: {
    required: 'Please select an option',
  },
  checkbox: {
    required: 'You must accept the terms and conditions',
  },
} as const;
