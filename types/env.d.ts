declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: string;
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: string;
      EXPO_PUBLIC_API_BASE_URL: string;
      EXPO_PUBLIC_MONGODB_URI: string;
      EXPO_PUBLIC_JWT_SECRET: string;
      EXPO_PUBLIC_EMAIL_USER: string;
      EXPO_PUBLIC_EMAIL_PASS: string;
    }
  }
}

export {};