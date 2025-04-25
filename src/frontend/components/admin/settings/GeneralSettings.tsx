import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message, Card, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation, gql } from '@apollo/client';

const { Option } = Select;
const { TextArea } = Input;

const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      applicationName
      supportEmail
      supportPhone
      timezone
      dateFormat
      maintenanceMode
      privacyPolicy
      termsOfService
    }
  }
`;

const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings($input: SystemSettingsInput!) {
    updateSystemSettings(input: $input) {
      applicationName
      supportEmail
      supportPhone
      timezone
      dateFormat
      maintenanceMode
    }
  }
`;

const GeneralSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  const { loading, error, data } = useQuery(GET_SYSTEM_SETTINGS);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_SYSTEM_SETTINGS);

  useEffect(() => {
    if (data?.systemSettings) {
      form.setFieldsValue(data.systemSettings);
    }
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      await updateSettings({
        variables: {
          input: values
        }
      });
      message.success('System settings updated successfully');
      setIsDirty(false);
    } catch (error) {
      message.error('Failed to update system settings');
      console.error('Error updating system settings:', error);
    }
  };

  const handleFormChange = () => {
    setIsDirty(true);
  };

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading system settings: {error.message}</div>;

  return (
    <Card title="General Settings" className="settings-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
        initialValues={data?.systemSettings}
      >
        <Form.Item
          name="applicationName"
          label="Application Name"
          rules={[{ required: true, message: 'Application name is required' }]}
        >
          <Input placeholder="Tax Certificate Sale Platform" />
        </Form.Item>

        <Form.Item
          name="supportEmail"
          label="Support Email"
          rules={[
            { required: true, message: 'Support email is required' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="support@example.com" />
        </Form.Item>

        <Form.Item
          name="supportPhone"
          label="Support Phone"
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Form.Item
          name="timezone"
          label="Default Timezone"
          rules={[{ required: true, message: 'Timezone is required' }]}
        >
          <Select placeholder="Select a timezone">
            <Option value="America/New_York">Eastern Time (ET)</Option>
            <Option value="America/Chicago">Central Time (CT)</Option>
            <Option value="America/Denver">Mountain Time (MT)</Option>
            <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
            <Option value="America/Anchorage">Alaska Time (AKT)</Option>
            <Option value="Pacific/Honolulu">Hawaii Time (HT)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dateFormat"
          label="Date Format"
          rules={[{ required: true, message: 'Date format is required' }]}
        >
          <Select placeholder="Select date format">
            <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
            <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
            <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="maintenanceMode"
          label="Maintenance Mode"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="privacyPolicy"
          label="Privacy Policy URL"
        >
          <Input placeholder="https://example.com/privacy-policy" />
        </Form.Item>

        <Form.Item
          name="termsOfService"
          label="Terms of Service URL"
        >
          <Input placeholder="https://example.com/terms-of-service" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={updating}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GeneralSettings; 