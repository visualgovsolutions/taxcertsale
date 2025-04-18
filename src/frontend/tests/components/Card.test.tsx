// import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../components/Card';

describe('Card Component', () => {
  test('renders children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders with title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('renders footer when provided', () => {
    render(
      <Card 
        title="Card With Footer"
        footer={<button>Action Button</button>}
      >
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card With Footer')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  test('applies elevation classes correctly', () => {
    const { rerender } = render(
      <Card elevation="none" data-testid="card">
        <p>No elevation</p>
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).not.toHaveClass('shadow');
    expect(card).not.toHaveClass('shadow-sm');
    expect(card).not.toHaveClass('shadow-lg');
    
    rerender(
      <Card elevation="sm" data-testid="card">
        <p>Small elevation</p>
      </Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-sm');
    
    rerender(
      <Card elevation="md" data-testid="card">
        <p>Medium elevation</p>
      </Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow');
    
    rerender(
      <Card elevation="lg" data-testid="card">
        <p>Large elevation</p>
      </Card>
    );
    
    card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-lg');
  });

  test('applies border when bordered is true', () => {
    render(
      <Card bordered data-testid="card">
        <p>Bordered card</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
  });

  test('applies hover effect when hoverEffect is true', () => {
    render(
      <Card hoverEffect data-testid="card">
        <p>Card with hover effect</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-300');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  test('applies custom class names', () => {
    render(
      <Card className="custom-class" data-testid="card">
        <p>Custom card</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  test('applies custom header class names', () => {
    render(
      <Card 
        title="Custom Header" 
        headerClassName="header-custom-class"
        data-testid="card"
      >
        <p>Content</p>
      </Card>
    );
    
    const header = screen.getByText('Custom Header').parentElement;
    expect(header).toHaveClass('header-custom-class');
  });

  test('applies custom body class names', () => {
    render(
      <Card 
        bodyClassName="body-custom-class"
        data-testid="card"
      >
        <p>Content</p>
      </Card>
    );
    
    const body = screen.getByText('Content').parentElement;
    expect(body).toHaveClass('body-custom-class');
  });

  test('applies custom footer class names', () => {
    render(
      <Card 
        footer={<p>Footer content</p>}
        footerClassName="footer-custom-class"
        data-testid="card"
      >
        <p>Content</p>
      </Card>
    );
    
    const footer = screen.getByText('Footer content').parentElement;
    expect(footer).toHaveClass('footer-custom-class');
  });
}); 