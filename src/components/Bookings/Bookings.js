import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/bookings') // Replace with your backend endpoint
            .then(response => setBookings(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Réservations</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Salle</th>
                        <th>Utilisateur</th>
                        <th>Date</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={booking.id}>
                            <td>{index + 1}</td>
                            <td>{booking.room_name}</td>
                            <td>{booking.user_name}</td>
                            <td>
                                {new Date(booking.start_time).toLocaleString()} - 
                                {new Date(booking.end_time).toLocaleString()}
                            </td>
                            <td>{booking.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Bookings;
