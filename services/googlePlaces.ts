import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  price_level?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now: boolean;
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  types: string[];
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
  editorial_summary?: {
    overview: string;
  };
}

class GooglePlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Please set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your environment variables.');
    }
  }

  async searchPlaces(query: string, location?: string): Promise<PlaceSearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    try {
      const params = {
        query,
        key: this.apiKey,
        ...(location && { location }),
      };

      const response = await axios.get(`${GOOGLE_PLACES_BASE_URL}/textsearch/json`, {
        params,
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    try {
      const params = {
        place_id: placeId,
        key: this.apiKey,
        fields: 'place_id,name,formatted_address,formatted_phone_number,website,opening_hours,photos,reviews,types,geometry,editorial_summary',
      };

      const response = await axios.get(`${GOOGLE_PLACES_BASE_URL}/details/json`, {
        params,
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.apiKey) {
      return '';
    }

    return `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type?: string
  ): Promise<PlaceSearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    try {
      const params = {
        location: `${latitude},${longitude}`,
        radius: radius.toString(),
        key: this.apiKey,
        ...(type && { type }),
      };

      const response = await axios.get(`${GOOGLE_PLACES_BASE_URL}/nearbysearch/json`, {
        params,
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.results;
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      throw error;
    }
  }
}

export const googlePlacesService = new GooglePlacesService();