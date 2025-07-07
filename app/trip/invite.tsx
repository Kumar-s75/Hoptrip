import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { emailService } from '@/services/email';
import { useAuth } from '@/contexts/AuthContext';

export default function InviteTravelersScreen() {
  const { tripId, tripName } = useLocalSearchParams();
  const { userInfo } = useAuth();
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index: number, email: string) => {
    const newEmails = [...emails];
    newEmails[index] = email;
    setEmails(newEmails);
  };

  const validateEmails = (): string[] => {
    const validEmails = emails
      .filter(email => email.trim() !== '')
      .filter(email => emailService.validateEmail(email));
    
    return validEmails;
  };

  const sendInvitations = async () => {
    const validEmails = validateEmails();
    
    if (validEmails.length === 0) {
      Alert.alert('Error', 'Please enter at least one valid email address');
      return;
    }

    if (!userInfo) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const invitations = validEmails.map(email => ({
        email,
        tripId: tripId as string,
        tripName: tripName as string,
        senderName: userInfo.name,
      }));

      const result = await emailService.sendMultipleInvitations(invitations);

      if (result.success > 0) {
        setSuccessMessage(
          `Successfully sent ${result.success} invitation${result.success > 1 ? 's' : ''}`
        );
        
        if (result.failed === 0) {
          setTimeout(() => {
            router.back();
          }, 2000);
        }
      }

      if (result.failed > 0) {
        Alert.alert(
          'Partial Success',
          `${result.success} invitations sent successfully, ${result.failed} failed to send`
        );
      }

    } catch (error) {
      console.error('Error sending invitations:', error);
      Alert.alert('Error', 'Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewInvitation = () => {
    Alert.alert(
      'Invitation Preview',
      `${userInfo?.name} has invited you to join their trip "${tripName}". Click the link in the email to join the trip and start planning together!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Invite Travelers</Text>
        <Pressable onPress={previewInvitation}>
          <Ionicons name="eye-outline" size={24} color="#4B61D1" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tripInfo}>
          <Text style={styles.tripNameLabel}>Trip:</Text>
          <Text style={styles.tripNameText}>{tripName}</Text>
        </View>

        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Invite by Email</Text>
          <Text style={styles.sectionSubtitle}>
            Enter email addresses of people you want to invite to this trip
          </Text>

          {emails.map((email, index) => (
            <View key={index} style={styles.emailInputContainer}>
              <View style={styles.emailInputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={(text) => updateEmail(index, text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emails.length > 1 && (
                  <Pressable onPress={() => removeEmailField(index)}>
                    <AntDesign name="close" size={20} color="#666" />
                  </Pressable>
                )}
              </View>
              {email && !emailService.validateEmail(email) && (
                <Text style={styles.errorText}>Please enter a valid email address</Text>
              )}
            </View>
          ))}

          <Pressable onPress={addEmailField} style={styles.addEmailButton}>
            <AntDesign name="plus" size={20} color="#4B61D1" />
            <Text style={styles.addEmailText}>Add another email</Text>
          </Pressable>
        </View>

        {successMessage ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.invitePreview}>
          <Text style={styles.previewTitle}>Invitation Preview</Text>
          <View style={styles.previewCard}>
            <Text style={styles.previewText}>
              <Text style={styles.previewBold}>{userInfo?.name}</Text> has invited you to join their trip "
              <Text style={styles.previewBold}>{tripName}</Text>".
            </Text>
            <Text style={styles.previewText}>
              Click the button below to join the trip:
            </Text>
            <View style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Join Trip</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            onPress={sendInvitations}
            disabled={loading || validateEmails().length === 0}
            style={[
              styles.sendButton,
              (loading || validateEmails().length === 0) && styles.sendButtonDisabled
            ]}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.sendButtonText}>
                  Send Invitations ({validateEmails().length})
                </Text>
              </>
            )}
          </Pressable>
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
  tripInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  tripNameLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tripNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inviteSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  emailInputContainer: {
    marginBottom: 15,
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  addEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  addEmailText: {
    color: '#4B61D1',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    gap: 10,
  },
  successText: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '500',
  },
  invitePreview: {
    marginBottom: 30,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4B61D1',
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  previewBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  previewButton: {
    backgroundColor: '#4B61D1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  previewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingBottom: 20,
  },
  sendButton: {
    backgroundColor: '#4B61D1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});