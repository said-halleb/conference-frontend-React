// src/components/CreateUserForm.js
import React, { useState } from 'react';
import { createUser } from '../services/api';
import './CreateUserForm.scss';

const CreateUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ name, email, password, role });
    alert('User created successfully!');
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  };

  return (
    <section className="create-user-form">
      <h2 className="mt-4 mb-3">Créer un Utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rôle :</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Créer</button>
      </form>
    </section>
  );
};

export default CreateUserForm;
