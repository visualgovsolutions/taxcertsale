import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import UserRoleChangeModal, { UPDATE_USER_ROLE, UserRole } from '../UserRoleChangeModal';

const mockUser = {
  id: '1',
  role: 'USER' as UserRole
};

const mockClose = jest.fn();
const mockOnRoleChange = jest.fn();

const mocks = [
  {
    request: {
      query: UPDATE_USER_ROLE,
      variables: { userId: '1', role: 'ADMIN' }
    },
    result: {
      data: {
        updateUserRole: {
          id: '1',
          role: 'ADMIN'
        }
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: UPDATE_USER_ROLE,
      variables: { userId: '1', role: 'ADMIN' }
    },
    error: new Error('Failed to update role')
  }
];

describe('UserRoleChangeModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when show is true', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserRoleChangeModal
          show={true}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    expect(screen.getByText('Change User Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render the modal when show is false', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserRoleChangeModal
          show={false}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    expect(screen.queryByText('Change User Role')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserRoleChangeModal
          show={true}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockClose).toHaveBeenCalled();
  });

  it('updates user role successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserRoleChangeModal
          show={true}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    const select = screen.getByLabelText('Select Role');
    fireEvent.change(select, { target: { value: 'ADMIN' } });

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(mockOnRoleChange).toHaveBeenCalledWith('ADMIN');
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it('displays error message when update fails', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <UserRoleChangeModal
          show={true}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    const select = screen.getByLabelText('Select Role');
    fireEvent.change(select, { target: { value: 'ADMIN' } });

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to update role')).toBeInTheDocument();
      expect(mockOnRoleChange).not.toHaveBeenCalled();
      expect(mockClose).not.toHaveBeenCalled();
    });
  });

  it('disables Update button when no role is selected', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserRoleChangeModal
          show={true}
          onClose={mockClose}
          userId={mockUser.id}
          currentRole={mockUser.role}
          onRoleChange={mockOnRoleChange}
        />
      </MockedProvider>
    );

    const updateButton = screen.getByRole('button', { name: 'Update' });
    expect(updateButton).toBeDisabled();

    const select = screen.getByLabelText('Select Role');
    fireEvent.change(select, { target: { value: 'ADMIN' } });

    expect(updateButton).toBeEnabled();
  });
}); 