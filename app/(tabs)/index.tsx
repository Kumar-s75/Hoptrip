import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
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

export default function HomeScreen() {
  const currentYear = moment().year();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, logout, userInfo } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchTrips();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      <ScrollView>
        <View style={styles.header}>
          <Ionicons onPress={logout} name="person" size={30} color="orange" />
          <View style={styles.headerActions}>
            <AntDesign name="search1" size={30} color="orange" />
            <Pressable onPress={() => router.push('/create')}>
              <AntDesign name="plus" size={30} color="orange" />
            </Pressable>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.year}>{currentYear}</Text>
        </View>

        <View style={styles.tripsContainer}>
          {trips?.map((item, index) => (
            <Pressable
              key={item._id}
              style={styles.tripCard}
              onPress={() => handleTripPress(item)}>
              <ImageBackground
                imageStyle={styles.tripImage}
                style={styles.tripBackground}
                source={{ uri: item?.background }}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripDates}>
                    {item?.startDate} - {item?.endDate}
                  </Text>
                  <Text style={styles.tripCreated}>
                    {moment(item.createdAt).format('MMMM Do')}
                  </Text>
                </View>
                <Text style={styles.tripName}>{item?.tripName}</Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View style={styles.promoSection}>
          <Image
            style={styles.promoImage}
            source={{
              uri: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400&h=220&fit=crop',
            }}
          />
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Organize your next trip</Text>
          <Text style={styles.ctaDescription}>
            Create your next trip and plan the activities of your itinerary
          </Text>
          <Pressable
            onPress={() => router.push('/create')}
            style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Create a Trip</Text>
          </Pressable>
          <View style={styles.ctaImageContainer}>
            <Image
              style={styles.ctaImage}
              source={{
                uri: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=150&h=120&fit=crop',
              }}
            />
          </View>
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
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  titleSection: {
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  year: {
    marginTop: 6,
    fontSize: 19,
    color: 'orange',
    fontWeight: '600',
  },
  tripsContainer: {
    padding: 15,
  },
  tripCard: {
    marginTop: 15,
  },
  tripBackground: {
    width: '100%',
    height: 220,
  },
  tripImage: {
    borderRadius: 10,
  },
  tripHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDates: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  tripCreated: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  tripName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
  },
  promoSection: {
    padding: 10,
  },
  promoImage: {
    width: '96%',
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 20,
  },
  ctaSection: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaDescription: {
    marginTop: 15,
    color: 'gray',
    width: 250,
    textAlign: 'center',
    fontSize: 16,
  },
  ctaButton: {
    marginTop: 25,
    backgroundColor: '#383838',
    padding: 14,
    width: 200,
    borderRadius: 25,
  },
  ctaButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaImageContainer: {
    marginTop: 20,
  },
  ctaImage: {
    width: 150,
    height: 120,
  },
});