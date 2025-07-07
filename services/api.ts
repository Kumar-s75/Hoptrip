import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface Trip {
  _id: string;
  tripName: string;
  startDate: string;
  endDate: string;
  startDay: string;
  endDay: string;
  background: string;
  host: string;
  travelers: string[];
  itinerary: ItineraryDay[];
  placesToVisit: Place[];
  budget?: number;
  expenses: Expense[];
  createdAt: string;
}

export interface ItineraryDay {
  date: string;
  activities: Activity[];
}

export interface Activity {
  _id?: string;
  name: string;
  date: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photos?: string[];
  reviews?: Review[];
  briefDescription?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface Place {
  _id?: string;
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photos: string[];
  reviews?: Review[];
  types?: string[];
  formatted_address: string;
  briefDescription: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
}

export interface Review {
  authorName: string;
  rating: number;
  text: string;
}

export interface Expense {
  _id?: string;
  category: string;
  price: number;
  paidBy: string;
  splitBy: string;
}

export interface CreateTripData {
  tripName: string;
  startDate: string;
  endDate: string;
  startDay: string;
  endDay: string;
  background: string;
  host: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Trip Management
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const response = await this.client.post('/trip', tripData);
    return response.data;
  }

  async getUserTrips(userId: string): Promise<Trip[]> {
    const response = await this.client.get(`/trips/${userId}`);
    return response.data;
  }

  async getTripById(tripId: string): Promise<Trip> {
    const response = await this.client.get(`/trip/${tripId}`);
    return response.data;
  }

  // Places Management
  async addPlaceToTrip(tripId: string, placeId: string): Promise<Trip> {
    const response = await this.client.post(`/trip/${tripId}/addPlace`, {
      placeId,
    });
    return response.data;
  }

  async getTripPlaces(tripId: string): Promise<Place[]> {
    const response = await this.client.get(`/trip/${tripId}/placesToVisit`);
    return response.data;
  }

  // Itinerary Management
  async getTripItinerary(tripId: string): Promise<ItineraryDay[]> {
    const response = await this.client.get(`/trip/${tripId}/itinerary`);
    return response.data;
  }

  async addActivityToItinerary(
    tripId: string,
    date: string,
    activity: Omit<Activity, '_id'>
  ): Promise<{ message: string; itinerary: ItineraryDay[] }> {
    const response = await this.client.post(`/trips/${tripId}/itinerary/${date}`, activity);
    return response.data;
  }

  // Budget and Expenses
  async setBudget(tripId: string, budget: number): Promise<{ message: string; trip: Trip }> {
    const response = await this.client.put(`/setBudget/${tripId}`, { budget });
    return response.data;
  }

  async addExpense(
    tripId: string,
    expense: Omit<Expense, '_id'>
  ): Promise<{ message: string; trip: Trip }> {
    const response = await this.client.post(`/addExpense/${tripId}`, expense);
    return response.data;
  }

  async getTripExpenses(tripId: string): Promise<{ expenses: Expense[] }> {
    const response = await this.client.get(`/getExpenses/${tripId}`);
    return response.data;
  }

  // Trip Invitations
  async sendTripInvitation(invitationData: {
    email: string;
    tripId: string;
    tripName: string;
    senderName: string;
  }): Promise<{ message: string }> {
    const response = await this.client.post('/sendInviteEmail', invitationData);
    return response.data;
  }

  async joinTrip(tripId: string, email: string): Promise<{ message: string }> {
    const response = await this.client.get('/joinTrip', {
      params: { tripId, email },
    });
    return response.data;
  }
}

export const apiService = new ApiService();