// src/components/CreateRoomForm.js
import React, { useState } from 'react';
import { createRoom } from '@/services/api';
import './CreateRoomForm.scss';
import strings from '@/config/strings';

const CreateRoomForm = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [equipments, setEquipments] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRoom({ name, capacity, location, equipments: equipments.split(',') });
    alert('Room created successfully!');
    setName('');
    setCapacity('');
    setLocation('');
    setEquipments('');
  };

  return (
  <section className="create-room-form">
      <h2 className="mt-4 mb-3">{strings.createRoomForm.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{strings.createRoomForm.nameLabel}</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.createRoomForm.capacityLabel}</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.createRoomForm.locationLabel}</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{strings.createRoomForm.equipmentsLabel}</label>
          <input
            type="text"
            className="form-control"
            value={equipments}
            onChange={(e) => setEquipments(e.target.value)}
            placeholder={strings.createRoomForm.equipmentsPlaceholder}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 bg-dark border-0">
          {strings.createRoomForm.createButton}
        </button>
      </form>
    </section>
  );
};

export default CreateRoomForm;
