
// src/components/CreateRoomForm.js
import React, { useState } from 'react';
import { createRoom } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import './CreateRoomForm.scss';
import strings from '@/config/strings';

const CreateRoomForm = ({ refreshRooms }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [equipments, setEquipments] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Vérifier si l'utilisateur a les droits nécessaires
  if (!currentUser?.role || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
    return null; // Ne pas afficher si non connecté ou rôle non autorisé
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !capacity) {
      setError('Name and capacity are required');
      return;
    }
    if (isNaN(capacity) || parseInt(capacity) <= 0) {
      setError('Capacity must be a positive number');
      return;
    }

    const roomData = {
      name,
      capacity: parseInt(capacity),
      location: location || null,
      equipments: equipments ? equipments.split(',').map(e => e.trim()) : [],
      preferences: preferences ? preferences.split(',').map(p => p.trim()) : []
    };

  

    try {
      await createRoom(roomData);
      setSuccess('Room created successfully!');
      if (refreshRooms) refreshRooms();
      setName('');
      setCapacity('');
      setLocation('');
      setEquipments('');
      setPreferences('');
    } catch (err) {
      setError(err.message || 'Error creating room');
    }
  };

  return (
    <section className="create-room-form bg-dark p-4 rounded mt-5">
      <h2 className="mt-4 mb-3 text-white text-center">{strings.createRoomForm.title}</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label >{strings.createRoomForm.nameLabel}</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label >{strings.createRoomForm.capacityLabel}</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label >{strings.createRoomForm.locationLabel}</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label >{strings.createRoomForm.equipmentsLabel}</label>
          <input
            type="text"
            className="form-control"
            value={equipments}
            onChange={(e) => setEquipments(e.target.value)}
            placeholder={strings.createRoomForm.equipmentsPlaceholder}
          />
          <small className="text-muted">Separate with commas (e.g., projector, whiteboard)</small>
        </div>
        <div className="form-group">
          <label >{strings.createRoomForm.preferencesLabel}</label>
          <input
            type="text"
            className="form-control"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., u-shape, wifi"
          />
          <small className="text-muted">Separate with commas (e.g., u-shape, wifi)</small>
        </div>
        <button type="submit" className="btn btn-primary mt-3 bg-dark border-0 w-100">
          {strings.createRoomForm.createButton}
        </button>
      </form>
    </section>
  );
};

export default CreateRoomForm;