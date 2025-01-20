import axios, { AxiosError, AxiosInstance } from 'axios';
import { APIConfig, APIErrorResponse } from '../types/api';

export class APIClient {
  private client: AxiosInstance;
  private currentConfig: APIConfig;

  constructor(apiKey: string = '', baseURL: string = 'https://api.openai.com/v1') {
    this.currentConfig = new APIConfig(apiKey, baseURL);
    this.client = axios.create({
      baseURL: this.currentConfig.baseURL,
      headers: {
        'Authorization': `Bearer ${this.currentConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      this.handleError
    );

    // Add request interceptor to update Authorization header
    this.client.interceptors.request.use(
      config => {
        config.headers['Authorization'] = `Bearer ${this.currentConfig.apiKey}`;
        return config;
      },
      error => Promise.reject(error)
    );
  }

  public updateConfig(apiKey: string, baseURL: string) {
    this.currentConfig = new APIConfig(apiKey, baseURL);
    this.client.defaults.baseURL = this.currentConfig.baseURL;
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
