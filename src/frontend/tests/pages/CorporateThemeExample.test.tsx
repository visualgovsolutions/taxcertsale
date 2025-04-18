// import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CorporateThemeExample from '../../pages/CorporateThemeExample';

describe('CorporateThemeExample Page', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <CorporateThemeExample />
      </BrowserRouter>
    );
  });

  test('renders page title', () => {
    expect(screen.getByText('Corporate Theme Example')).toBeInTheDocument();
  });

  test('renders buttons section with variants', () => {
    expect(screen.getByText('Buttons')).toBeInTheDocument();
    expect(screen.getByText('Primary Variants')).toBeInTheDocument();
    expect(screen.getByText('Secondary Variants')).toBeInTheDocument();
    expect(screen.getByText('Outline Variants')).toBeInTheDocument();
  });

  test('renders cards section with examples', () => {
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('Basic Card')).toBeInTheDocument();
    expect(screen.getByText('Card with Footer')).toBeInTheDocument();
    expect(screen.getByText('Hover Effect Card')).toBeInTheDocument();
    expect(screen.getByText('Dark Card')).toBeInTheDocument();
  });

  test('renders buttons in different sizes', () => {
    const smallButtons = screen.getAllByText('Small');
    const defaultButtons = [
      ...screen.getAllByText('Default'),
    ];
    const largeButtons = screen.getAllByText('Large');

    expect(smallButtons.length).toBeGreaterThan(0);
    expect(defaultButtons.length).toBeGreaterThan(0);
    expect(largeButtons.length).toBeGreaterThan(0);
  });

  test('renders corporate design system section', () => {
    expect(screen.getByText('Corporate Design System')).toBeInTheDocument();
    expect(screen.getByText('Corporate Theme')).toBeInTheDocument();
    expect(screen.getByText(/this example page demonstrates/i)).toBeInTheDocument();
  });

  test('renders action buttons in the corporate design section', () => {
    expect(screen.getByText('View Auctions')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders a back to home link', () => {
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.getByText('Back to Home').closest('a')).toHaveAttribute('href', '/');
  });
}); 