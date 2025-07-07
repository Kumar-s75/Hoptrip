import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  photo?: string;
  givenName?: string;
  familyName?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

class AuthService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  constructor() {
    // Add request interceptor to include auth token
    this.apiClient.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async googleSignIn(): Promise<AuthResponse> {
    if (Platform.OS === 'web') {
      return this.webGoogleSignIn();
    } else {
      return this.nativeGoogleSignIn();
    }
  }

  private async webGoogleSignIn(): Promise<AuthResponse> {
    // For web, you would implement Google OAuth flow
    // This is a placeholder for the actual implementation
    
    // Example using Google Identity Services for web
    // You would need to include the Google Identity Services script
    // and implement the OAuth flow
    
    throw new Error('Web Google Sign-In not implemented. Please implement Google Identity Services for web.');
  }

  private async nativeGoogleSignIn(): Promise<AuthResponse> {
    try {
      // For native platforms, you would use expo-auth-session or similar
      // This requires additional setup and configuration
      
      // Example implementation would look like:
      // import * as Google from 'expo-auth-session/providers/google';
      // const [request, response, promptAsync] = Google.useAuthRequest({
      //   clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      // });
      
      throw new Error('Native Google Sign-In not implemented. Please install and configure expo-auth-session.');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  async verifyGoogleToken(idToken: string): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post('/google-login', {
        idToken,
      });

      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await this.apiClient.get(`/user/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      // Additional logout logic if needed
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Mock login for development/testing
  async mockLogin(): Promise<AuthResponse> {
    const mockUser: User = {
      _id: 'mock-user-id',
      googleId: 'mock-google-id',
      name: 'Test User',
      email: 'test@example.com',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      givenName: 'Test',
      familyName: 'User',
    };

    const mockResponse: AuthResponse = {
      message: 'Mock login successful',
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };

    return mockResponse;
  }
}

export const authService = new AuthService();