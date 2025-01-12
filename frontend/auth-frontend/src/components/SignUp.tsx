import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { getCSRFToken } from '../config/util';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  name: string;
  password: string;
}

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', name: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/signup', formData);
      const token = response.data.access_token;
      navigate('/signin');
    } catch (error: any) {
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <Container maxWidth="md" style={{ alignContent: 'center', height: '100vh' }}>
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  name='email'
                  type="email"
                  error={!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && formData.email !== ''}
                  helperText={!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && formData.email !== '' ? 'Please enter a valid email address' : ''}
                  onChange={handleChange}
                  required
                />
                <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
                />
                <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
                />
                <Button type="submit" variant="contained" color="primary">
                Sign Up
                </Button>
            </form>
            </Container>
    </Container>
  );
}

export default SignUp;