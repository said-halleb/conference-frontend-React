// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Utilisateurs
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Salles de conférence
export const fetchRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
  }
};

export const createRoom = async (room) => {
  try {
    const response = await axios.post(`${API_URL}/rooms`, room);
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
  }
};

// Réservations
export const fetchBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

export const createBooking = async (booking) => {
  try {
    const response = await axios.post(`${API_URL}/bookings`, booking);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
  }
};

// Authentification
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};
