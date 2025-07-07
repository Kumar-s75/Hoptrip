import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

interface ImagePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  selectedImage?: string;
}

const images = [
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591382/pexels-photo-1591382.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1450394/pexels-photo-1450394.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function ImagePicker({ 
  visible, 
  onClose, 
  onSelectImage, 
  selectedImage 
}: ImagePickerProps) {
  const handleSelectImage = (imageUrl: string) => {
    onSelectImage(imageUrl);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Background Image</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.imageGrid}>
            {images.map((imageUrl, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelectImage(imageUrl)}
                style={[
                  styles.imageContainer,
                  selectedImage === imageUrl && styles.selectedImageContainer
                ]}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {selectedImage === imageUrl && (
                  <View style={styles.selectedOverlay}>
                    <AntDesign name="check" size={24} color="white" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#484848',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    aspectRatio: 3/4,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImageContainer: {
    borderWidth: 3,
    borderColor: '#4B61D1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(75, 97, 209, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});