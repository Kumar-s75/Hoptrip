import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

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
  itinerary: any[];
  placesToVisit: any[];
}

export default function TripDetailScreen() {
  const { id, tripData } = useLocalSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    if (tripData) {
      try {
        const parsedTrip = JSON.parse(tripData as string);
        setTrip(parsedTrip);
      } catch (error) {
        console.error('Error parsing trip data:', error);
      }
    }
  }, [tripData]);

  const activityTypes = [
    { id: '1', name: 'Lodging', icon: '🏨' },
    { id: '2', name: 'Restaurant', icon: '🍽️' },
    { id: '3', name: 'Tour', icon: '🗺️' },
    { id: '4', name: 'Location', icon: '📍' },
    { id: '5', name: 'Museum', icon: '🏛️' },
    { id: '6', name: 'Coffee', icon: '☕' },
    { id: '7', name: 'Party', icon: '🎉' },
    { id: '8', name: 'Concert', icon: '🎵' },
    { id: '9', name: 'Fitness', icon: '💪' },
    { id: '10', name: 'Shopping', icon: '🛍️' },
    { id: '11', name: 'Kids', icon: '👶' },
    { id: '12', name: 'Theatre', icon: '🎭' },
  ];

  const handleActivitySelect = (activityType: any) => {
    setShowActivityModal(false);
    // Navigate to activity definition screen
    router.push({
      pathname: '/activity/define',
      params: { 
        tripId: id,
        activityType: activityType.name,
        tripData: JSON.stringify(trip)
      }
    });
  };

  const handleViewPlaces = () => {
    router.push({
      pathname: '/trip/places',
      params: { tripId: id }
    });
  };

  const handleViewItinerary = () => {
    router.push({
      pathname: '/trip/itinerary',
      params: { tripId: id, tripData: JSON.stringify(trip) }
    });
  };

  const handleViewExpenses = () => {
    router.push({
      pathname: '/trip/expenses',
      params: { tripId: id }
    });
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading trip details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: trip.background }}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={25} color="white" />
          </Pressable>
          <View style={styles.headerActions}>
            <AntDesign name="sharealt" size={25} color="white" />
            <AntDesign name="setting" size={25} color="white" />
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripDate}>
              {new Date(trip.createdAt || Date.now()).toLocaleDateString()}
            </Text>
            <Text style={styles.tripName}>{trip.tripName}</Text>
          </View>

          <View style={styles.itineraryCard}>
            <View style={styles.cardHeader}>
              <AntDesign name="calendar" size={25} color="black" />
              <Text style={styles.cardTitle}>Itinerary</Text>
            </View>
            <View style={styles.divider} />
            <Pressable onPress={handleViewItinerary} style={styles.cardContent}>
              <View style={styles.dateRange}>
                <View>
                  <Text style={styles.dayText}>{trip.startDay}</Text>
                  <Text style={styles.dateText}>{trip.startDate}</Text>
                </View>
                <AntDesign name="arrowright" size={20} color="black" />
                <View>
                  <Text style={styles.dayText}>{trip.endDay}</Text>
                  <Text style={styles.dateText}>{trip.endDate}</Text>
                </View>
              </View>
            </Pressable>
          </View>

          <View style={styles.actionsGrid}>
            <Pressable
              onPress={() => setShowActivityModal(true)}
              style={styles.actionCard}>
              <AntDesign name="pluscircle" size={30} color="#202020" />
              <Text style={styles.actionText}>New Activity</Text>
            </Pressable>

            <Pressable onPress={handleViewPlaces} style={styles.actionCard}>
              <AntDesign name="enviromento" size={30} color="#202020" />
              <Text style={styles.actionText}>Places to Visit</Text>
            </Pressable>

            <Pressable onPress={handleViewExpenses} style={styles.actionCard}>
              <AntDesign name="dollarcircle" size={30} color="#202020" />
              <Text style={styles.actionText}>Expenses</Text>
            </Pressable>

            <Pressable style={styles.actionCard}>
              <AntDesign name="team" size={30} color="#202020" />
              <Text style={styles.actionText}>Travelers</Text>
            </Pressable>
          </View>

          {showActivityModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Activity Type</Text>
                  <Pressable onPress={() => setShowActivityModal(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </Pressable>
                </View>
                <View style={styles.activityGrid}>
                  {activityTypes.map((activity) => (
                    <Pressable
                      key={activity.id}
                      onPress={() => handleActivitySelect(activity)}
                      style={styles.activityOption}>
                      <Text style={styles.activityIcon}>{activity.icon}</Text>
                      <Text style={styles.activityName}>{activity.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    flex: 1,
    padding: 13,
  },
  tripInfo: {
    marginBottom: 20,
  },
  tripDate: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  tripName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 7,
  },
  itineraryCard: {
    backgroundColor: '#c1c9d6',
    marginVertical: 15,
    borderRadius: 20,
  },
  cardHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  cardTitle: {
    fontSize: 16,
    color: '#505050',
  },
  divider: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  cardContent: {
    padding: 15,
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayText: {
    color: '#505050',
  },
  dateText: {
    marginTop: 6,
    fontSize: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#c1c9d6',
    borderRadius: 20,
    padding: 15,
    width: '47%',
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    color: '#404040',
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  activityOption: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  activityIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  activityName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});