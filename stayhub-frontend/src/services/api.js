import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Property APIs
export const propertyAPI = {
  getAll: (filters) => api.get('/properties', { params: filters }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (propertyData) => api.post('/properties', propertyData),
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  delete: (id) => api.delete(`/properties/${id}`),
  uploadImages: (propertyId, formData) => 
    api.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  searchWithAI: (query) => api.post('/properties/ai-search', { query }),
};

// Booking APIs
export const bookingAPI = {
  checkAvailability: (propertyId, checkIn, checkOut) => 
    api.post('/bookings/check-availability', { propertyId, checkIn, checkOut }),
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getHostBookings: () => api.get('/bookings/host-bookings'),
  cancel: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),
  getById: (id) => api.get(`/bookings/${id}`),
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: (bookingId) => 
    api.post('/payments/create-intent', { bookingId }),
  confirmPayment: (paymentData) => api.post('/payments/confirm', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

// Review APIs
export const reviewAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getPropertyReviews: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  canReview: (bookingId) => api.get(`/reviews/can-review/${bookingId}`),
};

export default api;
