import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiClient';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/emp/employees');
      return res.data;
    }
  });

  const handleSearch = async () => {
    const params = {};
    if (department) params.department = department;
    if (position) params.position = position;

    const res = await api.get('/emp/employees/search', { params });
    queryClient.setQueryData(['employees'], res.data);
  };

  const handleClear = async () => {
    setDepartment('');
    setPosition('');
    const res = await api.get('/emp/employees');
    queryClient.setQueryData(['employees'], res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await api.delete(`/emp/employees/${id}`);    // 🔥 FIXED DELETE
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  };

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <Box component={Paper} sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Employees</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/employees/add')}
        >
          Add Employee
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <TextField
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="text" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp._id}>
              <TableCell>
                {emp.profile_image && (
                  <img
                    src={`${baseUrl}${emp.profile_image}`}
                    alt="profile"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </TableCell>
              <TableCell>
                {emp.first_name} {emp.last_name}
              </TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.salary}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => navigate(`/employees/${emp._id}`)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate(`/employees/${emp._id}/edit`)}
                >
                  Update
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EmployeeListPage;
