import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Language Learning Assistant title', () => {
  render(<App />);
  const titleElement = screen.getByText(/AI Language Learning Assistant/i);
  expect(titleElement).toBeInTheDocument();
});
