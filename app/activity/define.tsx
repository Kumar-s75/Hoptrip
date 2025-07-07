import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function DefineActivityScreen() {
  const { tripId, activityType, date } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) return;

    try {
      // This would integrate with Google Places API
      // For now, we'll simulate a search result
      const mockPlace = {
        place_id: 'mock_place_id',
        name: query,
        formatted_address: 'Sample Address, City',
        rating: 4.5,
        price_level: 2,
        types: ['restaurant', 'food', 'establishment'],
        geometry: {
          location: {
            lat: 12.9716,
            lng: 77.5946
          }
        }
      };

      setSelectedPlace(mockPlace);
      fetchPlaceDetails(mockPlace.place_id);
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      // Mock place details
      const mockDetails = {
        name: selectedPlace?.name || searchQuery,
        phoneNumber: '+91 98765 43210',
        website: 'https://example.com',
        openingHours: ['Monday: 9:00 AM – 10:00 PM'],
        photos: ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400'],
        reviews: [
          {
            authorName: 'John Doe',
            rating: 5,
            text: 'Great place to visit!'
          }
        ],
        briefDescription: 'A wonderful place to experience local culture and cuisine.',
        geometry: {
          location: {
            lat: 12.9716,
            lng: 77.5946
          }
        }
      };

      setPlaceDetails(mockDetails);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleAddToItinerary = async () => {
    if (!selectedPlace || !placeDetails) {
      Alert.alert('Error', 'Please select a place first');
      return;
    }

    try {
      const activityData = {
        name: placeDetails.name,
        date: date,
        phoneNumber: placeDetails.phoneNumber,
        website: placeDetails.website,
        openingHours: placeDetails.openingHours,
        photos: placeDetails.photos,
        reviews: placeDetails.reviews,
        briefDescription: placeDetails.briefDescription,
        geometry: placeDetails.geometry,
      };

      await axios.post(`http://localhost:8000/trips/${tripId}/itinerary/${date}`, activityData);
      
      Alert.alert('Success', 'Activity added to itinerary!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error', 'Failed to add activity to itinerary');
    }
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
          </View>
          
          {searchQuery && (
            <Pressable 
              onPress={() => searchPlaces(searchQuery)}
              style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </Pressable>
          )}
        </View>

        {selectedPlace && (
          <View style={styles.selectedPlaceCard}>
            <View style={styles.placeHeader}>
              <Text style={styles.placeName}>{selectedPlace.name}</Text>
              <Pressable onPress={handleAddToItinerary} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Itinerary</Text>
              </Pressable>
            </View>
          </View>
        )}

        {placeDetails && (
          <View style={styles.placeDetailsCard}>
            {placeDetails.phoneNumber && (
              <View style={styles.detailRow}>
                <AntDesign name="phone" size={23} color="#2a52be" />
                <Text style={styles.detailText}>{placeDetails.phoneNumber}</Text>
              </View>
            )}

            {placeDetails.openingHours && placeDetails.openingHours[0] && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={23} color="#2a52be" />
                <Text style={styles.detailText}>
                  Open {placeDetails.openingHours[0].split(': ')[1]}
                </Text>
              </View>
            )}

            {placeDetails.website && (
              <View style={styles.detailRow}>
                <Ionicons name="earth" size={23} color="#2a52be" />
                <Text style={styles.detailText}>{placeDetails.website}</Text>
              </View>
            )}

            {placeDetails.briefDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>About this place</Text>
                <Text style={styles.descriptionText}>{placeDetails.briefDescription}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.manualEntrySection}>
          <Pressable style={styles.manualEntryButton}>
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
    backgroundColor: 'pink',
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
  manualEntrySection: {
    alignItems: 'center',
    marginTop: 30,
  },
  manualEntryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  manualEntryText: {
    fontWeight: '500',
    color: 'gray',
    fontSize: 16,
  },
});