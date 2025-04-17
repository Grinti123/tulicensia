export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  procedures: {
    getAll: `${API_BASE_URL}/procedures`,
    getById: (id: string) => `${API_BASE_URL}/procedures/${id}`,
    getCategories: `${API_BASE_URL}/procedures/categories`,
  },
  forms: {
    submit: `${API_BASE_URL}/forms/submit`,
  },
} as const;
