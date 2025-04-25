import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Tag, 
  Tooltip, 
  Space, 
  Dropdown, 
  Menu,
  Typography,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  SettingOutlined, 
  BarChartOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { ApolloError } from '@apollo/client';
import ErrorDisplay from '../common/ErrorDisplay';

const { Text } = Typography;
const { Search } = Input;

export interface County {
  id: string;
  name: string;
  state: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  activeAuctions?: number;
  totalCertificates?: number;
  adminEmail?: string;
  adminPhone?: string;
}

export interface CountyListTableProps {
  loading: boolean;
  error?: ApolloError;
  counties: County[];
  onSearch: (value: string) => void;
  onViewDetails: (countyId: string) => void;
  onConfigure: (countyId: string) => void;
  onSelectForMetrics: (countyId: string) => void;
}

const CountyListTable: React.FC<CountyListTableProps> = ({
  loading,
  error,
  counties,
  onSearch,
  onViewDetails,
  onConfigure,
  onSelectForMetrics
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const renderStatusTag = (status: County['status']) => {
    const statusConfig = {
      ACTIVE: { color: 'green', text: 'Active' },
      INACTIVE: { color: 'red', text: 'Inactive' },
      PENDING: { color: 'orange', text: 'Pending' }
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTableColumns = () => [
    {
      title: 'County Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: County, b: County) => a.name.localeCompare(b.name),
      render: (text: string, record: County) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">{record.code}</Text>
        </Space>
      )
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      sorter: (a: County, b: County) => a.state.localeCompare(b.state)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
        { text: 'Pending', value: 'PENDING' }
      ],
      onFilter: (value: string, record: County) => record.status === value,
      render: renderStatusTag
    },
    {
      title: 'Auctions',
      dataIndex: 'activeAuctions',
      key: 'activeAuctions',
      width: 120,
      sorter: (a: County, b: County) => (a.activeAuctions || 0) - (b.activeAuctions || 0),
      render: (value: number) => value || 0
    },
    {
      title: 'Certificates',
      dataIndex: 'totalCertificates',
      key: 'totalCertificates',
      width: 120,
      sorter: (a: County, b: County) => (a.totalCertificates || 0) - (b.totalCertificates || 0),
      render: (value: number) => value || 0
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a: County, b: County) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_: any, record: County) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record.id)}
            />
          </Tooltip>
          <Tooltip title="Configure">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => onConfigure(record.id)}
            />
          </Tooltip>
          <Tooltip title="View Metrics">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => onSelectForMetrics(record.id)}
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item 
                  key="edit" 
                  icon={<EditOutlined />}
                  onClick={() => onViewDetails(record.id)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item 
                  key="delete" 
                  icon={<DeleteOutlined />}
                  danger
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  if (error) {
    return <ErrorDisplay error={error} message="Error loading counties" />;
  }

  return (
    <div className="county-list-table">
      <div className="table-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search counties..."
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Space>
          <Badge count={counties.length} showZero>
            <Text>Total Counties</Text>
          </Badge>
        </Space>
      </div>

      <Table
        dataSource={counties}
        columns={getTableColumns()}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} counties`
        }}
        locale={{
          emptyText: searchValue ? 'No counties found matching your search' : 'No counties available'
        }}
      />
    </div>
  );
};

export default CountyListTable; 