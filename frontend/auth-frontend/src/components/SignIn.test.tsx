import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './SignIn';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SignIn Component', () => {
  it('renders SignIn form', () => {
    render(<SignIn />, { wrapper: MemoryRouter });
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('submits the form with correct values', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'mocked_token' }
    });

    render(<SignIn />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/sign in successful/i)).toBeInTheDocument();
  });
});