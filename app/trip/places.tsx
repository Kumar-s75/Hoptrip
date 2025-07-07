import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import axios from 'axios';

interface Place {
  _id: string;
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photos: string[];
  reviews?: any[];
  types?: string[];
  formatted_address: string;
  briefDescription: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function TripPlacesScreen() {
  const { tripId } = useLocalSearchParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

  useEffect(() => {
    fetchPlaces();
  }, [tripId]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/trip/${tripId}/placesToVisit`);
      setPlaces(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  };

  const togglePlaceSelection = (placeName: string) => {
    setSelectedPlaces(prev => 
      prev.includes(placeName) 
        ? prev.filter(name => name !== placeName)
        : [...prev, placeName]
    );
  };

  const handleViewOnMap = () => {
    if (places.length === 0) {
      Alert.alert('No Places', 'No places to show on map');
      return;
    }
    
    router.push({
      pathname: '/trip/map',
      params: { 
        tripId,
        places: JSON.stringify(places)
      }
    });
  };

  const handleAddPlace = () => {
    router.push({
      pathname: '/trip/add-place',
      params: { tripId }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading places...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Places to Visit</Text>
        <Pressable onPress={handleViewOnMap}>
          <Ionicons name="map" size={24} color="orange" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {places.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No places added yet</Text>
            <Text style={styles.emptySubtitle}>Add places you want to visit during your trip</Text>
            <Pressable onPress={handleAddPlace} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Place</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.actionsBar}>
              <Pressable onPress={handleAddPlace} style={styles.addPlaceButton}>
                <AntDesign name="plus" size={20} color="white" />
                <Text style={styles.addPlaceText}>Add Place</Text>
              </Pressable>
            </View>

            {places.map((place, index) => (
              <Pressable
                key={place._id || index}
                onPress={() => togglePlaceSelection(place.name)}
                style={styles.placeCard}>
                <View style={styles.placeHeader}>
                  <View style={styles.placeNumber}>
                    <Text style={styles.placeNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.placeName} numberOfLines={2}>
                    {place.name}
                  </Text>
                </View>

                <Text style={styles.placeDescription} numberOfLines={3}>
                  {place.briefDescription}
                </Text>

                {place.photos && place.photos[0] && (
                  <Image
                    source={{ uri: place.photos[0] }}
                    style={styles.placeImage}
                    resizeMode="cover"
                  />
                )}

                {selectedPlaces.includes(place.name) && (
                  <View style={styles.placeDetails}>
                    {place.phoneNumber && (
                      <View style={styles.detailRow}>
                        <AntDesign name="phone" size={20} color="#2a52be" />
                        <Text style={styles.detailText}>{place.phoneNumber}</Text>
                      </View>
                    )}

                    {place.openingHours && place.openingHours[0] && (
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={20} color="#2a52be" />
                        <Text style={styles.detailText}>
                          Open {place.openingHours[0].split(': ')[1]}
                        </Text>
                      </View>
                    )}

                    {place.website && (
                      <View style={styles.detailRow}>
                        <Ionicons name="earth" size={20} color="#2a52be" />
                        <Text style={styles.detailText}>{place.website}</Text>
                      </View>
                    )}

                    {place.formatted_address && (
                      <View style={styles.detailRow}>
                        <Entypo name="location" size={20} color="#2a52be" />
                        <Text style={styles.detailText}>{place.formatted_address}</Text>
                      </View>
                    )}

                    {place.types && (
                      <View style={styles.typesContainer}>
                        {place.types.slice(0, 3).map((type, typeIndex) => (
                          <View key={typeIndex} style={styles.typeTag}>
                            <Text style={styles.typeText}>{type}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </Pressable>
            ))}
          </>
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
  content: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#4B61D1',
    padding: 15,
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsBar: {
    marginBottom: 20,
  },
  addPlaceButton: {
    backgroundColor: '#4B61D1',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 8,
  },
  addPlaceText: {
    color: 'white',
    fontWeight: '600',
  },
  placeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0066b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  placeNumberText: {
    color: 'white',
    fontWeight: '500',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  placeDescription: {
    color: 'gray',
    marginBottom: 10,
    lineHeight: 20,
  },
  placeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#4B61D1',
    flex: 1,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  typeTag: {
    backgroundColor: '#4B61D1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});