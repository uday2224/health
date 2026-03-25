import axios, { AxiosInstance, AxiosError } from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          supabase.auth.signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  // Prescriptions
  async extractPrescription(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post('/prescriptions/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Bookings
  async createBooking(data: any) {
    return this.client.post('/bookings', data);
  }

  async getBookings(filters?: any) {
    return this.client.get('/bookings', { params: filters });
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.client.patch(`/bookings/${bookingId}`, { status });
  }

  // Nurses
  async getNurses(filters?: any) {
    return this.client.get('/nurses', { params: filters });
  }

  async getNurseProfile(nurseId: string) {
    return this.client.get(`/nurses/${nurseId}`);
  }

  // Payments
  async createPaymentIntent(data: any) {
    return this.client.post('/payments/intent', data);
  }

  async confirmPayment(data: any) {
    return this.client.post('/payments/confirm', data);
  }

  async refundPayment(paymentId: string, amount?: number) {
    return this.client.post(`/payments/${paymentId}/refund`, { amount });
  }

  // Users
  async updateProfile(data: any) {
    return this.client.patch('/users/profile', data);
  }

  async getUsers(filters?: any) {
    return this.client.get('/users', { params: filters });
  }

  // Admin
  async getAdminStats() {
    return this.client.get('/admin/stats');
  }

  async verifyNurse(nurseId: string, approved: boolean) {
    return this.client.post(`/admin/nurses/${nurseId}/verify`, { approved });
  }
}

export const apiClient = new APIClient();
