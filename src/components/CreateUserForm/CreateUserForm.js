// src/components/CreateUserForm.js
import React, { useState } from 'react';
import { createUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import './CreateUserForm.scss';
import strings from '@/config/strings';

const CreateUserForm = ({ refreshUsers }) => {
  const { currentUser } = useAuth(); // Vérifier les permissions
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Restriction aux admins
  if (!currentUser?.role || currentUser.role !== 'admin') {
    return null; // Ne pas afficher le formulaire si non admin
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation côté client
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role // 'user', 'admin', ou 'manager' (ajouté au backend)
    };



    try {
      await createUser(userData);
      setSuccess('User created successfully!');
      if (refreshUsers) refreshUsers(); // Rafraîchir la liste des utilisateurs si fourni
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch (err) {
      setError(err.message || 'Error creating user');
    }
  };

  return (
    <section className="create-user-form bg-dark p-4 rounded mt-5">
      <h2 className="mt-4 mb-3 text-white text-center">{strings.createUserForm.title}</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{strings.createUserForm.nameLabel}</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label >{strings.createUserForm.emailLabel}</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label >{strings.createUserForm.passwordLabel}</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <small className="text-muted">Minimum 6 characters</small>
        </div>
        <div className="form-group">
          <label className="text-white">{strings.createUserForm.roleLabel}</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">{strings.createUserForm.roleUser}</option>
            <option value="admin">{strings.createUserForm.roleAdmin}</option>
            <option value="manager">{strings.createUserForm.roleManager}</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3 bg-dark border-0 w-100">
          {strings.createUserForm.createButton}
        </button>
      </form>
    </section>
  );
};

export default CreateUserForm;