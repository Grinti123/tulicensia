import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/api';
import { sanitizeObject } from '../utils/sanitize';

class ApiService {
  private instance: AxiosInstance;
  private csrfToken: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Sanitize request data
        if (config.data) {
          config.data = sanitizeObject(config.data);
        }

        // Add CSRF token if available
        if (this.csrfToken) {
          config.headers['X-CSRF-Token'] = this.csrfToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Store CSRF token from response
        const csrfToken = response.headers['x-csrf-token'];
        if (csrfToken) {
          this.csrfToken = csrfToken;
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
