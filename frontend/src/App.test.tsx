import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application header', () => {
  render(<App />);
  const headings = screen.getAllByRole('heading', { name: /BildeBua/i });
  expect(headings.length).toBeGreaterThan(0);
});
