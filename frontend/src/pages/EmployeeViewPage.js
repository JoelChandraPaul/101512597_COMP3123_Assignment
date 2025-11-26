import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/apiClient';

const EmployeeViewPage = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadEmployee = async () => {
      const res = await api.get(`/emp/employees/${id}`);
      setEmp(res.data);
    };
    loadEmployee();
  }, [id]);

  if (!emp) return null;

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Employee Details
      </Typography>

      {emp.profile_image && (
        <Box mb={2}>
          <img
            src={`${baseUrl}${emp.profile_image}`}
            alt="profile"
            style={{ width: 120, height: 120, objectFit: 'cover' }}
          />
        </Box>
      )}

      <Typography>
        Name: {emp.first_name} {emp.last_name}
      </Typography>
      <Typography>Email: {emp.email}</Typography>
      <Typography>Department: {emp.department}</Typography>
      <Typography>Position: {emp.position}</Typography>
      <Typography>Salary: {emp.salary}</Typography>
      <Typography>
        Date of Joining:{' '}
        {emp.date_of_joining
          ? new Date(emp.date_of_joining).toLocaleDateString()
          : ''}
      </Typography>
    </Box>
  );
};

export default EmployeeViewPage;
