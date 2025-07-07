import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { authService, User, AuthResponse } from '@/services/auth';

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  userInfo: User | null;
  setUserInfo: (userInfo: User | null) => void;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = async (newToken: string) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem('authToken', newToken);
      try {
        const decodedToken = jwtDecode(newToken) as any;
        setUserId(decodedToken.userId);
        
        // Fetch user profile
        if (decodedToken.userId) {
          try {
            const user = await authService.getUserProfile(decodedToken.userId);
            setUserInfo(user);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      await AsyncStorage.removeItem('authToken');
      setUserId('');
      setUserInfo(null);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      
      // Try real Google Sign-In first, fallback to mock
      let authResponse: AuthResponse;
      
      try {
        authResponse = await authService.googleSignIn();
      } catch (error) {
        console.log('Google Sign-In not available, using mock login');
        authResponse = await authService.mockLogin();
      }

      await setToken(authResponse.token);
      setUserInfo(authResponse.user);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await setToken('');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      await setToken('');
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken) as any;
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp > currentTime) {
            setTokenState(storedToken);
            setUserId(decodedToken.userId);
            
            // Fetch user profile
            try {
              const user = await authService.getUserProfile(decodedToken.userId);
              setUserInfo(user);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              // If profile fetch fails, create mock user info
              setUserInfo({
                _id: decodedToken.userId,
                googleId: 'mock-google-id',
                name: 'Test User',
                email: 'test@example.com',
                photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
              });
            }
          } else {
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    token,
    setToken,
    userId,
    setUserId,
    userInfo,
    setUserInfo,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };