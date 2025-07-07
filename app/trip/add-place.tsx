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
import { AntDesign } from '@expo/vector-icons';
import { googlePlacesService, PlaceSearchResult } from '@/services/googlePlaces';
import { apiService } from '@/services/api';

export default function AddPlaceScreen() {
  const { tripId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await googlePlacesService.searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching places:', error);
      
      // Fallback to mock data if API fails
      const mockResults: PlaceSearchResult[] = [
        {
          place_id: `mock_${Date.now()}_1`,
          name: `${query} Restaurant`,
          formatted_address: '123 Main St, City, State',
          rating: 4.5,
          price_level: 2,
          types: ['restaurant', 'food', 'establishment'],
          geometry: {
            location: { lat: 12.9716, lng: 77.5946 }
          }
        },
        {
          place_id: `mock_${Date.now()}_2`,
          name: `${query} Museum`,
          formatted_address: '456 Culture Ave, City, State',
          rating: 4.2,
          types: ['museum', 'tourist_attraction', 'establishment'],
          geometry: {
            location: { lat: 12.9716, lng: 77.5946 }
          }
        },
        {
          place_id: `mock_${Date.now()}_3`,
          name: `${query} Park`,
          formatted_address: '789 Nature Blvd, City, State',
          rating: 4.7,
          types: ['park', 'tourist_attraction', 'establishment'],
          geometry: {
            location: { lat: 12.9716, lng: 77.5946 }
          }
        }
      ];
      
      setSearchResults(mockResults);
      Alert.alert(
        'Using Mock Data',
        'Google Places API not configured. Using sample data for demonstration.'
      );
    } finally {
      setSearching(false);
    }
  };

  const addPlaceToTrip = async (place: PlaceSearchResult) => {
    try {
      setLoading(true);
      
      await apiService.addPlaceToTrip(tripId as string, place.place_id);

      Alert.alert('Success', 'Place added to trip!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding place:', error);
      Alert.alert('Error', 'Failed to add place to trip');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={i} style={styles.star}>★</Text>);
    }
    
    if (hasHalfStar) {
      stars.push(<Text key="half" style={styles.star}>☆</Text>);
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>{stars}</View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return null;
    
    const dollarSigns = '$'.repeat(priceLevel);
    return <Text style={styles.priceLevel}>{dollarSigns}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Add Place</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="gray" />
          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchPlaces(text);
            }}
            placeholder="Search for places to visit..."
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => searchPlaces(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}>
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          )}
          {searching && (
            <ActivityIndicator size="small" color="#4B61D1" />
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B61D1" />
            <Text style={styles.loadingText}>Adding place to trip...</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {searchResults.map((place) => (
              <Pressable
                key={place.place_id}
                onPress={() => addPlaceToTrip(place)}
                style={styles.resultCard}
                disabled={loading}>
                <View style={styles.resultHeader}>
                  <Text style={styles.placeName} numberOfLines={2}>
                    {place.name}
                  </Text>
                  <View style={styles.ratingPriceContainer}>
                    {renderStars(place.rating)}
                    {renderPriceLevel(place.price_level)}
                  </View>
                </View>
                
                <Text style={styles.placeAddress} numberOfLines={2}>
                  {place.formatted_address}
                </Text>

                <View style={styles.placeTypes}>
                  {place.types.slice(0, 3).map((type, index) => (
                    <View key={index} style={styles.typeTag}>
                      <Text style={styles.typeText}>
                        {type.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.addButtonContainer}>
                  <Text style={styles.addButtonText}>Tap to add to trip</Text>
                  <AntDesign name="plus" size={16} color="#4B61D1" />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {searchQuery.length > 0 && searchResults.length === 0 && !searching && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No places found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term</Text>
          </View>
        )}

        {searchQuery.length === 0 && (
          <View style={styles.instructionsContainer}>
            <AntDesign name="search1" size={48} color="#ccc" />
            <Text style={styles.instructionsTitle}>Search for Places</Text>
            <Text style={styles.instructionsText}>
              Start typing to search for restaurants, attractions, hotels, and more to add to your trip
            </Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Search Tips:</Text>
              <Text style={styles.tipText}>• Try "restaurants near me"</Text>
              <Text style={styles.tipText}>• Search for specific places like "Eiffel Tower"</Text>
              <Text style={styles.tipText}>• Use categories like "museums" or "parks"</Text>
            </View>
          </View>
        )}
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
  searchSection: {
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
  resultsContainer: {
    gap: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  ratingPriceContainer: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    color: '#FFD700',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    color: 'gray',
  },
  priceLevel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  placeAddress: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
    lineHeight: 18,
  },
  placeTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  typeTag: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: '#4B61D1',
    textTransform: 'capitalize',
  },
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#4B61D1',
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: 'gray',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  tipsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});