import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { googlePlacesService, PlaceDetails } from '@/services/googlePlaces';
import { apiService } from '@/services/api';

export default function DefineActivityScreen() {
  const { tripId, activityType, date } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const results = await googlePlacesService.searchPlaces(query);
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedPlace(firstResult);
        await fetchPlaceDetails(firstResult.place_id);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      
      // Fallback to mock data
      const mockPlace = {
        place_id: `mock_${Date.now()}`,
        name: query,
        formatted_address: 'Sample Address, City',
        rating: 4.5,
        price_level: 2,
        types: ['restaurant', 'food', 'establishment'],
        geometry: {
          location: { lat: 12.9716, lng: 77.5946 }
        }
      };

      setSelectedPlace(mockPlace);
      await fetchMockPlaceDetails(mockPlace.place_id, query);
      
      Alert.alert(
        'Using Mock Data',
        'Google Places API not configured. Using sample data for demonstration.'
      );
    } finally {
      setSearching(false);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const details = await googlePlacesService.getPlaceDetails(placeId);
      setPlaceDetails(details);
    } catch (error) {
      console.error('Error fetching place details:', error);
      await fetchMockPlaceDetails(placeId, selectedPlace?.name || searchQuery);
    }
  };

  const fetchMockPlaceDetails = async (placeId: string, name: string) => {
    const mockDetails: PlaceDetails = {
      place_id: placeId,
      name: name,
      formatted_address: 'Sample Address, City, State',
      formatted_phone_number: '+1 (555) 123-4567',
      website: 'https://example.com',
      opening_hours: {
        weekday_text: ['Monday: 9:00 AM – 10:00 PM'],
        open_now: true,
      },
      photos: [
        {
          photo_reference: 'mock_photo_ref',
          height: 400,
          width: 400,
        }
      ],
      reviews: [
        {
          author_name: 'John Doe',
          rating: 5,
          text: 'Great place to visit!',
          time: Date.now(),
        }
      ],
      types: ['restaurant', 'food', 'establishment'],
      geometry: {
        location: { lat: 12.9716, lng: 77.5946 },
        viewport: {
          northeast: { lat: 12.9816, lng: 77.6046 },
          southwest: { lat: 12.9616, lng: 77.5846 },
        },
      },
      editorial_summary: {
        overview: 'A wonderful place to experience local culture and cuisine.',
      },
    };

    setPlaceDetails(mockDetails);
  };

  const handleAddToItinerary = async () => {
    if (!selectedPlace || !placeDetails) {
      Alert.alert('Error', 'Please select a place first');
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        name: placeDetails.name,
        date: date as string,
        phoneNumber: placeDetails.formatted_phone_number,
        website: placeDetails.website,
        openingHours: placeDetails.opening_hours?.weekday_text,
        photos: placeDetails.photos?.map(photo => 
          googlePlacesService.getPhotoUrl(photo.photo_reference)
        ).filter(Boolean) || ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'],
        reviews: placeDetails.reviews?.map(review => ({
          authorName: review.author_name,
          rating: review.rating,
          text: review.text,
        })),
        briefDescription: placeDetails.editorial_summary?.overview || 
                         placeDetails.reviews?.[0]?.text || 
                         'A great place to visit during your trip.',
        geometry: placeDetails.geometry,
      };

      await apiService.addActivityToItinerary(tripId as string, date as string, activityData);
      
      Alert.alert('Success', 'Activity added to itinerary!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error', 'Failed to add activity to itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    router.push({
      pathname: '/activity/manual',
      params: { tripId, activityType, date }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Add {activityType}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <AntDesign name="search1" size={23} color="white" />
            </View>
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => searchPlaces(searchQuery)}
              placeholderTextColor={'gray'}
              style={styles.searchInput}
              placeholder={`Search for ${activityType}`}
              returnKeyType="search"
            />
            {searching && (
              <ActivityIndicator size="small" color="#4B61D1" />
            )}
          </View>
          
          {searchQuery && (
            <Pressable 
              onPress={() => searchPlaces(searchQuery)}
              style={styles.searchButton}
              disabled={searching}>
              <Text style={styles.searchButtonText}>
                {searching ? 'Searching...' : 'Search'}
              </Text>
            </Pressable>
          )}
        </View>

        {selectedPlace && (
          <View style={styles.selectedPlaceCard}>
            <View style={styles.placeHeader}>
              <Text style={styles.placeName}>{selectedPlace.name}</Text>
              <Pressable 
                onPress={handleAddToItinerary} 
                style={[styles.addButton, loading && styles.addButtonDisabled]}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add to Itinerary</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {placeDetails && (
          <View style={styles.placeDetailsCard}>
            {placeDetails.formatted_phone_number && (
              <View style={styles.detailRow}>
                <AntDesign name="phone" size={23} color="#2a52be" />
                <Text style={styles.detailText}>{placeDetails.formatted_phone_number}</Text>
              </View>
            )}

            {placeDetails.opening_hours?.weekday_text?.[0] && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={23} color="#2a52be" />
                <Text style={styles.detailText}>
                  {placeDetails.opening_hours.open_now ? 'Open now • ' : 'Closed • '}
                  {placeDetails.opening_hours.weekday_text[0].split(': ')[1]}
                </Text>
              </View>
            )}

            {placeDetails.website && (
              <View style={styles.detailRow}>
                <Ionicons name="earth" size={23} color="#2a52be" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {placeDetails.website}
                </Text>
              </View>
            )}

            {placeDetails.formatted_address && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={23} color="#2a52be" />
                <Text style={styles.detailText}>{placeDetails.formatted_address}</Text>
              </View>
            )}

            {placeDetails.editorial_summary?.overview && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>About this place</Text>
                <Text style={styles.descriptionText}>
                  {placeDetails.editorial_summary.overview}
                </Text>
              </View>
            )}

            {placeDetails.reviews && placeDetails.reviews.length > 0 && (
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsTitle}>Recent Review</Text>
                <View style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>
                      {placeDetails.reviews[0].author_name}
                    </Text>
                    <View style={styles.reviewRating}>
                      <Text style={styles.reviewRatingText}>
                        {placeDetails.reviews[0].rating}
                      </Text>
                      <Text style={styles.reviewStar}>★</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText} numberOfLines={3}>
                    {placeDetails.reviews[0].text}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.manualEntrySection}>
          <Pressable onPress={handleManualEntry} style={styles.manualEntryButton}>
            <AntDesign name="edit" size={20} color="#666" />
            <Text style={styles.manualEntryText}>Enter Manually</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  searchIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: '#4B61D1',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedPlaceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4B61D1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  placeDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#2a52be',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewStar: {
    color: '#FFD700',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  manualEntrySection: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  manualEntryText: {
    fontWeight: '500',
    color: '#666',
    fontSize: 16,
  },
});