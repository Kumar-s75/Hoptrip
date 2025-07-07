import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { router } from 'expo-router';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const images = [
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function CreateTripScreen() {
  const [tripName, setTripName] = useState('');
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const { userId } = useAuth();

  const handleCreateTrip = async () => {
    if (!tripName || !dateRange.startDate || !dateRange.endDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const startDay = moment(dateRange.startDate).format('dddd');
    const endDay = moment(dateRange.endDate).format('dddd');

    const tripData = {
      tripName,
      startDate: moment(dateRange.startDate).format('DD MMMM YYYY'),
      endDate: moment(dateRange.endDate).format('DD MMMM YYYY'),
      startDay,
      endDay,
      background: selectedImage,
      host: userId,
    };

    try {
      const response = await axios.post('http://localhost:8000/trip', tripData);
      console.log('Trip created successfully:', response.data);
      Alert.alert('Success', 'Trip created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    }
  };

  const formatDate = (date: Date | null) => {
    if (date) {
      return moment(date).format('DD MMMM YYYY');
    }
    return 'Select Date';
  };

  const getDayName = (date: Date | null) => {
    return date ? moment(date).format('dddd') : '';
  };

  const selectTodayAsStart = () => {
    const today = new Date();
    setDateRange({ ...dateRange, startDate: today });
  };

  const selectTomorrowAsEnd = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDateRange({ ...dateRange, endDate: tomorrow });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{ uri: selectedImage }}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleCreateTrip} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.calendarSection}>
            <AntDesign name="calendar" size={25} color="white" />
          </View>

          <View style={styles.tripNameSection}>
            <TextInput
              value={tripName}
              onChangeText={setTripName}
              placeholderTextColor={'#c1c9d6'}
              style={styles.tripNameInput}
              placeholder="Trip name"
            />
          </View>

          <View style={styles.itineraryCard}>
            <View style={styles.itineraryHeader}>
              <AntDesign name="calendar" size={25} color="black" />
              <Text style={styles.itineraryTitle}>Itinerary</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.dateSection}>
              <Pressable style={styles.dateButton} onPress={selectTodayAsStart}>
                <Text style={styles.dayText}>
                  {getDayName(dateRange.startDate) || 'Start'}
                </Text>
                <Text style={styles.dateText}>
                  {formatDate(dateRange.startDate)}
                </Text>
              </Pressable>

              <AntDesign name="arrowright" size={20} color="black" />

              <Pressable style={styles.dateButton} onPress={selectTomorrowAsEnd}>
                <Text style={styles.dayText}>
                  {getDayName(dateRange.endDate) || 'End'}
                </Text>
                <Text style={styles.dateText}>
                  {formatDate(dateRange.endDate)}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <View style={styles.timezoneCard}>
              <AntDesign name="earth" size={25} color="black" />
              <Text style={styles.optionTitle}>TimeZone</Text>
              <Text style={styles.optionSubtitle}>Bengaluru, India</Text>
            </View>

            <Pressable
              onPress={() => setShowImagePicker(!showImagePicker)}
              style={styles.imageCard}>
              <FontAwesome name="photo" size={25} color="black" />
              <Text style={styles.optionTitle}>Choose Image</Text>
            </Pressable>
          </View>

          {showImagePicker && (
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedImage(image);
                    setShowImagePicker(false);
                  }}
                  style={styles.imageOption}>
                  <ImageBackground
                    source={{ uri: image }}
                    style={styles.imagePreview}
                    imageStyle={styles.imagePreviewStyle}
                  />
                </Pressable>
              ))}
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  createButtonText: {
    textAlign: 'center',
    color: 'orange',
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    padding: 15,
  },
  calendarSection: {
    marginBottom: 20,
  },
  tripNameSection: {
    marginBottom: 20,
  },
  tripNameInput: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#c1c9d6',
  },
  itineraryCard: {
    backgroundColor: '#c1c9d6',
    marginVertical: 15,
    borderRadius: 20,
  },
  itineraryHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  itineraryTitle: {
    fontSize: 16,
    color: '#505050',
  },
  divider: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  dateSection: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
  },
  dayText: {
    color: '#505050',
  },
  dateText: {
    marginTop: 6,
    fontSize: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  timezoneCard: {
    flex: 1,
    backgroundColor: '#c1c9d6',
    borderRadius: 20,
    padding: 15,
  },
  imageCard: {
    flex: 1,
    backgroundColor: '#c1c9d6',
    borderRadius: 20,
    padding: 15,
  },
  optionTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  optionSubtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#505050',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10,
  },
  imageOption: {
    width: '30%',
    aspectRatio: 1,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePreviewStyle: {
    borderRadius: 10,
  },
});