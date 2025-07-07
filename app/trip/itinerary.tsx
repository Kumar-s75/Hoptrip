import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import moment from 'moment';

interface Activity {
  _id: string;
  name: string;
  date: string;
  briefDescription?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface ItineraryDay {
  date: string;
  activities: Activity[];
}

export default function TripItineraryScreen() {
  const { tripId, tripData } = useLocalSearchParams();
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/trip/${tripId}/itinerary`);
      setItinerary(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format('D MMMM');
  };

  const getDayName = (date: string) => {
    return moment(date).format('dddd');
  };

  const handleAddActivity = (date: string) => {
    router.push({
      pathname: '/activity/define',
      params: { 
        tripId,
        date,
        itinerary: JSON.stringify(itinerary)
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading itinerary...</Text>
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
        <Text style={styles.title}>Trip Itinerary</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {itinerary.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No itinerary yet</Text>
            <Text style={styles.emptySubtitle}>Start planning your daily activities</Text>
          </View>
        ) : (
          itinerary.map((day, index) => (
            <View key={day.date} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{getDayName(day.date)}</Text>
                  <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                </View>
                <Pressable 
                  onPress={() => handleAddActivity(day.date)}
                  style={styles.addActivityButton}>
                  <AntDesign name="plus" size={20} color="#4B61D1" />
                </Pressable>
              </View>

              <View style={styles.activitiesContainer}>
                {day.activities.length === 0 ? (
                  <View style={styles.noActivities}>
                    <Text style={styles.noActivitiesText}>No activities planned</Text>
                    <Pressable 
                      onPress={() => handleAddActivity(day.date)}
                      style={styles.addFirstActivityButton}>
                      <Text style={styles.addFirstActivityText}>Add Activity</Text>
                    </Pressable>
                  </View>
                ) : (
                  day.activities.map((activity, activityIndex) => (
                    <View key={activity._id || activityIndex} style={styles.activityCard}>
                      <View style={styles.activityHeader}>
                        <View style={styles.activityTime}>
                          <Text style={styles.timeText}>
                            {moment().add(activityIndex, 'hours').format('HH:mm')}
                          </Text>
                        </View>
                        <View style={styles.activityInfo}>
                          <Text style={styles.activityName}>{activity.name}</Text>
                          {activity.briefDescription && (
                            <Text style={styles.activityDescription} numberOfLines={2}>
                              {activity.briefDescription}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          ))
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
  },
  dayCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addActivityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activitiesContainer: {
    gap: 10,
  },
  noActivities: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noActivitiesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  addFirstActivityButton: {
    backgroundColor: '#4B61D1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstActivityText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityTime: {
    backgroundColor: '#4B61D1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 15,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});