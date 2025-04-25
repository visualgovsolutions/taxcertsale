import React, { useState } from 'react';
import { Card, Tabs, Button } from 'flowbite-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataImportWizard from '../../components/admin/import-export/DataImportWizard';
import DataExportTool from '../../components/admin/import-export/DataExportTool';
import ScheduledExportJobs from '../../components/admin/import-export/ScheduledExportJobs';

const DataImportExportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('import');

  return (
    <div className="data-import-export-page">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Data Import & Export Tools</h1>
        
        <Card>
          <Tabs.Group
            style="underline"
            onActiveTabChange={(tab) => setActiveTab(tab === 0 ? 'import' : tab === 1 ? 'export' : 'scheduled')}
          >
            <Tabs.Item active title="Data Import">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-3">Import Data</h2>
                <p className="mb-4">
                  Use the import wizard to upload and process data for various entity types. 
                  The system supports CSV, Excel, and JSON formats.
                </p>
                <DataImportWizard />
              </div>
            </Tabs.Item>
            
            <Tabs.Item title="Data Export">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-3">Export Data</h2>
                <p className="mb-4">
                  Export data in various formats for reporting, analysis, or backup purposes.
                </p>
                <DataExportTool />
              </div>
            </Tabs.Item>
            
            <Tabs.Item title="Scheduled Exports">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-3">Scheduled Export Jobs</h2>
                <p className="mb-4">
                  Configure automated export jobs to run on a schedule.
                </p>
                <ScheduledExportJobs />
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </Card>
      </div>
    </div>
  );
};

export default DataImportExportPage; 