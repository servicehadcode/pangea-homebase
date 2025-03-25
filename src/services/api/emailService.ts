import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const emailApi = {
  sendCollaborationInvite: async (email: string, inviteData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/email/collaboration-invite`, {
        email,
        ...inviteData
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send invitation');
    }
  },

  sendAssignmentNotification: async (notification: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/email/assignment-notification`, notification);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send notification');
    }
  }
};