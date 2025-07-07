import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (Platform.OS === 'web') {
        // Web implementation would go here
        setError('Google Sign-In not implemented for web yet');
        return;
      }

      // For now, simulate a successful login for development
      // In production, implement proper Google Sign-In
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            _id: 'mock-user-id',
            name: 'Test User',
            email: 'test@example.com',
          }
        }
      };

      await setToken(mockResponse.data.token);
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Login Error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=240&h=80&fit=crop' }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <AntDesign
            style={styles.buttonIcon}
            name="facebook-square"
            size={24}
            color="blue"
          />
          <Text style={styles.buttonText}>Sign Up With Facebook</Text>
        </View>

        <Pressable
          onPress={handleGoogleLogin}
          disabled={loading}
          style={[styles.button, styles.pressableButton]}>
          <AntDesign
            style={styles.buttonIcon}
            name="google"
            size={24}
            color="red"
          />
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign Up With Google'}
          </Text>
        </Pressable>

        <View style={styles.button}>
          <AntDesign
            style={styles.buttonIcon}
            name="mail"
            size={24}
            color="black"
          />
          <Text style={styles.buttonText}>Sign Up With Email</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.signInLink}>
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 80,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 70,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    borderColor: '#E0E0E0',
    margin: 12,
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 20,
    position: 'relative',
  },
  pressableButton: {
    opacity: 1,
  },
  buttonIcon: {
    position: 'absolute',
    left: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  signInLink: {
    marginTop: 12,
  },
  signInText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'gray',
  },
});