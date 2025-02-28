// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { createBooking, fetchRooms, fetchUsers, fetchEquipments, fetchBookings } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import './BookingForm.scss';
import strings from '@/config/strings';

const BookingForm = ({ refreshBookings }) => {
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState(currentUser?.id || '');
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState({ room: true, equipments: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, roomsData, equipmentsData, bookingsData] = await Promise.all([
          fetchUsers(),
          fetchRooms(),
          fetchEquipments(),
          fetchBookings()
        ]);
        setUsers(usersData);
        const parsedRooms = roomsData.map(room => ({
          ...room,
          equipments: JSON.parse(room.equipments || '[]') // Parser le JSON
        }));
        setRooms(parsedRooms);
        setEquipments(equipmentsData.filter(e => e.status === 'functional'));
        console.log('All equipments fetched:', equipmentsData);
        console.log('Parsed rooms:', parsedRooms);
      } catch (err) {
        setError(err.message || 'Error loading data');
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!roomId) {
      setAvailableEquipments([]);
      setEquipmentIds([]);
      return;
    }
    const selectedRoom = rooms.find(room => room.id === parseInt(roomId));
    if (selectedRoom) {
      const roomEquipmentNames = selectedRoom.equipments.map(name => name.toLowerCase()); // Insensible à la casse
      const filteredEquipments = equipments.filter(e => 
        roomEquipmentNames.includes(e.name.toLowerCase())
      );
      setAvailableEquipments(filteredEquipments);
      setEquipmentIds([]); // Réinitialiser la sélection
      console.log('Selected room:', selectedRoom);
      console.log('Room equipment names:', roomEquipmentNames);
      console.log('Filtered equipments for room:', filteredEquipments);
    }
  }, [roomId, rooms, equipments]);

  const checkAvailability = async () => {
    if (!roomId || !startTime || !endTime) {
      setAvailability({ 
        room: true, 
        equipments: availableEquipments.map(e => ({ id: e.id, name: e.name, available: true })) 
      });
      return;
    }
    try {
      const bookings = await fetchBookings();
      const roomConflicts = bookings.filter(b =>
        b.room_id === parseInt(roomId) &&
        b.status === 'confirmed' &&
        ((new Date(b.start_time) < new Date(endTime)) && (new Date(b.end_time) > new Date(startTime)))
      );
      const roomAvailable = roomConflicts.length === 0;

      const bookedEquipments = bookings
        .filter(b => b.status === 'confirmed' &&
          ((new Date(b.start_time) < new Date(endTime)) && (new Date(b.end_time) > new Date(startTime))))
        .flatMap(b => b.equipment_ids || []);
      const equipmentAvailability = availableEquipments.map(e => ({
        id: e.id,
        name: e.name,
        available: !bookedEquipments.includes(e.id)
      }));

      setAvailability({ room: roomAvailable, equipments: equipmentAvailability });
      console.log('Room available:', roomAvailable);
      console.log('Equipment availability:', equipmentAvailability);
    } catch (err) {
      setError('Error checking availability');
      console.error('Error checking availability:', err);
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [roomId, startTime, endTime, availableEquipments]);

  const handleEquipmentChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setEquipmentIds(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(endTime) <= new Date(startTime)) {
      setError('End time must be after start time');
      return;
    }

    const booking = {
      user_id: parseInt(userId),
      room_id: parseInt(roomId),
      start_time: new Date(startTime).toISOString().slice(0, 19).replace('T', ' '),
      end_time: new Date(endTime).toISOString().slice(0, 19).replace('T', ' '),
      status,
      equipment_ids: equipmentIds
    };
    console.log('Booking data sent to backend:', booking);

    try {
      await createBooking(booking);
      setSuccess('Booking created successfully!');
      refreshBookings();
      setRoomId('');
      setStartTime('');
      setEndTime('');
      setEquipmentIds([]);
    } catch (err) {
      if (err.response?.data?.message === 'Some equipment unavailable') {
        const unavailableIds = err.response.data.unavailable || [];
        const unavailableNames = availableEquipments
          .filter(e => unavailableIds.includes(e.id))
          .map(e => e.name)
          .join(', ');
        setError(`Error: Equipment unavailable - ${unavailableNames}`);
      } else if (err.response?.data?.message === 'Room already booked') {
        setError('Error: Room is already booked for this time slot');
      } else {
        setError(err.response?.data?.error || err.message || 'Error creating booking');
      }
    }
  };

  return (
    <section className="booking-form bg-dark p-4 rounded mt-5">
      <h2 className="mt-4 mb-3 text-white text-center">{strings.bookingForm.title}</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{strings.bookingForm.userLabel}</label>
          <select
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={!currentUser?.isAdmin && !currentUser?.isManager}
          >
            <option value="">{strings.bookingForm.selectUser}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{strings.bookingForm.roomLabel}</label>
          <select
            className="form-control"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            <option value="">{strings.bookingForm.selectRoom}</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity}) {availability.room ? '' : '[Booked]'}
              </option>
            ))}
          </select>
          {!availability.room && <small className="text-warning">Room unavailable</small>}
        </div>
        <div className="form-group">
          <label>{strings.bookingForm.startLabel}</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.bookingForm.endLabel}</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.bookingForm.equipmentsLabel}</label>
          <select
            className="form-control"
            multiple
            value={equipmentIds}
            onChange={handleEquipmentChange}
            disabled={!roomId}
          >
            {availableEquipments.length > 0 ? (
              availableEquipments.map((equipment) => {
                const isAvailable = availability.equipments.find(e => e.id === equipment.id)?.available ?? true;
                return (
                  <option key={equipment.id} value={equipment.id} disabled={!isAvailable}>
                    {equipment.name} {isAvailable ? '' : '[Unavailable]'}
                  </option>
                );
              })
            ) : (
              <option disabled>No equipments available for this room</option>
            )}
          </select>
          <small className="text-muted">Hold Ctrl/Cmd to select multiple (specific to selected room)</small>
        </div>
        <div className="form-group">
          <label>{strings.bookingForm.statusLabel}</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3 bg-dark border-0 w-100">
          {strings.bookingForm.bookButton}
        </button>
      </form>
    </section>
  );
};

export default BookingForm;