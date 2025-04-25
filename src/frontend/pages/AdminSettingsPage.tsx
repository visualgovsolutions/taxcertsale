import React, { useState } from 'react';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving settings
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">
          Configure system settings and global options
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium">
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 rounded-t-lg ${
                activeTab === 'system' 
                  ? 'text-blue-600 border-b-2 border-blue-600 active' 
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('system')}
            >
              System
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 rounded-t-lg ${
                activeTab === 'security' 
                  ? 'text-blue-600 border-b-2 border-blue-600 active' 
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 rounded-t-lg ${
                activeTab === 'notifications' 
                  ? 'text-blue-600 border-b-2 border-blue-600 active' 
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-3 px-4 rounded-t-lg ${
                activeTab === 'ui' 
                  ? 'text-blue-600 border-b-2 border-blue-600 active' 
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('ui')}
            >
              User Interface
            </button>
          </li>
        </ul>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {saveStatus && (
          <div className={`mb-4 p-3 rounded-md ${saveStatus.includes('success') ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
            {saveStatus}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* System Settings */}
          {activeTab === 'system' && (
            <div>
              <h2 className="text-xl font-medium mb-4">System Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">System Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="Tax Certificate Sale Management System"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Default County</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>All Counties</option>
                  <option>Miami-Dade</option>
                  <option>Broward</option>
                  <option>Palm Beach</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Data Retention (days)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="365"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Base URL</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="https://taxcertsale.example.com"
                />
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-medium mb-4">Security Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password Policy</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Standard (8+ chars, 1 uppercase, 1 number)</option>
                  <option>Strong (12+ chars, special chars required)</option>
                  <option>Very Strong (16+ chars, all character types)</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="30"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Enable Two-Factor Authentication
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Force Password Reset Every 90 Days
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-medium mb-4">Notification Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email Service</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>SMTP</option>
                  <option>SendGrid</option>
                  <option>Amazon SES</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">SMTP Server</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="smtp.example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">From Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue="notifications@taxcertsale.example.com"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Send New Auction Notifications
                </label>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Send Registration Confirmations
                </label>
              </div>
            </div>
          )}

          {/* UI Settings */}
          {activeTab === 'ui' && (
            <div>
              <h2 className="text-xl font-medium mb-4">User Interface Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Theme</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Default</option>
                  <option>Dark Mode</option>
                  <option>High Contrast</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Items Per Page</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date Format</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-gray-700">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Show Welcome Message
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage; 