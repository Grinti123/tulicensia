import { validationMessages } from '../locales/es/validation';

export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const validateDate = (
  date: string | Date,
  fieldName: string,
  minDate?: Date,
  maxDate?: Date
): { isValid: boolean; message?: string } => {
  if (!isValidDate(date)) {
    return {
      isValid: false,
      message: validationMessages.date.format,
    };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (minDate && dateObj < minDate) {
    return {
      isValid: false,
      message: validationMessages.date.min(fieldName, formatDate(minDate)),
    };
  }

  if (maxDate && dateObj > maxDate) {
    return {
      isValid: false,
      message: validationMessages.date.max(fieldName, formatDate(maxDate)),
    };
  }

  return { isValid: true };
};
