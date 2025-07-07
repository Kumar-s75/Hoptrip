import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await login();
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Login Error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = () => {
    setError('Email login not implemented yet. Please use Google Sign-In.');
  };

  const handleFacebookLogin = () => {
    setError('Facebook login not implemented yet. Please use Google Sign-In.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=240&h=80&fit=crop' }}
        />
        <Text style={styles.appName}>HopTrip</Text>
        <Text style={styles.tagline}>Plan your perfect journey</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleFacebookLogin}
          style={styles.button}>
          <AntDesign
            style={styles.buttonIcon}
            name="facebook-square"
            size={24}
            color="#1877F2"
          />
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </Pressable>

        <Pressable
          onPress={handleGoogleLogin}
          disabled={loading}
          style={[styles.button, styles.pressableButton, loading && styles.buttonDisabled]}>
          <AntDesign
            style={styles.buttonIcon}
            name="google"
            size={24}
            color="#DB4437"
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.buttonText}>Signing in...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </Pressable>

        <Pressable onPress={handleEmailLogin} style={styles.button}>
          <AntDesign
            style={styles.buttonIcon}
            name="mail"
            size={24}
            color="#666"
          />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </Pressable>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {Platform.OS === 'web' 
              ? 'Demo mode: Click Google Sign-In to continue with mock authentication'
              : 'Google Sign-In requires additional setup for native platforms'
            }
          </Text>
        </View>

        <Pressable style={styles.signInLink}>
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
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
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 240,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressableButton: {
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    position: 'absolute',
    left: 16,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    color: '#0369A1',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#4B61D1',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});