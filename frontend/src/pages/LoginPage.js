import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.usernameOrEmail || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const payload = form.usernameOrEmail.includes('@')
        ? { email: form.usernameOrEmail, password: form.password }
        : { username: form.usernameOrEmail, password: form.password };

      const res = await api.post('/user/login', payload);

      localStorage.setItem('token', res.data.token);
      navigate('/employees');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <Box
      component={Paper}
      sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 4 }}
    >
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username or Email"
          name="usernameOrEmail"
          margin="normal"
          value={form.usernameOrEmail}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
