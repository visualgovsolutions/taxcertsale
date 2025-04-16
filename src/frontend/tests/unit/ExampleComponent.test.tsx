import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';

// Placeholder component for demonstration
const ExampleComponent: React.FC<{ message: string }> = ({ message }) => {
  return <div>{message}</div>;
};

describe('ExampleComponent', () => {
  it('should render the message correctly', () => {
    const testMessage = 'Hello, World!';
    render(<ExampleComponent message={testMessage} />);
    
    // Check if the component renders the message
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('should render a different message', () => {
    const testMessage = 'Another Test Message';
    render(<ExampleComponent message={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
}); 