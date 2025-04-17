import axios from 'axios';
import { apiService } from '../api';
import { sanitizeObject } from '../../utils/sanitize';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock sanitizeObject
jest.mock('../../utils/sanitize', () => ({
  sanitizeObject: jest.fn((obj) => obj),
}));

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnThis();
  });

  describe('GET requests', () => {
    it('makes a GET request with correct configuration', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await apiService.get('/test');

      expect(mockedAxios.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('handles GET request errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(apiService.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('POST requests', () => {
    it('makes a POST request with sanitized data', async () => {
      const mockData = { name: 'Test' };
      const sanitizedData = { name: 'Sanitized Test' };
      (sanitizeObject as jest.Mock).mockReturnValueOnce(sanitizedData);
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });

      await apiService.post('/test', mockData);

      expect(sanitizeObject).toHaveBeenCalledWith(mockData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/test', sanitizedData, undefined);
    });

    it('handles POST request errors', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(apiService.post('/test', {})).rejects.toThrow('Network error');
    });
  });

  describe('PUT requests', () => {
    it('makes a PUT request with sanitized data', async () => {
      const mockData = { name: 'Test' };
      const sanitizedData = { name: 'Sanitized Test' };
      (sanitizeObject as jest.Mock).mockReturnValueOnce(sanitizedData);
      mockedAxios.put.mockResolvedValueOnce({ data: mockData });

      await apiService.put('/test', mockData);

      expect(sanitizeObject).toHaveBeenCalledWith(mockData);
      expect(mockedAxios.put).toHaveBeenCalledWith('/test', sanitizedData, undefined);
    });
  });

  describe('DELETE requests', () => {
    it('makes a DELETE request', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

      await apiService.delete('/test');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/test', undefined);
    });
  });

  describe('CSRF token handling', () => {
    it('stores CSRF token from response headers', async () => {
      const csrfToken = 'test-csrf-token';
      mockedAxios.get.mockResolvedValueOnce({
        data: {},
        headers: { 'x-csrf-token': csrfToken },
      });

      await apiService.get('/test');

      // Verify CSRF token is added to subsequent requests
      mockedAxios.post.mockResolvedValueOnce({ data: {} });
      await apiService.post('/test', {});

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/test',
        {},
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-CSRF-Token': csrfToken,
          }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('redirects to login on 401 error', async () => {
      const error = {
        response: { status: 401 },
      };
      mockedAxios.get.mockRejectedValueOnce(error);

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { ...originalLocation, href: '' };

      await expect(apiService.get('/test')).rejects.toEqual(error);
      expect(window.location.href).toBe('/login');

      // Restore window.location
      window.location = originalLocation;
    });
  });
});
