import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { 
  Breadcrumb, 
  Button, 
  Card, 
  Tabs, 
  message, 
  Tooltip, 
  Space,
  Typography,
  Modal
} from 'antd';
import { PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CountyListTable from '../../components/admin/county/CountyListTable';
import CountyPerformanceMetrics from '../../components/admin/county/CountyPerformanceMetrics';
import CountyConfigSettings from '../../components/admin/county/CountyConfigSettings';
import PageHeader from '../../components/common/PageHeader';

const { Title } = Typography;
const { TabPane } = Tabs;

// GraphQL query to fetch all counties
const GET_COUNTIES = gql`
  query GetCounties($search: String) {
    counties(search: $search) {
      id
      name
      state
      code
      status
      createdAt
      updatedAt
      activeAuctions
      totalCertificates
      adminEmail
      adminPhone
    }
  }
`;

const CountyManagementPage: React.FC = () => {
  const [selectedCountyId, setSelectedCountyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCountyModalVisible, setIsAddCountyModalVisible] = useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);

  // Fetch counties
  const { loading, error, data, refetch } = useQuery(GET_COUNTIES, {
    variables: { search: searchTerm },
    fetchPolicy: 'cache-and-network'
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRefresh = () => {
    refetch();
    message.success('County list refreshed');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleCountySelect = (countyId: string) => {
    setSelectedCountyId(countyId);
    setActiveTab('metrics');
  };

  const handleAddCounty = () => {
    setIsAddCountyModalVisible(true);
  };

  const handleConfigureCounty = (countyId: string) => {
    setSelectedCountyId(countyId);
    setIsConfigModalVisible(true);
  };

  const handleViewCountyDetails = (countyId: string) => {
    setSelectedCountyId(countyId);
    setActiveTab('details');
  };

  return (
    <div className="county-management-page">
      <PageHeader 
        title="County Management" 
        subtitle="Manage counties, view metrics, and configure settings"
      />
      
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>County Management</Breadcrumb.Item>
      </Breadcrumb>

      <div className="page-actions" style={{ marginBottom: 16 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddCounty}
          >
            Add County
          </Button>
          <Tooltip title="Refresh Data">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            />
          </Tooltip>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="County List" key="list">
          <Card>
            <CountyListTable 
              counties={data?.counties || []} 
              loading={loading} 
              error={error} 
              onSearch={handleSearch}
              onViewDetails={handleViewCountyDetails}
              onConfigure={handleConfigureCounty}
              onSelectForMetrics={handleCountySelect}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Performance Metrics" key="metrics" disabled={!selectedCountyId}>
          {selectedCountyId && (
            <CountyPerformanceMetrics countyId={selectedCountyId} />
          )}
        </TabPane>
        
        <TabPane tab="County Details" key="details" disabled={!selectedCountyId}>
          {selectedCountyId && (
            <Card title="County Details">
              <p>Detailed information about the selected county would be displayed here.</p>
              <p>This could include contact information, geographic data, and historical performance.</p>
              
              <Button 
                icon={<SettingOutlined />} 
                onClick={() => handleConfigureCounty(selectedCountyId)}
                style={{ marginTop: 16 }}
              >
                Configure Settings
              </Button>
            </Card>
          )}
        </TabPane>
      </Tabs>

      {/* Add County Modal would be implemented here */}
      <Modal
        title="Add New County"
        open={isAddCountyModalVisible}
        onCancel={() => setIsAddCountyModalVisible(false)}
        footer={null}
        width={700}
      >
        <p>Form to add a new county would go here.</p>
      </Modal>

      {/* County Configuration Modal */}
      <Modal
        title="County Configuration"
        open={isConfigModalVisible && !!selectedCountyId}
        onCancel={() => setIsConfigModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCountyId && (
          <CountyConfigSettings countyId={selectedCountyId} />
        )}
      </Modal>
    </div>
  );
};

export default CountyManagementPage; 