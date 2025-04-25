import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Card, Spin, message, Select } from 'antd';
import { SaveOutlined, LockOutlined } from '@ant-design/icons';
import { useQuery, useMutation, gql } from '@apollo/client';

const { Option } = Select;

const GET_SECURITY_SETTINGS = gql`
  query GetSecuritySettings {
    securitySettings {
      passwordPolicy {
        minLength
        requireUppercase
        requireLowercase
        requireNumbers
        requireSpecialChars
        passwordExpiryDays
        preventPasswordReuse
        maxLoginAttempts
      }
      sessionSettings {
        sessionTimeoutMinutes
        rememberMeDurationDays
        enforceOneSessionPerUser
        tokenExpirationHours
      }
      twoFactorAuth {
        enabled
        requiredForRoles
        allowRememberDevice
        rememberDeviceDurationDays
      }
      ipSecurity {
        whitelistEnabled
        ipWhitelist
        blacklistEnabled
        ipBlacklist
        maxRequestsPerMinute
      }
    }
  }
`;

const UPDATE_PASSWORD_POLICY = gql`
  mutation UpdatePasswordPolicy($input: PasswordPolicyInput!) {
    updatePasswordPolicy(input: $input) {
      minLength
      requireUppercase
      requireLowercase
    }
  }
`;

const UPDATE_SESSION_SETTINGS = gql`
  mutation UpdateSessionSettings($input: SessionSettingsInput!) {
    updateSessionSettings(input: $input) {
      sessionTimeoutMinutes
      tokenExpirationHours
    }
  }
`;

const UPDATE_TWO_FACTOR_AUTH = gql`
  mutation UpdateTwoFactorAuth($input: TwoFactorAuthInput!) {
    updateTwoFactorAuth(input: $input) {
      enabled
      requiredForRoles
    }
  }
`;

const SecuritySettings: React.FC = () => {
  const [passwordPolicyForm] = Form.useForm();
  const [sessionForm] = Form.useForm();
  const [twoFactorForm] = Form.useForm();
  const [ipSecurityForm] = Form.useForm();
  
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);
  const [ipBlacklistEnabled, setIpBlacklistEnabled] = useState(false);

  const { loading, error, data } = useQuery(GET_SECURITY_SETTINGS);
  const [updatePasswordPolicy, { loading: updatingPasswordPolicy }] = useMutation(UPDATE_PASSWORD_POLICY);
  const [updateSessionSettings, { loading: updatingSessionSettings }] = useMutation(UPDATE_SESSION_SETTINGS);
  const [updateTwoFactorAuth, { loading: updatingTwoFactorAuth }] = useMutation(UPDATE_TWO_FACTOR_AUTH);

  useEffect(() => {
    if (data?.securitySettings) {
      const { passwordPolicy, sessionSettings, twoFactorAuth, ipSecurity } = data.securitySettings;
      
      passwordPolicyForm.setFieldsValue(passwordPolicy);
      sessionForm.setFieldsValue(sessionSettings);
      twoFactorForm.setFieldsValue(twoFactorAuth);
      ipSecurityForm.setFieldsValue(ipSecurity);
      
      setTfaEnabled(twoFactorAuth.enabled);
      setIpWhitelistEnabled(ipSecurity.whitelistEnabled);
      setIpBlacklistEnabled(ipSecurity.blacklistEnabled);
    }
  }, [data, passwordPolicyForm, sessionForm, twoFactorForm, ipSecurityForm]);

  const updatePasswordPolicySettings = async (values: any) => {
    try {
      await updatePasswordPolicy({
        variables: {
          input: values
        }
      });
      message.success('Password policy updated successfully');
    } catch (error) {
      message.error('Failed to update password policy');
      console.error('Error:', error);
    }
  };

  const updateSessionConfig = async (values: any) => {
    try {
      await updateSessionSettings({
        variables: {
          input: values
        }
      });
      message.success('Session settings updated successfully');
    } catch (error) {
      message.error('Failed to update session settings');
      console.error('Error:', error);
    }
  };

  const updateTwoFactorSettings = async (values: any) => {
    try {
      await updateTwoFactorAuth({
        variables: {
          input: values
        }
      });
      message.success('Two-factor authentication settings updated successfully');
    } catch (error) {
      message.error('Failed to update two-factor authentication settings');
      console.error('Error:', error);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading security settings: {error.message}</div>;

  return (
    <div className="security-settings">
      <Card title="Password Policy" className="settings-card">
        <Form
          form={passwordPolicyForm}
          layout="vertical"
          onFinish={updatePasswordPolicySettings}
          initialValues={data?.securitySettings?.passwordPolicy}
        >
          <Form.Item
            name="minLength"
            label="Minimum Password Length"
            rules={[{ required: true, message: 'Minimum length is required' }]}
          >
            <InputNumber min={6} max={30} style={{ width: '100%' }} />
          </Form.Item>

          <div className="checkbox-group">
            <Form.Item
              name="requireUppercase"
              valuePropName="checked"
              label="Require Uppercase Letters"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requireLowercase"
              valuePropName="checked"
              label="Require Lowercase Letters"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requireNumbers"
              valuePropName="checked"
              label="Require Numbers"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="requireSpecialChars"
              valuePropName="checked"
              label="Require Special Characters"
            >
              <Switch />
            </Form.Item>
          </div>

          <Form.Item
            name="passwordExpiryDays"
            label="Password Expiry (Days, 0 = never)"
          >
            <InputNumber min={0} max={365} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="preventPasswordReuse"
            valuePropName="checked"
            label="Prevent Password Reuse"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="maxLoginAttempts"
            label="Max Failed Login Attempts (0 = unlimited)"
          >
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updatingPasswordPolicy}
            >
              Save Password Policy
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Session Settings" className="settings-card">
        <Form
          form={sessionForm}
          layout="vertical"
          onFinish={updateSessionConfig}
          initialValues={data?.securitySettings?.sessionSettings}
        >
          <Form.Item
            name="sessionTimeoutMinutes"
            label="Session Timeout (Minutes)"
            rules={[{ required: true, message: 'Session timeout is required' }]}
          >
            <InputNumber min={5} max={1440} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="rememberMeDurationDays"
            label="'Remember Me' Duration (Days)"
          >
            <InputNumber min={1} max={365} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="enforceOneSessionPerUser"
            valuePropName="checked"
            label="Enforce One Session Per User"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="tokenExpirationHours"
            label="JWT Token Expiration (Hours)"
            rules={[{ required: true, message: 'Token expiration is required' }]}
          >
            <InputNumber min={1} max={72} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updatingSessionSettings}
            >
              Save Session Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Two-Factor Authentication" className="settings-card">
        <Form
          form={twoFactorForm}
          layout="vertical"
          onFinish={updateTwoFactorSettings}
          initialValues={data?.securitySettings?.twoFactorAuth}
        >
          <Form.Item
            name="enabled"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Enabled" 
              unCheckedChildren="Disabled" 
              onChange={setTfaEnabled}
            />
            <span className="settings-label">Two-Factor Authentication</span>
          </Form.Item>

          <div className={tfaEnabled ? '' : 'settings-disabled'}>
            <Form.Item
              name="requiredForRoles"
              label="Required For User Roles"
            >
              <Select mode="multiple" placeholder="Select roles" disabled={!tfaEnabled}>
                <Option value="ADMIN">Administrators</Option>
                <Option value="COUNTY_OFFICIAL">County Officials</Option>
                <Option value="INVESTOR">Investors</Option>
                <Option value="USER">Regular Users</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="allowRememberDevice"
              valuePropName="checked"
              label="Allow 'Remember This Device'"
            >
              <Switch disabled={!tfaEnabled} />
            </Form.Item>

            <Form.Item
              name="rememberDeviceDurationDays"
              label="Remember Device Duration (Days)"
            >
              <InputNumber min={1} max={365} style={{ width: '100%' }} disabled={!tfaEnabled} />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updatingTwoFactorAuth}
              disabled={!tfaEnabled}
            >
              Save Two-Factor Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="IP Security" className="settings-card">
        <Form
          form={ipSecurityForm}
          layout="vertical"
          initialValues={data?.securitySettings?.ipSecurity}
        >
          <Form.Item
            name="whitelistEnabled"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Enabled" 
              unCheckedChildren="Disabled" 
              onChange={setIpWhitelistEnabled}
            />
            <span className="settings-label">IP Whitelist</span>
          </Form.Item>

          <Form.Item
            name="ipWhitelist"
            label="IP Whitelist (One per line)"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="192.168.1.1&#10;10.0.0.1&#10;10.0.0.2"
              disabled={!ipWhitelistEnabled}
            />
          </Form.Item>

          <Form.Item
            name="blacklistEnabled"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Enabled" 
              unCheckedChildren="Disabled" 
              onChange={setIpBlacklistEnabled}
            />
            <span className="settings-label">IP Blacklist</span>
          </Form.Item>

          <Form.Item
            name="ipBlacklist"
            label="IP Blacklist (One per line)"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="192.168.1.100&#10;10.0.0.5"
              disabled={!ipBlacklistEnabled}
            />
          </Form.Item>

          <Form.Item
            name="maxRequestsPerMinute"
            label="Rate Limit (Requests per Minute, 0 = unlimited)"
          >
            <InputNumber min={0} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              Save IP Security Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SecuritySettings; 