import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, Entypo } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Place {
  _id: string;
  name: string;
  briefDescription: string;
  photos: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function TripMapScreen() {
  const { tripId, places } = useLocalSearchParams();
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
  const [parsedPlaces, setParsedPlaces] = useState<Place[]>(() => {
    try {
      return places ? JSON.parse(places as string) : [];
    } catch {
      return [];
    }
  });

  // For web compatibility, we'll show a static map representation
  // In a real app, you'd use react-native-maps for mobile
  const renderWebMap = () => (
    <View style={styles.webMapContainer}>
      <Text style={styles.mapTitle}>Trip Locations</Text>
      <View style={styles.placesGrid}>
        {parsedPlaces.map((place, index) => (
          <Pressable
            key={place._id || index}
            onPress={() => setSelectedMarker(place)}
            style={[
              styles.placeMarker,
              selectedMarker?._id === place._id && styles.selectedMarker
            ]}>
            <View style={styles.markerNumber}>
              <Text style={styles.markerNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.markerName} numberOfLines={2}>
              {place.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Trip Map</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapContainer}>
        {renderWebMap()}
      </View>

      {selectedMarker && (
        <View style={styles.markerDetails}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsNumber}>
              <Text style={styles.detailsNumberText}>
                {parsedPlaces.findIndex(p => p._id === selectedMarker._id) + 1}
              </Text>
            </View>
            <Text style={styles.detailsName} numberOfLines={2}>
              {selectedMarker.name}
            </Text>
            <Pressable onPress={() => setSelectedMarker(null)}>
              <Entypo name="cross" size={25} color="gray" />
            </Pressable>
          </View>

          <Text style={styles.detailsDescription} numberOfLines={3}>
            {selectedMarker.briefDescription}
          </Text>

          {selectedMarker.photos && selectedMarker.photos[0] && (
            <Image
              source={{ uri: selectedMarker.photos[0] }}
              style={styles.detailsImage}
              resizeMode="cover"
            />
          )}
        </View>
      )}
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
  mapContainer: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  placeMarker: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMarker: {
    borderColor: '#4B61D1',
    backgroundColor: '#f0f4ff',
  },
  markerNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0066b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  markerName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  markerDetails: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: height * 0.4,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0066b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailsNumberText: {
    color: 'white',
    fontWeight: '500',
  },
  detailsName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  detailsDescription: {
    color: 'gray',
    marginBottom: 10,
    lineHeight: 20,
  },
  detailsImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});