import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Welcome() {
  return (
    <Container style={{ alignContent: 'center', height: '100vh' }}>
        <Container>
            <Box textAlign="center" marginTop={4}>
                <Typography variant="h3" gutterBottom>
                Welcome to the Full Stack App By Amal
                </Typography>
                <Typography variant="body1">
                Enjoy using the application!
                </Typography>
            </Box>
        </Container>
    </Container>
  );
}

export default Welcome;