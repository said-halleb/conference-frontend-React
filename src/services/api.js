// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Utilisateurs
export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching users');
  }
};

export const createUser = async (user) => {
  try {
    const response = await api.post('/users', user);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error creating user');
  }
};

// Salles
export const fetchRooms = async () => {
  try {
    const response = await api.get('/rooms');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching rooms');
  }
};

export const createRoom = async (room) => {
  try {
    const response = await api.post('/rooms', room);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error creating room');
  }
};

// Réservations
export const fetchBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching bookings');
  }
};

export const fetchBookingsForCalendar = async (start, end) => {
  try {
    const response = await api.get('/bookings/calendar', { params: { start, end } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching calendar data');
  }
};

export const createBooking = async (booking) => {
  try {
    const response = await api.post('/bookings', booking);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error creating booking');
  }
};

export const updateBooking = async (id, booking) => {
  try {
    const response = await api.put(`/bookings/${id}`, booking);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error updating booking');
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error deleting booking');
  }
};

// Équipements
export const fetchEquipments = async () => {
  try {
    const response = await api.get('/equipments');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching equipments');
  }
};

export const reportEquipment = async (id, status) => {
  try {
    const response = await api.patch(`/equipments/${id}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error reporting equipment');
  }
};

// Authentification
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error logging in');
  }
};

// Rapports
export const fetchReports = async () => {
  try {
    const response = await api.get('/reports/usage');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error fetching reports');
  }
};

export const downloadReportPDF = async () => {
  try {
    const response = await api.get('/reports/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error downloading report');
  }
};