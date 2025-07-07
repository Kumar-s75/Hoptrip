import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function TripDetailScreen() {
  const { id, tripData } = useLocalSearchParams();
  
  let trip = null;
  try {
    trip = tripData ? JSON.parse(tripData as string) : null;
  } catch (error) {
    console.error('Error parsing trip data:', error);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>
      <Text style={styles.id}>Trip ID: {id}</Text>
      {trip && (
        <View style={styles.tripInfo}>
          <Text style={styles.tripName}>{trip.tripName}</Text>
          <Text style={styles.tripDates}>{trip.startDate} - {trip.endDate}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  id: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  tripInfo: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tripDates: {
    fontSize: 16,
    color: 'gray',
  },
});