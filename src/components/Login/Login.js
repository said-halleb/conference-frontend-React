import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/api';
import './Login.scss';
import strings from '@/config/strings';
import { useAuth } from '@/context/AuthContext';
import loginImg from '@/images/conference-room.jpg';
const Login = () => {
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  if (!auth) {
    return <div>Error: AuthContext not available</div>;
  }
  
  const { login } = auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await loginUser({ email, password });
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid login credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImg} alt="Login Illustration" />
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{strings.loginForm.title}</h2>
          {error && <p className="error text-danger">{error}</p>}
          <div className="form-group">
            <label>{strings.loginForm.email}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{strings.loginForm.password}</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary bg-dark border-0">
            {strings.loginForm.login}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;