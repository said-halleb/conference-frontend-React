// src/components/RoomList.js
import React, { useEffect, useState } from 'react';
import { fetchRooms } from '@/services/api';
import './RoomList.scss';
import strings from '@/config/strings';
const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      const data = await fetchRooms();
      setRooms(data);
    };
    getRooms();
  }, []);

  return (
     <section className="room-list">
      <h2 className="mb-4 mt-4">{strings.roomList.title}</h2>
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-6 mb-3" key={room.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">
                  {strings.roomList.capacityLabel} {room.capacity}
                </p>
                <p className="card-text">
                  {strings.roomList.equipmentsLabel} {JSON.parse(room.equipments).join(', ')}
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
