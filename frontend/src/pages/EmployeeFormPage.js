import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/apiClient';

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmployee = async () => {
      if (!isEdit) return;
      const res = await api.get(`/emp/employees/${id}`);
      const emp = res.data;
      setForm({
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        position: emp.position,
        salary: emp.salary,
        date_of_joining: emp.date_of_joining
          ? emp.date_of_joining.substring(0, 10)
          : '',
        department: emp.department
      });
    };
    loadEmployee();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.position ||
      !form.salary ||
      !form.date_of_joining ||
      !form.department
    ) {
      setError('All fields are required');
      return false;
    }
    if (isNaN(Number(form.salary))) {
      setError('Salary must be numeric');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (file) {
      data.append('profileImage', file);
    }

    try {
      if (isEdit) {
        await api.put(`/emp/employees/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/emp/employees', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/employees');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Error saving employee. Please try again.'
      );
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        {isEdit ? 'Update Employee' : 'Add Employee'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          margin="normal"
          value={form.first_name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="last_name"
          margin="normal"
          value={form.last_name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Position"
          name="position"
          margin="normal"
          value={form.position}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Salary"
          name="salary"
          margin="normal"
          value={form.salary}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Date of Joining"
          type="date"
          name="date_of_joining"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.date_of_joining}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Department"
          name="department"
          margin="normal"
          value={form.department}
          onChange={handleChange}
        />

        <Box mt={2}>
          <Typography variant="body2" mb={1}>
            Profile Picture
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Box>

        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
        >
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </form>
    </Box>
  );
};

export default EmployeeFormPage;
