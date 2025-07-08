import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const handleTripPress = (trip: Trip) => {
    router.push({
      pathname: '/trip/[id]',
      params: { id: trip._id, tripData: JSON.stringify(trip) }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading your trips..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.profileButton}>
            {userInfo?.photo ? (
              <Image source={{ uri: userInfo.photo }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person" size={24} color="#4B61D1" />
            )}
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <AntDesign name="search1" size={24} color="#4B61D1" />
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/create')} style={styles.iconButton}>
              <AntDesign name="plus" size={24} color="#4B61D1" />
            </Pressable>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Typography variant="h1" style={styles.title}>
            Welcome back{userInfo?.name ? `, ${userInfo.name.split(' ')[0]}` : ''}!
          </Typography>
          <Typography variant="body1" color="secondary">
            Plan your next adventure
          </Typography>
        </View>

        {trips.length === 0 ? (
          <EmptyState
            icon={<AntDesign name="enviromento" size={64} color="#D1D5DB" />}
            title="No trips yet"
            description="Start planning your first adventure and create unforgettable memories"
            actionLabel="Create Trip"
            onAction={() => router.push('/(tabs)/create')}
            style={styles.emptyState}
          />
        ) : (
          <View style={styles.tripsContainer}>
            <View style={styles.sectionHeader}>
              <Typography variant="h3">Your Trips</Typography>
              <Typography variant="body2" color="secondary">
                {trips.length} trip{trips.length !== 1 ? 's' : ''}
              </Typography>
            </View>
            
            {trips.map((item, index) => (
              <Card
                key={item._id}
                style={styles.tripCard}
                onPress={() => handleTripPress(item)}>
                <ImageBackground
                  imageStyle={styles.tripImage}
                  style={styles.tripBackground}
                  source={{ uri: item?.background }}>
                  <View style={styles.tripOverlay}>
                    <View style={styles.tripHeader}>
                      <Typography variant="body2" style={styles.tripDates}>
                        {item?.startDate} - {item?.endDate}
                      </Typography>
                      <Typography variant="caption" style={styles.tripCreated}>
                        {moment(item.createdAt).format('MMM Do')}
                      </Typography>
                    </View>
                    <Typography variant="h4" style={styles.tripName}>
                      {item?.tripName}
                    </Typography>
                    <View style={styles.tripFooter}>
                      <Typography variant="caption" style={styles.tripTravelers}>
                        {item.travelers.length + 1} traveler{item.travelers.length !== 0 ? 's' : ''}
                      </Typography>
                    </View>
                  </View>
                </ImageBackground>
              </Card>
            ))}
          </View>
        )}

        {trips.length > 0 && (
          <Card style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <Typography variant="h4" style={styles.ctaTitle}>
                Ready for your next adventure?
              </Typography>
              <Typography variant="body1" color="secondary" style={styles.ctaDescription}>
                Create a new trip and start planning amazing experiences
              </Typography>
              <Button
                title="Create New Trip"
                onPress={() => router.push('/(tabs)/create')}
                style={styles.ctaButton}
                icon={<AntDesign name="plus" size={20} color="white" />}
              />
            </View>
            <Image
              style={styles.ctaImage}
              source={{
                uri: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
              }}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 4,
  },
  emptyState: {
    marginTop: 60,
  },
  tripsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  tripBackground: {
    height: 200,
    justifyContent: 'flex-end',
  },
  tripImage: {
    borderRadius: 16,
  },
  tripOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripDates: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  tripCreated: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tripName: {
    color: 'white',
    marginBottom: 8,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTravelers: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ctaCard: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  ctaContent: {
    flex: 1,
    padding: 20,
  },
  ctaTitle: {
    marginBottom: 8,
  },
  ctaDescription: {
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
  ctaImage: {
    width: 120,
    height: 120,
  },
});

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