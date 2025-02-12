import React from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
    return (
        <div className="home-container">
            <div className="overlay">
                <div className="text-center text-white hero-content">
                    <h1 className="display-3 mb-4">Bienvenue sur la Gestion des Salles</h1>
                    <p className="lead mb-5">
                        Simplifiez la gestion de vos salles de réunion et boostez la productivité de vos équipes.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/rooms" className="btn btn-primary btn-lg">
                            Explorer les Salles
                        </Link>
                        <Link to="/bookings" className="btn btn-outline-light btn-lg">
                            Mes Réservations
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
