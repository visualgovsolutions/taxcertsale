import React from 'react';
import { Alert, Card, Table, Tag, Space, Typography, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FieldMappingValidationResponse, FieldMappingResult } from '../../../../api/importExportApi';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

export interface FieldMappingValidationProps {
  validationResults: FieldMappingValidationResponse | null;
  loading: boolean;
}

interface ValidationTableDataType {
  key: string;
  sourceField: string;
  targetField: string;
  valid: boolean;
  sampleValues?: string[];
  issues?: string[];
  recommendations?: string[];
}

const FieldMappingValidation: React.FC<FieldMappingValidationProps> = ({ 
  validationResults, 
  loading 
}) => {
  if (loading) {
    return <Card loading title="Validation Results" />;
  }

  if (!validationResults) {
    return null;
  }

  // Destructure properties correctly from the response type
  const { valid, fieldResults = [], sampleData = [], errorMessage } = validationResults;

  if (errorMessage) {
    return (
      <Alert
        message="Validation Error"
        description={errorMessage}
        type="error"
        showIcon
      />
    );
  }

  // Define columns for the validation results table with explicit types
  const columns: ColumnsType<ValidationTableDataType> = [
    {
      title: 'Source Field',
      dataIndex: 'sourceField',
      key: 'sourceField',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Target Field',
      dataIndex: 'targetField',
      key: 'targetField',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'valid',
      key: 'status',
      render: (isValid: boolean) => {
        if (isValid) {
          return (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Valid
            </Tag>
          );
        } else {
          return (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              Invalid
            </Tag>
          );
        }
      },
    },
    {
      title: 'Sample Values',
      dataIndex: 'sampleValues',
      key: 'sampleValues',
      render: (sampleValues?: string[]) => {
        if (!sampleValues || sampleValues.length === 0) {
          return <Text type="secondary">No sample data</Text>;
        }

        return (
          <Space direction="vertical" size="small">
            {sampleValues.slice(0, 3).map((value: string, index: number) => (
              <Text key={index} ellipsis={{ tooltip: value }}>
                {value || <Text type="secondary">(empty)</Text>}
              </Text>
            ))}
            {sampleValues.length > 3 && (
              <Text type="secondary">+{sampleValues.length - 3} more</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Issues',
      dataIndex: 'issues',
      key: 'issues',
      render: (issues?: string[]) => {
        if (!issues || issues.length === 0) {
          return null;
        }

        return (
          <Space direction="vertical" size="small">
            {issues.map((issue: string, index: number) => (
              <Tag 
                key={index} 
                color="warning" 
                icon={<WarningOutlined />}
              >
                {issue}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Recommendations',
      dataIndex: 'recommendations',
      key: 'recommendations',
      render: (recommendations?: string[]) => {
        if (!recommendations || recommendations.length === 0) {
          return null;
        }

        return (
          <Space direction="vertical" size="small">
            {recommendations.map((rec: string, index: number) => (
              <Tag 
                key={index} 
                color="processing" 
                icon={<InfoCircleOutlined />}
              >
                {rec}
              </Tag>
            ))}
          </Space>
        );
      },
    },
  ];

  // Prepare data for the validation results table with explicit types
  const data: ValidationTableDataType[] = fieldResults.map((result: FieldMappingResult, index: number): ValidationTableDataType => ({
    key: index.toString(),
    sourceField: result.sourceField,
    targetField: result.targetField,
    valid: result.valid,
    sampleValues: result.sampleValues,
    issues: result.issues,
    recommendations: result.recommendations,
  }));

  const invalidFields = fieldResults.filter((field: FieldMappingResult) => !field.valid).length;
  const alertType = valid ? 'success' : 'warning';
  const alertMessage = valid 
    ? 'Field mapping is valid' 
    : `Field mapping has ${invalidFields} invalid field${invalidFields !== 1 ? 's' : ''}`;

  return (
    <Card title="Validation Results" className="validation-results-card">
      <Alert
        message={alertMessage}
        type={alertType}
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Table<ValidationTableDataType>
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
      />

      {sampleData && sampleData.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Typography.Title level={5}>Sample Data Preview</Typography.Title>
          <Alert
            message={`Showing ${sampleData.length} sample rows from your import file`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <div className="sample-data-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="sample-data-table" style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              border: '1px solid #f0f0f0'
            }}>
              <thead>
                <tr>
                  {Object.keys(sampleData[0]).map((key: string) => (
                    <th key={key} style={{ 
                      padding: '8px 16px',
                      backgroundColor: '#fafafa',
                      borderBottom: '1px solid #f0f0f0',
                      textAlign: 'left'
                    }}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row: Record<string, any>, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell: any, cellIndex: number) => (
                      <td 
                        key={cellIndex}
                        style={{ 
                          padding: '8px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Tooltip title={String(cell)}>
                          {cell ? String(cell) : <Text type="secondary">(empty)</Text>}
                        </Tooltip>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FieldMappingValidation; 