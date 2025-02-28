// src/components/RoomList.js
import React, { useEffect, useState } from 'react';
import { fetchRooms } from '@/services/api';
import './RoomList.scss';
import strings from '@/config/strings';
import { useAuth } from '@/context/AuthContext';
const RoomList = ({ refreshTrigger }) => {
  const { currentUser } = useAuth(); // Pour des actions futures (ex. suppression)
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      setError(err.message || 'Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [refreshTrigger]); // Rafraîchir si refreshTrigger change (ex. après création)

  const parseJsonField = (field) => {
    try {
      return JSON.parse(field).join(', ') || 'None';
    } catch {
      return 'None';
    }
  };

  return (
    <section className="room-list bg-dark p-4 rounded mt-5">
      <h2 className="mb-4 mt-4 text-white">{strings.roomList.title}</h2>
      {loading && <p className="text-center text-muted">{strings.roomList.loading}</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!loading && rooms.length === 0 && !error && (
        <p className="text-center text-muted">{strings.roomList.noRooms}</p>
      )}
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-6 mb-3" key={room.id}>
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">
                  <strong>{strings.roomList.capacityLabel}</strong> {room.capacity}
                </p>
                <p className="card-text">
                  <strong>{strings.roomList.locationLabel}</strong> {room.location || 'Not specified'}
                </p>
                <p className="card-text">
                  <strong>{strings.roomList.equipmentsLabel}</strong> {parseJsonField(room.equipments)}
                </p>
                <p className="card-text">
                  <strong>{strings.roomList.preferencesLabel}</strong> {parseJsonField(room.preferences)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomList;