import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Lock, Globe, CreditCard, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: 'TezHealth',
    platformFee: 29,
    gstRate: 18,
    commissionRate: 15,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    autoApproveNurses: false,
    maxBookingDistance: 50,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <AppHeader title="Platform Settings" showMenu />
      <div className="p-4 md:p-6 space-y-6 max-w-4xl">
        {/* Success Message */}
        {saved && (
          <motion.div
            className="bg-success/10 border border-success/30 rounded-card p-4 text-success text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ Settings saved successfully
          </motion.div>
        )}

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <Input
                  value={settings.platformName}
                  onChange={(e) => handleChange('platformName', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Max Booking Distance (km)</label>
                <Input
                  type="number"
                  value={settings.maxBookingDistance}
                  onChange={(e) => handleChange('maxBookingDistance', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium text-sm">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Disable user access temporarily</p>
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(v) => handleChange('maintenanceMode', v)}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-4">
            <Card className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Fee (₹)</label>
                <Input
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => handleChange('platformFee', parseInt(e.target.value))}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Charged per booking</p>
              </div>

              <div>
                <label className="text-sm font-medium">GST Rate (%)</label>
                <Input
                  type="number"
                  value={settings.gstRate}
                  onChange={(e) => handleChange('gstRate', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nurse Commission Rate (%)</label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => handleChange('commissionRate', parseInt(e.target.value))}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Percentage deducted from nurse earnings</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Example Calculation:</p>
                <p className="text-xs text-muted-foreground">
                  Booking: ₹500 + Platform Fee: ₹{settings.platformFee} = ₹{500 + settings.platformFee}
                  <br />
                  GST ({settings.gstRate}%): ₹{Math.round((500 + settings.platformFee) * settings.gstRate / 100)}
                  <br />
                  Nurse Commission ({settings.commissionRate}%): ₹{Math.round(500 * settings.commissionRate / 100)}
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Send alerts via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => handleChange('emailNotifications', v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="font-medium text-sm">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Send alerts via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(v) => handleChange('smsNotifications', v)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium text-sm">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Send in-app alerts</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(v) => handleChange('pushNotifications', v)}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-danger" />
                  <div>
                    <p className="font-medium text-sm">Auto-Approve Nurses</p>
                    <p className="text-xs text-muted-foreground">Automatically approve new nurse registrations</p>
                  </div>
                </div>
                <Switch
                  checked={settings.autoApproveNurses}
                  onCheckedChange={(v) => handleChange('autoApproveNurses', v)}
                />
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm mb-3">Danger Zone</p>
                <Button variant="destructive" className="w-full">
                  Clear All Cache
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
