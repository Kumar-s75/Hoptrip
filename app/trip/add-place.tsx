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
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

interface SearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  price_level?: number;
  types: string[];
}

export default function AddPlaceScreen() {
  const { tripId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      // Mock search results for demo
      // In production, integrate with Google Places API
      const mockResults: SearchResult[] = [
        {
          place_id: 'mock_1',
          name: `${query} Restaurant`,
          formatted_address: '123 Main St, City, State',
          rating: 4.5,
          price_level: 2,
          types: ['restaurant', 'food', 'establishment']
        },
        {
          place_id: 'mock_2',
          name: `${query} Museum`,
          formatted_address: '456 Culture Ave, City, State',
          rating: 4.2,
          types: ['museum', 'tourist_attraction', 'establishment']
        },
        {
          place_id: 'mock_3',
          name: `${query} Park`,
          formatted_address: '789 Nature Blvd, City, State',
          rating: 4.7,
          types: ['park', 'tourist_attraction', 'establishment']
        }
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching places:', error);
      Alert.alert('Error', 'Failed to search places');
    } finally {
      setLoading(false);
    }
  };

  const addPlaceToTrip = async (place: SearchResult) => {
    try {
      setLoading(true);
      
      // In production, this would call the actual API
      await axios.post(`http://localhost:8000/trip/${tripId}/addPlace`, {
        placeId: place.place_id
      });

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
        </View>
      </View>

      <ScrollView style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {searchResults.map((place) => (
              <Pressable
                key={place.place_id}
                onPress={() => addPlaceToTrip(place)}
                style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.placeName} numberOfLines={2}>
                    {place.name}
                  </Text>
                  {renderStars(place.rating)}
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

        {searchQuery.length > 0 && searchResults.length === 0 && !loading && (
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    paddingVertical: 80,
    paddingHorizontal: 40,
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
  },
});