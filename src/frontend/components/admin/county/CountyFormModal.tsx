import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber, message } from 'antd';
import { useMutation, gql } from '@apollo/client';

// GraphQL mutations
const CREATE_COUNTY = gql`
  mutation CreateCounty($input: CreateCountyInput!) {
    createCounty(input: $input) {
      id
      name
      state
      countyCode
      websiteUrl
      taxCollectorUrl
      propertyAppraiserUrl
      description
      latitude
      longitude
    }
  }
`;

const UPDATE_COUNTY = gql`
  mutation UpdateCounty($id: ID!, $input: UpdateCountyInput!) {
    updateCounty(id: $id, input: $input) {
      id
      name
      state
      countyCode
      websiteUrl
      taxCollectorUrl
      propertyAppraiserUrl
      description
      latitude
      longitude
    }
  }
`;

interface CountyFormModalProps {
  visible: boolean;
  county?: any; // If provided, we're editing an existing county
  onClose: () => void;
  onSuccess: () => void;
}

const CountyFormModal: React.FC<CountyFormModalProps> = ({
  visible,
  county,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const isEditing = !!county;

  // Set up mutations
  const [createCounty, { loading: createLoading }] = useMutation(CREATE_COUNTY);
  const [updateCounty, { loading: updateLoading }] = useMutation(UPDATE_COUNTY);

  // Set form values when editing
  useEffect(() => {
    if (visible && county) {
      form.setFieldsValue({
        name: county.name,
        state: county.state,
        countyCode: county.countyCode,
        websiteUrl: county.websiteUrl,
        taxCollectorUrl: county.taxCollectorUrl,
        propertyAppraiserUrl: county.propertyAppraiserUrl,
        description: county.description,
        latitude: county.latitude,
        longitude: county.longitude
      });
    } else {
      form.resetFields();
    }
  }, [visible, county, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditing) {
        await updateCounty({
          variables: {
            id: county.id,
            input: values
          }
        });
        message.success('County updated successfully');
      } else {
        await createCounty({
          variables: {
            input: values
          }
        });
        message.success('County created successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to save county');
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit County' : 'Add County'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createLoading || updateLoading}
          onClick={handleSubmit}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          state: 'FL' // Default to Florida
        }}
      >
        <Form.Item
          name="name"
          label="County Name"
          rules={[{ required: true, message: 'Please enter the county name' }]}
        >
          <Input placeholder="e.g., Orange County" />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          rules={[{ required: true, message: 'Please enter the state' }]}
        >
          <Input placeholder="e.g., FL" maxLength={2} />
        </Form.Item>

        <Form.Item
          name="countyCode"
          label="County Code"
          rules={[{ required: true, message: 'Please enter the county code' }]}
        >
          <Input placeholder="e.g., ORA" />
        </Form.Item>

        <Form.Item
          name="websiteUrl"
          label="County Website"
          rules={[
            { 
              type: 'url', 
              message: 'Please enter a valid URL' 
            }
          ]}
        >
          <Input placeholder="https://www.county-website.gov" />
        </Form.Item>

        <Form.Item
          name="taxCollectorUrl"
          label="Tax Collector Website"
          rules={[
            { 
              type: 'url', 
              message: 'Please enter a valid URL' 
            }
          ]}
        >
          <Input placeholder="https://taxcollector.county-website.gov" />
        </Form.Item>

        <Form.Item
          name="propertyAppraiserUrl"
          label="Property Appraiser Website"
          rules={[
            { 
              type: 'url', 
              message: 'Please enter a valid URL' 
            }
          ]}
        >
          <Input placeholder="https://appraiser.county-website.gov" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea 
            rows={4}
            placeholder="Brief description of the county" 
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[
              { 
                type: 'number', 
                min: -90, 
                max: 90, 
                message: 'Latitude must be between -90 and 90' 
              }
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber 
              placeholder="e.g., 28.5383" 
              style={{ width: '100%' }}
              step={0.000001}
              precision={6}
            />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              { 
                type: 'number', 
                min: -180, 
                max: 180, 
                message: 'Longitude must be between -180 and 180' 
              }
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber 
              placeholder="e.g., -81.3792" 
              style={{ width: '100%' }}
              step={0.000001}
              precision={6}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CountyFormModal; 