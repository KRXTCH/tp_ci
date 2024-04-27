import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home';
import UserManager from './Pages/UserManager';

describe('App component', () => {
  test('renders home page when navigating to / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome !')).toBeInTheDocument();
    expect(screen.getByText(/You can accessed to both backend by '#\/mongo' or '#\/mysql'/i)).toBeInTheDocument();
  });

  test('renders UserManager with port 3000 when navigating to /mongo route', () => {
    render(
      <MemoryRouter initialEntries={['/mongo']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('User manager')).toBeInTheDocument();
  });

  test('renders UserManager with port 5000 when navigating to /mysql route', () => {
    render(
      <MemoryRouter initialEntries={['/mysql']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('User manager')).toBeInTheDocument();
  });
});
