import { apiService } from './api';

export interface InvitationData {
  email: string;
  tripId: string;
  tripName: string;
  senderName: string;
}

class EmailService {
  async sendTripInvitation(invitationData: InvitationData): Promise<boolean> {
    try {
      await apiService.sendTripInvitation(invitationData);
      return true;
    } catch (error) {
      console.error('Failed to send trip invitation:', error);
      return false;
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendMultipleInvitations(
    invitations: InvitationData[]
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const invitation of invitations) {
      try {
        await this.sendTripInvitation(invitation);
        success++;
      } catch (error) {
        console.error(`Failed to send invitation to ${invitation.email}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}

export const emailService = new EmailService();