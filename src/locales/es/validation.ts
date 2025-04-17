export const validationMessages = {
  required: (field: string) => `${field} es requerido`,
  minLength: (field: string, length: number) => `${field} debe tener al menos ${length} caracteres`,
  maxLength: (field: string, length: number) => `${field} no debe exceder ${length} caracteres`,
  email: 'Por favor ingrese un correo electrónico válido',
  phone: 'Por favor ingrese un número de teléfono válido',
  password: {
    minLength: 'La contraseña debe tener al menos 8 caracteres',
    uppercase: 'La contraseña debe contener al menos una letra mayúscula',
    lowercase: 'La contraseña debe contener al menos una letra minúscula',
    number: 'La contraseña debe contener al menos un número',
    special: 'La contraseña debe contener al menos un carácter especial',
    match: 'Las contraseñas no coinciden',
  },
  document: {
    dni: 'Por favor ingrese un DNI válido',
    ruc: 'Por favor ingrese un RUC válido',
    license: 'Por favor ingrese un número de licencia válido',
  },
  date: {
    format: 'Por favor ingrese una fecha válida',
    min: (field: string, date: string) => `${field} no debe ser anterior a ${date}`,
    max: (field: string, date: string) => `${field} no debe ser posterior a ${date}`,
  },
  file: {
    size: (maxSize: number) => `El archivo no debe exceder ${maxSize}MB`,
    type: (allowedTypes: string[]) => `Solo se permiten archivos de tipo: ${allowedTypes.join(', ')}`,
  },
  number: {
    min: (field: string, min: number) => `${field} debe ser mayor o igual a ${min}`,
    max: (field: string, max: number) => `${field} debe ser menor o igual a ${max}`,
    integer: 'Por favor ingrese un número entero',
    decimal: 'Por favor ingrese un número decimal válido',
  },
  select: {
    required: 'Por favor seleccione una opción',
  },
  checkbox: {
    required: 'Debe aceptar los términos y condiciones',
  },
} as const;
