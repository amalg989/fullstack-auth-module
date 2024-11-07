import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './SignUp';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SignUp Component', () => {
  it('renders SignUp form', () => {
    render(<SignUp />, { wrapper: MemoryRouter });
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', () => {
    render(<SignUp />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText(/email/i));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('submits the form with correct values', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'mocked_token' }
    })
    
    render(<SignUp />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/sign up successful/i)).toBeInTheDocument();
  });
});
