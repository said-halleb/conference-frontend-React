// src/App.js
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
import strings from '@/config/strings';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const AppContent = () => {
  const { currentUser, isAdmin, isManager, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getBookings();
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            {strings.navbar.brand}
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
                    <span className="nav-link">
                      {strings.navbar.welcome} {currentUser.name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                      {strings.navbar.logout}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <div className="container mt-4">
                <Banner title={strings.dashboard.bannerTitle} backgroundImage={banner} />
                <div className="row">
                  <div className={(isAdmin || isManager) ? "col-md-8" : "col-md-12"}>
                    <RoomList />
                    <BookingForm refreshBookings={getBookings} />
                  </div>
                  {(isAdmin || isManager) && (
                    <div className="col-md-4">
                      <CreateUserForm />
                      <CreateRoomForm />
                    </div>
                  )}
                </div>

                <section className="mt-5 bg-dark p-4 rounded mt-5">
                  <h2 className="mb-4 text-white text-center">{strings.dashboard.bookingsTitle}</h2>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>{strings.dashboard.tableHeaders.id}</th>
                          <th>{strings.dashboard.tableHeaders.user}</th>
                          <th>{strings.dashboard.tableHeaders.room}</th>
                          <th>{strings.dashboard.tableHeaders.start}</th>
                          <th>{strings.dashboard.tableHeaders.end}</th>
                          <th>{strings.dashboard.tableHeaders.status}</th>
                        </tr>
                      </thead>
                   <tbody>
                        {bookings.map((booking, index) => (
                          <tr key={index}>
                            <td>{booking.id}</td>
                            <td>{booking.user_name}</td>
                            <td>{booking.room_name}</td> 
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td>{booking.status}</td>
                          </tr>
                        ))}
                      </tbody>
             </table>
                  </div>
    
                </section>
              </div>
            ) : (
              <div className="container mt-5 text-center">
                <p className="lead">{strings.dashboard.loginPrompt}</p>
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;