// src/components/CreateUserForm.js
import React, { useState } from 'react';
import { createUser } from '@/services/api';
import './CreateUserForm.scss';
import strings from '@/config/strings';
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
      <h2 className="mt-4 mb-3">{strings.createUserForm.title}</h2>
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
          <label>{strings.createUserForm.emailLabel}</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.createUserForm.passwordLabel}</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>{strings.createUserForm.roleLabel}</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">{strings.createUserForm.roleUser}</option>
            <option value="admin">{strings.createUserForm.roleAdmin}</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3 bg-dark border-0">
          {strings.createUserForm.createButton}
        </button>
      </form>
    </section>
  );
};

export default CreateUserForm;
