'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { useNotifications } from '@/contexts/notification-context';
import { useAuth } from '@/contexts/auth-context';
import { 
  User,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAlert, setShowAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    bio: user?.bio || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 relative">
        <GlowingEffect
          blur={20}
          disabled={false}
          glow
          className="absolute inset-0"
          variant="white"
          spread={80}
        />
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg backdrop-blur-sm relative flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-orange-500/90 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative">
          <div className="absolute inset-0">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
          </div>
          <div className="relative z-10 rounded-xl bg-gray-800/40 backdrop-blur-sm p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Bio</label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Bell className="text-orange-500" />
                      <div>
                        <h3 className="text-white font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications on your device</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChange('notificationsEnabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.notificationsEnabled ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-orange-500" />
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChange('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.emailNotifications ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-orange-500" />
                      <div>
                        <h3 className="text-white font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-400">Receive updates via SMS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleChange('smsNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.smsNotifications ? 'bg-orange-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Billing Information</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-700/50">
                    <h3 className="text-white font-medium mb-2">Current Plan</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-500 font-semibold">Pro Plan</p>
                        <p className="text-sm text-gray-400">Billed monthly</p>
                      </div>
                      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-700/50">
                    <h3 className="text-white font-medium mb-2">Payment Method</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="text-orange-500" />
                        <div>
                          <p className="text-white">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-400">Expires 12/24</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          onClick={async () => {
            try {
              setIsSaving(true);
              
              // Save changes
              await updateUserProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phoneNumber,
                bio: formData.bio
              });
              
              // Show saving notification
              addNotification(
                'Settings Updated',
                'Your settings have been successfully saved.'
              );

              // Show alert
              setShowAlert(true);
            } catch (error) {
              console.error('Error saving settings:', error);
              addNotification(
                'Error',
                'Failed to save settings. Please try again.',
                'error'
              );
            } finally {
              setIsSaving(false);
            }
          }}
        >
          Save Changes
        </motion.button>
      </div>

      {/* Alert */}
      <Alert
        type="success"
        title="Settings Saved"
        message="Your settings have been successfully updated"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        duration={3000}
      />
    </DashboardLayout>
  );
}
