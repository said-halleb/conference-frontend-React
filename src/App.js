import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import RoomList from '@/components/RoomList/RoomList';
import BookingForm from '@/components/BookingForm/BookingForm';
import Login from '@/components/Login/Login';
import CreateUserForm from '@/components/CreateUserForm/CreateUserForm';
import CreateRoomForm from '@/components/CreateRoomForm/CreateRoomForm';
import { fetchBookings } from '@/services/api';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Banner from '@/components/Banner/Banner';
import banner from '@/images/banner.jpg';
const App = () => {
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); 

  const getBookings = async () => {
    const data = await fetchBookings();
    setBookings(data);
  };

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setCurrentUser(loggedUser);
      setIsAdmin(loggedUser.role === 'admin');
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    navigate('/dashboard'); // Rediriger vers le tableau de bord après la connexion
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Supprimer l'utilisateur du localStorage
    setCurrentUser(null); // Réinitialiser l'utilisateur actuel
    setIsAdmin(false); // Réinitialiser le statut admin
    navigate('/'); // Rediriger vers la page de connexion
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            Gestion de Réservation de Salles
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {currentUser && (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Bienvenue, {currentUser.name}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <div className="container mt-4">
              <Banner title="Gestion de Réservation de Salles" backgroundImage={banner} />

                <div className="row">
                  <div className="col-md-8">
                    <RoomList />
                    <BookingForm refreshBookings={getBookings} />
                  </div>
                  <div className="col-md-4">
                    {isAdmin && (
                      <>
                        <CreateUserForm />
                        <CreateRoomForm />
                      </>
                    )}
                  </div>
                </div>

                <section className="mt-5">
                  <h2 className="mb-4">Réservations</h2>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Utilisateur</th>
                          <th>Salle</th>
                          <th>Début</th>
                          <th>Fin</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{booking.user_id}</td>
                            <td>{booking.room_id}</td>
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td>{booking.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={getBookings} className="btn btn-primary mt-3">
                    Rafraîchir les Réservations
                  </button>
                </section>
              </div>
            ) : (
              <div className="container mt-5 text-center">
                <p className="lead">Vous devez vous connecter pour accéder à cette page.</p>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;