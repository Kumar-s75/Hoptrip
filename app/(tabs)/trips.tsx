import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface Trip {
  _id: string;
  tripName: string;
  startDate: string;
  endDate: string;
  startDay: string;
  endDay: string;
  background: string;
  host: string;
  travelers: string[];
  createdAt: string;
}

export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
  }, [userId]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/trips/${userId}`);
      setTrips(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setLoading(false);
    }
  };

  const handleTripPress = (trip: Trip) => {
    router.push({
      pathname: '/trip/[id]',
      params: { id: trip._id, tripData: JSON.stringify(trip) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Trips</Text>
        <Pressable onPress={() => router.push('/(tabs)/create')}>
          <AntDesign name="plus" size={30} color="orange" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>Create your first trip to get started!</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/create')}
              style={styles.createButton}>
              <Text style={styles.createButtonText}>Create Trip</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.tripsGrid}>
            {trips.map((trip) => (
              <Pressable
                key={trip._id}
                style={styles.tripCard}
                onPress={() => handleTripPress(trip)}>
                <ImageBackground
                  source={{ uri: trip.background }}
                  style={styles.tripBackground}
                  imageStyle={styles.tripImage}>
                  <View style={styles.tripOverlay}>
                    <View style={styles.tripHeader}>
                      <Text style={styles.tripDates}>
                        {trip.startDate} - {trip.endDate}
                      </Text>
                      <Text style={styles.tripCreated}>
                        {moment(trip.createdAt).format('MMM Do')}
                      </Text>
                    </View>
                    <Text style={styles.tripName}>{trip.tripName}</Text>
                    <View style={styles.tripFooter}>
                      <Text style={styles.travelerCount}>
                        {trip.travelers.length} traveler{trip.travelers.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </Pressable>
            ))}
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
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
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
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#383838',
    padding: 15,
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tripsGrid: {
    gap: 15,
  },
  tripCard: {
    marginBottom: 15,
  },
  tripBackground: {
    width: '100%',
    height: 200,
  },
  tripImage: {
    borderRadius: 15,
  },
  tripOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripDates: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  tripCreated: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  tripName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tripFooter: {
    marginTop: 10,
  },
  travelerCount: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
});