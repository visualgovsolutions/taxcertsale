import React from 'react';
import { Card, Button, Label, TextInput, Select } from 'flowbite-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="mb-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Account Settings
          </h5>
          
          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@example.com"
                defaultValue="admin@taxcertsale.com"
                required
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Full Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="John Smith"
                defaultValue="Administrator"
                required
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" value="Role" />
              </div>
              <Select id="role" required>
                <option value="admin">Administrator</option>
                <option value="manager">Manager</option>
                <option value="user">Regular User</option>
              </Select>
            </div>
            
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>
        
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h5>
          
          <form className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                id="email_notifications"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="email_notifications">
                Email Notifications
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="sms_notifications"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="sms_notifications">
                SMS Notifications
              </Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="browser_notifications"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="browser_notifications">
                Browser Notifications
              </Label>
            </div>
            
            <Button type="submit">Save Preferences</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 