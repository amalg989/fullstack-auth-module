import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/signin', formData);
      navigate('/welcome', { state: { token: response.data.access_token } });
    } catch (error: any) {
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <Container maxWidth="md" style={{ alignContent: 'center', height: '100vh' }}>
        <Container maxWidth="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box flex={1} paddingLeft={4}>
            <Typography variant="h4" gutterBottom align="center">
            Sign In
            </Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <TextField
                label="Email"
                name="email"
                fullWidth
                error={!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && formData.email !== ''}
                helperText={!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && formData.email !== '' ? 'Please enter a valid email address' : ''}
                margin="normal"
                value={formData.email}
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
            <Box textAlign="center" marginTop={2}>
                <Button type="submit" variant="contained" color="primary">
                Sign In
                </Button>
            </Box>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
            </Typography>
        </Box>
        </Container>
    </Container>
  );
}

export default SignIn;