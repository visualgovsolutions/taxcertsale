import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import SystemSettingsPage from '../SystemSettingsPage';
import { GET_SYSTEM_SETTINGS } from '../../../components/admin/settings/GeneralSettings';
import { GET_FEE_STRUCTURE } from '../../../components/admin/settings/FeeStructureSettings';
import { GET_NOTIFICATION_SETTINGS } from '../../../components/admin/settings/NotificationSettings';
import { GET_SECURITY_SETTINGS } from '../../../components/admin/settings/SecuritySettings';

// Mock general settings data
const generalSettingsMock = {
  request: {
    query: GET_SYSTEM_SETTINGS
  },
  result: {
    data: {
      systemSettings: {
        applicationName: 'Tax Certificate Sale Platform',
        supportEmail: 'support@example.com',
        supportPhone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        maintenanceMode: false,
        privacyPolicy: 'https://example.com/privacy',
        termsOfService: 'https://example.com/terms'
      }
    }
  }
};

// Mock fee structure data
const feeStructureMock = {
  request: {
    query: GET_FEE_STRUCTURE
  },
  result: {
    data: {
      feeStructure: {
        id: '1',
        certificateFees: [
          {
            id: '1',
            name: 'Administrative Fee',
            description: 'Fee for certificate processing',
            type: 'FIXED',
            value: 10,
            isPercentage: false,
            minAmount: null,
            maxAmount: null,
            active: true
          }
        ],
        interestRateLimits: {
          minRate: 0.5,
          maxRate: 18,
          defaultRate: 5
        },
        platformFees: [
          {
            id: '1',
            name: 'Platform Usage Fee',
            description: 'Fee for using the platform',
            value: 2.5,
            isPercentage: true,
            minAmount: 1,
            maxAmount: 100,
            applicableUserRoles: ['INVESTOR'],
            active: true
          }
        ]
      }
    }
  }
};

// Mock notification settings data
const notificationSettingsMock = {
  request: {
    query: GET_NOTIFICATION_SETTINGS
  },
  result: {
    data: {
      notificationSettings: {
        emailNotifications: {
          enabled: true,
          fromName: 'Tax Certificate Platform',
          fromEmail: 'noreply@example.com',
          replyToEmail: 'support@example.com',
          smtpHost: 'smtp.example.com',
          smtpPort: '587',
          smtpUsername: 'smtp-user',
          smtpSecure: true,
          emailTemplates: []
        },
        systemNotifications: {
          userRegistration: true,
          certificatePurchase: true,
          auctionStart: true,
          auctionEnd: true,
          certificateRedemption: true,
          certificateExpiration: false,
          kyc: true
        },
        smsNotifications: {
          enabled: false,
          provider: 'twilio',
          accountSid: '',
          apiKey: '',
          phoneNumber: ''
        }
      }
    }
  }
};

// Mock security settings data
const securitySettingsMock = {
  request: {
    query: GET_SECURITY_SETTINGS
  },
  result: {
    data: {
      securitySettings: {
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          passwordExpiryDays: 90,
          preventPasswordReuse: true,
          maxLoginAttempts: 5
        },
        sessionSettings: {
          sessionTimeoutMinutes: 30,
          rememberMeDurationDays: 30,
          enforceOneSessionPerUser: false,
          tokenExpirationHours: 24
        },
        twoFactorAuth: {
          enabled: true,
          requiredForRoles: ['ADMIN', 'COUNTY_OFFICIAL'],
          allowRememberDevice: true,
          rememberDeviceDurationDays: 30
        },
        ipSecurity: {
          whitelistEnabled: false,
          ipWhitelist: '',
          blacklistEnabled: false,
          ipBlacklist: '',
          maxRequestsPerMinute: 100
        }
      }
    }
  }
};

const mocks = [
  generalSettingsMock,
  feeStructureMock,
  notificationSettingsMock,
  securitySettingsMock
];

describe('SystemSettingsPage', () => {
  it('renders the page title and breadcrumbs', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <SystemSettingsPage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays the settings tabs', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <SystemSettingsPage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Fee Structure')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('loads general settings data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <SystemSettingsPage />
        </BrowserRouter>
      </MockedProvider>
    );

    // Wait for loading to finish and data to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('handles GraphQL errors gracefully', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_SYSTEM_SETTINGS
        },
        error: new Error('Failed to load system settings')
      }
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <SystemSettingsPage />
        </BrowserRouter>
      </MockedProvider>
    );

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/error loading system settings/i)).toBeInTheDocument();
    });
  });
}); 