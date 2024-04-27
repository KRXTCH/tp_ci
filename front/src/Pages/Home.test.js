import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home component', () => {
  test('renders texts message', () => {
    render(<Home />);
    const welcomeElement = screen.getByText(/Welcome !/i);
    expect(welcomeElement).toBeInTheDocument();
    const instructionsElement = screen.getByText(/You can accessed to both backend by '#\/mongo' or '#\/mysql'/i);
    expect(instructionsElement).toBeInTheDocument();
  });
});
