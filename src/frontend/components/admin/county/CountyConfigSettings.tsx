import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Select, 
  Button, 
  Tabs,
  Divider,
  message,
  Typography,
  Space,
  Tooltip,
  Row,
  Col
} from 'antd';
import { InfoCircleOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useMutation, gql } from '@apollo/client';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Define GraphQL mutations for updating county configuration
export const UPDATE_COUNTY_CONFIG = gql`
  mutation UpdateCountyConfig($countyId: ID!, $config: CountyConfigInput!) {
    updateCountyConfig(countyId: $countyId, config: $config) {
      id
      name
      config {
        interestRate
        redemptionPeriod
        bidIncrement
        minimumBidAmount
        adminFeePercentage
        processingFeeAmount
        notificationSettings {
          auctionStartReminder
          auctionEndReminder
          bidReceivedAlert
          certificateIssuedNotification
          redemptionNotification
        }
        displaySettings {
          showPropertyImages
          showOwnerInfo
          showBidHistory
          showBidderIdentities
          highlightPremiumProperties
        }
        feeSettings {
          adminFeePercentage
          processingFeeAmount
          lateFeeAmount
          lateFeeGracePeriod
        }
        auctionSettings {
          defaultAuctionDuration
          extendTimeOnLateBid
          extendTime
          allowAutoBidding
          allowProxyBidding
          allowReservePrices
        }
      }
    }
  }
`;

// County Config interface
interface CountyConfig {
  interestRate: number;
  redemptionPeriod: number;
  bidIncrement: number;
  minimumBidAmount: number;
  adminFeePercentage: number;
  processingFeeAmount: number;
  notificationSettings: {
    auctionStartReminder: boolean;
    auctionEndReminder: boolean;
    bidReceivedAlert: boolean;
    certificateIssuedNotification: boolean;
    redemptionNotification: boolean;
  };
  displaySettings: {
    showPropertyImages: boolean;
    showOwnerInfo: boolean;
    showBidHistory: boolean;
    showBidderIdentities: boolean;
    highlightPremiumProperties: boolean;
  };
  feeSettings: {
    adminFeePercentage: number;
    processingFeeAmount: number;
    lateFeeAmount: number;
    lateFeeGracePeriod: number;
  };
  auctionSettings: {
    defaultAuctionDuration: number;
    extendTimeOnLateBid: boolean;
    extendTime: number;
    allowAutoBidding: boolean;
    allowProxyBidding: boolean;
    allowReservePrices: boolean;
  };
}

interface CountyConfigSettingsProps {
  countyId: string;
  initialConfig?: CountyConfig;
  onConfigUpdated?: (config: CountyConfig) => void;
}

const CountyConfigSettings: React.FC<CountyConfigSettingsProps> = ({ 
  countyId, 
  initialConfig,
  onConfigUpdated
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Use mutation to update county config
  const [updateCountyConfig, { loading: updating }] = useMutation(UPDATE_COUNTY_CONFIG, {
    onCompleted: (data) => {
      message.success('County configuration updated successfully');
      setIsDirty(false);
      if (onConfigUpdated) {
        onConfigUpdated(data.updateCountyConfig.config);
      }
    },
    onError: (error) => {
      message.error(`Failed to update county configuration: ${error.message}`);
    }
  });

  // Initialize form with default values or provided config
  const getInitialValues = () => {
    return initialConfig || {
      interestRate: 5.0,
      redemptionPeriod: 12,
      bidIncrement: 100,
      minimumBidAmount: 1000,
      adminFeePercentage: 2.5,
      processingFeeAmount: 50,
      notificationSettings: {
        auctionStartReminder: true,
        auctionEndReminder: true,
        bidReceivedAlert: true,
        certificateIssuedNotification: true,
        redemptionNotification: true
      },
      displaySettings: {
        showPropertyImages: true,
        showOwnerInfo: true,
        showBidHistory: true,
        showBidderIdentities: false,
        highlightPremiumProperties: true
      },
      feeSettings: {
        adminFeePercentage: 2.5,
        processingFeeAmount: 50,
        lateFeeAmount: 25,
        lateFeeGracePeriod: 7
      },
      auctionSettings: {
        defaultAuctionDuration: 7,
        extendTimeOnLateBid: true,
        extendTime: 15,
        allowAutoBidding: true,
        allowProxyBidding: true,
        allowReservePrices: false
      }
    };
  };

  // Handle form submission
  const handleSubmit = (values: CountyConfig) => {
    updateCountyConfig({
      variables: {
        countyId,
        config: values
      }
    });
  };

  // Handle form reset
  const handleReset = () => {
    form.resetFields();
    setIsDirty(false);
  };

  // Handle form value changes
  const handleFormChange = () => {
    setIsDirty(true);
  };

  return (
    <Card className="county-config-settings">
      <div className="config-header">
        <Title level={4}>County Configuration Settings</Title>
        <Text type="secondary">
          Configure settings specific to this county's tax certificate sales
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={getInitialValues()}
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="General Settings" key="general">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="interestRate"
                  label="Interest Rate (%)"
                  tooltip="Annual interest rate for tax certificates"
                  rules={[{ required: true, message: 'Please enter interest rate' }]}
                >
                  <InputNumber
                    min={0}
                    max={25}
                    step={0.1}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `${value}%`}
                    parser={(value: string) => parseFloat(value.replace('%', ''))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="redemptionPeriod"
                  label="Redemption Period (months)"
                  tooltip="Time period property owners have to redeem their certificates"
                  rules={[{ required: true, message: 'Please enter redemption period' }]}
                >
                  <InputNumber
                    min={1}
                    max={60}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `${value} months`}
                    parser={(value: string) => parseInt(value.replace(' months', ''))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="bidIncrement"
                  label="Bid Increment ($)"
                  tooltip="Minimum amount bids must increase by"
                  rules={[{ required: true, message: 'Please enter bid increment' }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `$${value}`}
                    parser={(value: string) => parseFloat(value.replace('$', ''))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="minimumBidAmount"
                  label="Minimum Bid Amount ($)"
                  tooltip="Minimum starting bid for certificates"
                  rules={[{ required: true, message: 'Please enter minimum bid amount' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `$${value}`}
                    parser={(value: string) => parseFloat(value.replace('$', ''))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Fee Settings" key="fees">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['feeSettings', 'adminFeePercentage']}
                  label="Admin Fee Percentage (%)"
                  tooltip="Percentage fee charged for administration"
                  rules={[{ required: true, message: 'Please enter admin fee percentage' }]}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.1}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `${value}%`}
                    parser={(value: string) => parseFloat(value.replace('%', ''))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['feeSettings', 'processingFeeAmount']}
                  label="Processing Fee Amount ($)"
                  tooltip="Flat fee charged for processing certificates"
                  rules={[{ required: true, message: 'Please enter processing fee amount' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `$${value}`}
                    parser={(value: string) => parseFloat(value.replace('$', ''))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['feeSettings', 'lateFeeAmount']}
                  label="Late Fee Amount ($)"
                  tooltip="Fee charged for late payments"
                  rules={[{ required: true, message: 'Please enter late fee amount' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `$${value}`}
                    parser={(value: string) => parseFloat(value.replace('$', ''))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['feeSettings', 'lateFeeGracePeriod']}
                  label="Late Fee Grace Period (days)"
                  tooltip="Days before late fees are applied"
                  rules={[{ required: true, message: 'Please enter grace period' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `${value} days`}
                    parser={(value: string) => parseInt(value.replace(' days', ''))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Notification Settings" key="notifications">
            <Form.Item
              name={['notificationSettings', 'auctionStartReminder']}
              label="Auction Start Reminder"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['notificationSettings', 'auctionEndReminder']}
              label="Auction End Reminder"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['notificationSettings', 'bidReceivedAlert']}
              label="Bid Received Alert"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['notificationSettings', 'certificateIssuedNotification']}
              label="Certificate Issued Notification"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['notificationSettings', 'redemptionNotification']}
              label="Redemption Notification"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Display Settings" key="display">
            <Form.Item
              name={['displaySettings', 'showPropertyImages']}
              label="Show Property Images"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['displaySettings', 'showOwnerInfo']}
              label="Show Owner Information"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['displaySettings', 'showBidHistory']}
              label="Show Bid History"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['displaySettings', 'showBidderIdentities']}
              label="Show Bidder Identities"
              valuePropName="checked"
              tooltip="If enabled, bidder names will be visible in bid history"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name={['displaySettings', 'highlightPremiumProperties']}
              label="Highlight Premium Properties"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Auction Settings" key="auction">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['auctionSettings', 'defaultAuctionDuration']}
                  label="Default Auction Duration (days)"
                  rules={[{ required: true, message: 'Please enter default auction duration' }]}
                >
                  <InputNumber
                    min={1}
                    max={30}
                    style={{ width: '100%' }}
                    formatter={(value: number) => `${value} days`}
                    parser={(value: string) => parseInt(value.replace(' days', ''))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['auctionSettings', 'extendTimeOnLateBid']}
                  label="Extend Time on Late Bid"
                  valuePropName="checked"
                  tooltip="Extend auction time when bids are received near closing time"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.auctionSettings?.extendTimeOnLateBid !== currentValues.auctionSettings?.extendTimeOnLateBid
              }
            >
              {({ getFieldValue }) => 
                getFieldValue(['auctionSettings', 'extendTimeOnLateBid']) ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['auctionSettings', 'extendTime']}
                        label="Extend Time (minutes)"
                        tooltip="Minutes to extend auction when a late bid is received"
                        rules={[{ required: true, message: 'Please enter extend time' }]}
                      >
                        <InputNumber
                          min={1}
                          max={60}
                          style={{ width: '100%' }}
                          formatter={(value: number) => `${value} minutes`}
                          parser={(value: string) => parseInt(value.replace(' minutes', ''))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null
              }
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['auctionSettings', 'allowAutoBidding']}
                  label="Allow Auto Bidding"
                  valuePropName="checked"
                  tooltip="Allow bidders to set a maximum bid amount and auto-bid"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['auctionSettings', 'allowProxyBidding']}
                  label="Allow Proxy Bidding"
                  valuePropName="checked"
                  tooltip="Allow bidders to set proxy bidding rules"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['auctionSettings', 'allowReservePrices']}
                  label="Allow Reserve Prices"
                  valuePropName="checked"
                  tooltip="Allow setting minimum reserve prices for certificates"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updating}
              disabled={!isDirty}
            >
              Save Settings
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={handleReset}
              disabled={!isDirty}
            >
              Reset Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CountyConfigSettings; 