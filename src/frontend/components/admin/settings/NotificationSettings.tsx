import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Select, Card, Spin, message, Collapse } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation, gql } from '@apollo/client';

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

const GET_NOTIFICATION_SETTINGS = gql`
  query GetNotificationSettings {
    notificationSettings {
      emailNotifications {
        enabled
        fromName
        fromEmail
        replyToEmail
        smtpHost
        smtpPort
        smtpUsername
        smtpSecure
        emailTemplates {
          id
          name
          subject
          bodyHtml
          bodyText
          eventType
          active
        }
      }
      systemNotifications {
        userRegistration
        certificatePurchase
        auctionStart
        auctionEnd
        certificateRedemption
        certificateExpiration
        kyc
      }
      smsNotifications {
        enabled
        provider
        accountSid
        apiKey
        phoneNumber
      }
    }
  }
`;

const UPDATE_EMAIL_NOTIFICATION_SETTINGS = gql`
  mutation UpdateEmailNotificationSettings($input: EmailNotificationSettingsInput!) {
    updateEmailNotificationSettings(input: $input) {
      enabled
      fromName
      fromEmail
    }
  }
`;

const UPDATE_SYSTEM_NOTIFICATION_SETTINGS = gql`
  mutation UpdateSystemNotificationSettings($input: SystemNotificationSettingsInput!) {
    updateSystemNotificationSettings(input: $input) {
      userRegistration
      certificatePurchase
      auctionStart
      auctionEnd
    }
  }
`;

const NotificationSettings: React.FC = () => {
  const [emailForm] = Form.useForm();
  const [systemForm] = Form.useForm();
  const [smsForm] = Form.useForm();
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const { loading, error, data } = useQuery(GET_NOTIFICATION_SETTINGS);
  const [updateEmailSettings, { loading: updatingEmail }] = useMutation(UPDATE_EMAIL_NOTIFICATION_SETTINGS);
  const [updateSystemSettings, { loading: updatingSystem }] = useMutation(UPDATE_SYSTEM_NOTIFICATION_SETTINGS);

  useEffect(() => {
    if (data?.notificationSettings) {
      const { emailNotifications, systemNotifications, smsNotifications } = data.notificationSettings;
      
      emailForm.setFieldsValue(emailNotifications);
      setEmailEnabled(emailNotifications.enabled);
      
      systemForm.setFieldsValue(systemNotifications);
      
      smsForm.setFieldsValue(smsNotifications);
      setSmsEnabled(smsNotifications.enabled);
    }
  }, [data, emailForm, systemForm, smsForm]);

  const updateEmailNotifications = async (values: any) => {
    try {
      await updateEmailSettings({
        variables: {
          input: values
        }
      });
      message.success('Email notification settings updated successfully');
    } catch (error) {
      message.error('Failed to update email notification settings');
      console.error('Error:', error);
    }
  };

  const updateSystemNotifications = async (values: any) => {
    try {
      await updateSystemSettings({
        variables: {
          input: values
        }
      });
      message.success('System notification settings updated successfully');
    } catch (error) {
      message.error('Failed to update system notification settings');
      console.error('Error:', error);
    }
  };

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading notification settings: {error.message}</div>;

  return (
    <div className="notification-settings">
      <Collapse defaultActiveKey={['email', 'system']}>
        <Panel header="Email Notifications" key="email">
          <Card className="settings-card">
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={updateEmailNotifications}
              initialValues={data?.notificationSettings?.emailNotifications}
            >
              <Form.Item
                name="enabled"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Enabled" 
                  unCheckedChildren="Disabled" 
                  onChange={setEmailEnabled}
                />
                <span className="settings-label">Email Notifications</span>
              </Form.Item>

              <div className={emailEnabled ? '' : 'settings-disabled'}>
                <Form.Item
                  name="fromName"
                  label="Sender Name"
                  rules={[{ required: emailEnabled, message: 'Sender name is required' }]}
                >
                  <Input placeholder="Tax Certificate Sale Platform" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="fromEmail"
                  label="Sender Email"
                  rules={[
                    { required: emailEnabled, message: 'Sender email is required' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="noreply@example.com" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="replyToEmail"
                  label="Reply-To Email"
                  rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                >
                  <Input placeholder="support@example.com" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="smtpHost"
                  label="SMTP Host"
                  rules={[{ required: emailEnabled, message: 'SMTP host is required' }]}
                >
                  <Input placeholder="smtp.example.com" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="smtpPort"
                  label="SMTP Port"
                  rules={[{ required: emailEnabled, message: 'SMTP port is required' }]}
                >
                  <Input placeholder="587" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="smtpUsername"
                  label="SMTP Username"
                >
                  <Input placeholder="username" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="smtpPassword"
                  label="SMTP Password"
                >
                  <Input.Password placeholder="password" disabled={!emailEnabled} />
                </Form.Item>

                <Form.Item
                  name="smtpSecure"
                  valuePropName="checked"
                >
                  <Switch disabled={!emailEnabled} />
                  <span className="settings-label">Use Secure Connection (TLS/SSL)</span>
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updatingEmail}
                  disabled={!emailEnabled}
                >
                  Save Email Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Panel>

        <Panel header="System Notifications" key="system">
          <Card className="settings-card">
            <Form
              form={systemForm}
              layout="vertical"
              onFinish={updateSystemNotifications}
              initialValues={data?.notificationSettings?.systemNotifications}
            >
              <div className="system-notification-options">
                <Form.Item
                  name="userRegistration"
                  valuePropName="checked"
                  label="User Registration"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="certificatePurchase"
                  valuePropName="checked"
                  label="Certificate Purchase"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="auctionStart"
                  valuePropName="checked"
                  label="Auction Start"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="auctionEnd"
                  valuePropName="checked"
                  label="Auction End"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="certificateRedemption"
                  valuePropName="checked"
                  label="Certificate Redemption"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="certificateExpiration"
                  valuePropName="checked"
                  label="Certificate Expiration"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="kyc"
                  valuePropName="checked"
                  label="KYC Updates"
                >
                  <Switch />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={updatingSystem}
                >
                  Save System Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Panel>

        <Panel header="SMS Notifications" key="sms">
          <Card className="settings-card">
            <Form
              form={smsForm}
              layout="vertical"
              initialValues={data?.notificationSettings?.smsNotifications}
            >
              <Form.Item
                name="enabled"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Enabled" 
                  unCheckedChildren="Disabled" 
                  onChange={setSmsEnabled}
                />
                <span className="settings-label">SMS Notifications</span>
              </Form.Item>

              <div className={smsEnabled ? '' : 'settings-disabled'}>
                <Form.Item
                  name="provider"
                  label="SMS Provider"
                  rules={[{ required: smsEnabled, message: 'SMS provider is required' }]}
                >
                  <Select placeholder="Select SMS provider" disabled={!smsEnabled}>
                    <Option value="twilio">Twilio</Option>
                    <Option value="aws_sns">AWS SNS</Option>
                    <Option value="nexmo">Nexmo</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="accountSid"
                  label="Account SID/ID"
                  rules={[{ required: smsEnabled, message: 'Account SID/ID is required' }]}
                >
                  <Input disabled={!smsEnabled} />
                </Form.Item>

                <Form.Item
                  name="apiKey"
                  label="API Key/Token"
                  rules={[{ required: smsEnabled, message: 'API Key/Token is required' }]}
                >
                  <Input.Password disabled={!smsEnabled} />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label="From Phone Number"
                  rules={[{ required: smsEnabled, message: 'From phone number is required' }]}
                >
                  <Input placeholder="+1234567890" disabled={!smsEnabled} />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  disabled={!smsEnabled}
                >
                  Save SMS Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Panel>
      </Collapse>
    </div>
  );
};

export default NotificationSettings; 