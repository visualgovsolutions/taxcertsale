import React from 'react';
import { Tabs, Card, Breadcrumb } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import FeeStructureSettings from '../../components/admin/settings/FeeStructureSettings';
import NotificationSettings from '../../components/admin/settings/NotificationSettings';
import SecuritySettings from '../../components/admin/settings/SecuritySettings';

const { TabPane } = Tabs;

const SystemSettingsPage: React.FC = () => {
  return (
    <div className="system-settings-page">
      <div className="page-header">
        <h1>System Settings</h1>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">
              <HomeOutlined /> Dashboard
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <SettingOutlined /> System Settings
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card className="settings-container">
        <Tabs defaultActiveKey="general" tabPosition="left">
          <TabPane tab="General" key="general">
            <GeneralSettings />
          </TabPane>
          <TabPane tab="Fee Structure" key="fee-structure">
            <FeeStructureSettings />
          </TabPane>
          <TabPane tab="Notifications" key="notifications">
            <NotificationSettings />
          </TabPane>
          <TabPane tab="Security" key="security">
            <SecuritySettings />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemSettingsPage; 