import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Table, message, Card, Spin, Tooltip, Space, Popconfirm } from 'antd';
import { SaveOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_FEE_STRUCTURE = gql`
  query GetFeeStructure {
    feeStructure {
      id
      certificateFees {
        id
        name
        description
        type
        value
        isPercentage
        minAmount
        maxAmount
        active
      }
      interestRateLimits {
        minRate
        maxRate
        defaultRate
      }
      platformFees {
        id
        name
        description
        value
        isPercentage
        minAmount
        maxAmount
        applicableUserRoles
        active
      }
    }
  }
`;

const UPDATE_CERTIFICATE_FEE = gql`
  mutation UpdateCertificateFee($id: ID!, $input: CertificateFeeInput!) {
    updateCertificateFee(id: $id, input: $input) {
      id
      name
      value
      active
    }
  }
`;

const ADD_CERTIFICATE_FEE = gql`
  mutation AddCertificateFee($input: CertificateFeeInput!) {
    addCertificateFee(input: $input) {
      id
      name
      value
      active
    }
  }
`;

const DELETE_CERTIFICATE_FEE = gql`
  mutation DeleteCertificateFee($id: ID!) {
    deleteCertificateFee(id: $id) {
      id
    }
  }
`;

const UPDATE_INTEREST_RATE_LIMITS = gql`
  mutation UpdateInterestRateLimits($input: InterestRateLimitsInput!) {
    updateInterestRateLimits(input: $input) {
      minRate
      maxRate
      defaultRate
    }
  }
`;

const UPDATE_PLATFORM_FEE = gql`
  mutation UpdatePlatformFee($id: ID!, $input: PlatformFeeInput!) {
    updatePlatformFee(id: $id, input: $input) {
      id
      name
      value
      active
    }
  }
`;

const FeeStructureSettings: React.FC = () => {
  const [interestRateForm] = Form.useForm();
  const [certificateFeeForm] = Form.useForm();
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [feeModalVisible, setFeeModalVisible] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_FEE_STRUCTURE);
  const [updateCertificateFee] = useMutation(UPDATE_CERTIFICATE_FEE);
  const [addCertificateFee] = useMutation(ADD_CERTIFICATE_FEE);
  const [deleteCertificateFee] = useMutation(DELETE_CERTIFICATE_FEE);
  const [updateInterestRateLimits] = useMutation(UPDATE_INTEREST_RATE_LIMITS);
  const [updatePlatformFee] = useMutation(UPDATE_PLATFORM_FEE);

  useEffect(() => {
    if (data?.feeStructure?.interestRateLimits) {
      interestRateForm.setFieldsValue(data.feeStructure.interestRateLimits);
    }
  }, [data, interestRateForm]);

  const updateInterestRates = async (values: any) => {
    try {
      await updateInterestRateLimits({
        variables: {
          input: values
        }
      });
      message.success('Interest rate limits updated successfully');
    } catch (error) {
      message.error('Failed to update interest rate limits');
      console.error('Error:', error);
    }
  };

  const handleEditFee = (record: any) => {
    setEditingFeeId(record.id);
    certificateFeeForm.setFieldsValue(record);
    setFeeModalVisible(true);
  };

  const handleDeleteFee = async (id: string) => {
    try {
      await deleteCertificateFee({
        variables: { id }
      });
      message.success('Fee deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete fee');
      console.error('Error:', error);
    }
  };

  const certificateFeeColumns = [
    {
      title: 'Fee Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Value',
      key: 'value',
      render: (text: string, record: any) => (
        <span>
          {record.value}{record.isPercentage ? '%' : ' USD'}
        </span>
      ),
    },
    {
      title: 'Min/Max',
      key: 'minMax',
      render: (text: string, record: any) => (
        <span>
          {record.minAmount && `$${record.minAmount}`}
          {record.minAmount && record.maxAmount ? ' - ' : ''}
          {record.maxAmount && `$${record.maxAmount}`}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: string, record: any) => (
        <span>{record.active ? 'Active' : 'Inactive'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: any) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditFee(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this fee?"
              onConfirm={() => handleDeleteFee(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error loading fee structure: {error.message}</div>;

  return (
    <div className="fee-structure-settings">
      <Card title="Interest Rate Limits" className="settings-card">
        <Form
          form={interestRateForm}
          layout="vertical"
          onFinish={updateInterestRates}
          initialValues={data?.feeStructure?.interestRateLimits}
        >
          <div className="interest-rates-form">
            <Form.Item
              name="minRate"
              label="Minimum Interest Rate (%)"
              rules={[{ required: true, message: 'Minimum rate is required' }]}
            >
              <InputNumber min={0} max={100} step={0.01} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="maxRate"
              label="Maximum Interest Rate (%)"
              rules={[{ required: true, message: 'Maximum rate is required' }]}
            >
              <InputNumber min={0} max={100} step={0.01} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="defaultRate"
              label="Default Interest Rate (%)"
              rules={[{ required: true, message: 'Default rate is required' }]}
            >
              <InputNumber min={0} max={100} step={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              Save Interest Rate Limits
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card 
        title="Certificate Fees" 
        className="settings-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingFeeId(null);
              certificateFeeForm.resetFields();
              setFeeModalVisible(true);
            }}
          >
            Add New Fee
          </Button>
        }
      >
        <Table
          dataSource={data?.feeStructure?.certificateFees || []}
          columns={certificateFeeColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="Platform Fees" className="settings-card">
        <Table
          dataSource={data?.feeStructure?.platformFees || []}
          columns={[
            ...certificateFeeColumns.filter(col => col.key !== 'actions'),
            {
              title: 'Applicable Roles',
              dataIndex: 'applicableUserRoles',
              key: 'applicableUserRoles',
              render: (roles: string[]) => roles?.join(', ') || 'All Roles'
            },
            certificateFeeColumns.find(col => col.key === 'actions'),
          ]}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default FeeStructureSettings; 