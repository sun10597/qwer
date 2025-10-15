import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Upload,
  Settings,
  Crown,
  Trash2,
  Save,
  Camera,
  Globe,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Video,
  Zap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../App';

export const SettingsPage = () => {
  const { user } = useAuth();
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Video creator and AI enthusiast',
    company: 'Creative Studios',
    website: 'https://example.com',
    timezone: 'UTC-8'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    projectUpdates: true,
    processingComplete: true,
    marketingEmails: false,
    pushNotifications: true,
    desktopNotifications: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    autoSave: true,
    defaultQuality: '1080p',
    defaultFormat: 'mp4',
    previewVolume: 80,
    keyboardShortcuts: true
  });

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    autoTranscription: true,
    smartSuggestions: true,
    voiceEnhancement: true,
    autoStoryline: false,
    processingPriority: 'balanced'
  });

  const handleSaveProfile = () => {
    // Mock save functionality
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    alert('Notification preferences saved!');
  };

  const handleSavePreferences = () => {
    alert('Preferences updated!');
  };

  const handleSaveAISettings = () => {
    alert('AI settings updated!');
  };

  const subscriptionPlan = {
    name: 'Pro Plan',
    price: '$29/month',
    features: ['Unlimited videos', 'Premium templates', 'Advanced AI features', 'Priority processing'],
    nextBilling: '2024-02-15'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">AI Settings</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="bg-input-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="bg-input-background"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of your video projects and analytics
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailDigest: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when collaborators make changes to shared projects
                    </p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Processing Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification when AI processing of your videos is finished
                    </p>
                  </div>
                  <Switch
                    checked={notifications.processingComplete}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, processingComplete: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Product updates, tips, and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Browser notifications for real-time updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      System notifications on your desktop
                    </p>
                  </div>
                  <Switch
                    checked={notifications.desktopNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, desktopNotifications: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your editing experience and default settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="w-4 h-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Video Quality</Label>
                  <Select value={preferences.defaultQuality} onValueChange={(value) => setPreferences({ ...preferences, defaultQuality: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="1440p">1440p (2K)</SelectItem>
                      <SelectItem value="2160p">2160p (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Format</Label>
                  <Select value={preferences.defaultFormat} onValueChange={(value) => setPreferences({ ...preferences, defaultFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save project changes every 2 minutes
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Keyboard Shortcuts</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable keyboard shortcuts in the video editor
                    </p>
                  </div>
                  <Switch
                    checked={preferences.keyboardShortcuts}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, keyboardShortcuts: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preview Volume</Label>
                  <div className="flex items-center space-x-4">
                    <Volume2 className="w-4 h-4" />
                    <div className="flex-1">
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={preferences.previewVolume}
                        onChange={(e) => setPreferences({ ...preferences, previewVolume: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm w-12">{preferences.previewVolume}%</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePreferences}>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Features & Settings
              </CardTitle>
              <CardDescription>
                Configure AI-powered features and processing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Transcription</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically convert speech to text when uploading videos
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.autoTranscription}
                    onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoTranscription: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Smart Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get AI-powered editing suggestions and improvements
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.smartSuggestions}
                    onCheckedChange={(checked) => setAiSettings({ ...aiSettings, smartSuggestions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Voice Enhancement</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically enhance audio quality and reduce noise
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.voiceEnhancement}
                    onCheckedChange={(checked) => setAiSettings({ ...aiSettings, voiceEnhancement: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Storyline Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate storylines and scene suggestions automatically
                    </p>
                  </div>
                  <Switch
                    checked={aiSettings.autoStoryline}
                    onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoStoryline: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Processing Priority</Label>
                <Select value={aiSettings.processingPriority} onValueChange={(value) => setAiSettings({ ...aiSettings, processingPriority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast (Lower quality)</SelectItem>
                    <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                    <SelectItem value="quality">Quality (Slower processing)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose between processing speed and output quality
                </p>
              </div>

              <Button onClick={handleSaveAISettings}>
                <Save className="w-4 h-4 mr-2" />
                Save AI Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{subscriptionPlan.name}</h3>
                    <p className="text-muted-foreground">{subscriptionPlan.price}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-1">
                  {subscriptionPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Next billing date</span>
                  <span className="font-medium">{subscriptionPlan.nextBilling}</span>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline">
                    Update Payment Method
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Cancel Subscription</h5>
                      <p className="text-sm text-muted-foreground">
                        Cancel your subscription at any time. You'll retain access until the end of your billing period.
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};