// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { createBooking, fetchRooms, fetchUsers } from '../services/api';
import './BookingForm.scss';

const BookingForm = ({ refreshBookings }) => {
  const [user_id, setUserId] = useState('');
  const [room_id, setRoomId] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    const getRooms = async () => {
      const data = await fetchRooms();
      setRooms(data);
    };
    getUsers();
    getRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const booking = { user_id, room_id, start_time, end_time, status };
    await createBooking(booking);
    refreshBookings();
  };

  return (
    <section className="booking-form">
      <h2 className="mt-4 mb-3">Réserver une Salle de Conférence</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Utilisateur :</label>
          <select className="form-control" value={user_id} onChange={(e) => setUserId(e.target.value)} required>
            <option value="">Sélectionner un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Salle :</label>
          <select className="form-control" value={room_id} onChange={(e) => setRoomId(e.target.value)} required>
            <option value="">Sélectionner une salle</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Début :</label>
          <input
            type="datetime-local"
            className="form-control"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fin :</label>
          <input
            type="datetime-local"
            className="form-control"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Statut :</label>
          <input
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Réserver</button>
      </form>
    </section>
  );
};

export default BookingForm;
