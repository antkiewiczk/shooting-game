import { apiClient } from './api/client';

export interface GenerateTokenRequest {
  email: string;
}

export interface GenerateTokenResponse {
  token: string;
}

const TOKEN_KEY = 'auth_token';

export class AuthService {
  async generateToken(email: string): Promise<string> {
    const response = await apiClient.postUnauthenticated<GenerateTokenResponse>('/auth/token', { email });
    return response.token;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  initialize(): void {
    const token = this.getToken();
    if (token) {
      apiClient.setToken(token);
    }
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.setToken(token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    apiClient.clearToken();
  }
}

export const authService = new AuthService();
