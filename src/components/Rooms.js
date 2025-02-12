import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/rooms') // Replace with your backend endpoint
            .then(response => setRooms(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Liste des Salles</h2>
            <div className="row">
                {rooms.map(room => (
                    <div key={room.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{room.name}</h5>
                                <p className="card-text">
                                    Capacité : {room.capacity} personnes<br />
                                    Localisation : {room.location}
                                </p>
                                <button className="btn btn-outline-primary">Réserver</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rooms;
