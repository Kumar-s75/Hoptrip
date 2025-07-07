import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  userInfo: User | null;
  setUserInfo: (userInfo: User | null) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const setToken = async (newToken: string) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem('authToken', newToken);
      try {
        const decodedToken = jwtDecode(newToken) as any;
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      await AsyncStorage.removeItem('authToken');
      setUserId('');
      setUserInfo(null);
    }
  };

  const logout = async () => {
    await setToken('');
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
          } else {
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await logout();
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
    logout,
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