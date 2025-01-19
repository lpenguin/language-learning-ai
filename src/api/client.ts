import axios, { AxiosError, AxiosInstance } from 'axios';
import { APIConfig, APIErrorResponse } from '../types/api';
import { API_CONFIG } from '../config/api';

export class APIClient {
  private client: AxiosInstance;

  constructor(config: APIConfig = API_CONFIG) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  private handleError(error: AxiosError): never {
    const response: APIErrorResponse = {
      message: 'An unexpected error occurred',
      status: error.response?.status
    };

    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      response.message = (error.response.data as any).error.message;
    } else if (error.message) {
      response.message = error.message;
    }

    throw response;
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  public async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }
}

// Export a singleton instance
export const apiClient = new APIClient();
