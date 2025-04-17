export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }

  return phone;
};

export const maskString = (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
  if (str.length <= visibleChars * 2) return str;
  const start = str.substring(0, visibleChars);
  const end = str.substring(str.length - visibleChars);
  return start + maskChar.repeat(str.length - visibleChars * 2) + end;
};

export const formatDocumentNumber = (document: string, type: 'dni' | 'ruc' | 'license'): string => {
  const cleaned = document.replace(/\D/g, '');

  switch (type) {
    case 'dni':
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    case 'ruc':
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4');
    case 'license':
      return cleaned.toUpperCase();
    default:
      return document;
  }
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const extractEmails = (text: string): string[] => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};
