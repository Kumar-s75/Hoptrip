import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as GoogleSignIn from 'expo-google-sign-in';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const LoginScreen = () => {
  const { setToken } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initializeGoogleSignIn = async () => {
    try {
      await GoogleSignIn.initAsync({
        clientId: '847080271209-dctpn8t7hbdactkruq9n72stqqnhfht2.apps.googleusercontent.com',
      });
    } catch (error) {
      console.log('Google Sign-In initialization error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await initializeGoogleSignIn();
      
      const result = await GoogleSignIn.signInAsync();
      
      if (result.type === 'success') {
        const { idToken } = result;
        
        if (idToken) {
          // Send idToken to the backend
          const backendResponse = await axios.post(
            'http://localhost:8000/google-login',
            {
              idToken: idToken,
            },
          );

          const data = backendResponse.data;
          console.log('Backend Response:', data);

          await setToken(data.token);
        }
      }
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
          source={{ uri: 'https://wanderlog.com/assets/logoWithText.png' }}
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
        }

        <Pressable style={styles.signInLink}>
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

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

export default LoginScreen;