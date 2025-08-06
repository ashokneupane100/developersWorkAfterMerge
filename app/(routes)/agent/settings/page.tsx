import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/agentui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/agentui/tabs"
import { User, Mail, Phone, MapPin, Camera, Bell, Shield, Eye, Save, Download, Trash2 } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 bg-white shadow-sm">
          <TabsTrigger value="profile" className="h-10">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="h-10">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="h-10">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Settings */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size 2MB</p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="John" 
                    className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Doe" 
                    className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="john.doe@example.com" 
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="phone" 
                    defaultValue="+977 9841234567" 
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="address" 
                    defaultValue="Kathmandu, Nepal" 
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself and your real estate experience..."
                  defaultValue="Experienced real estate agent with 5+ years in the Kathmandu valley market."
                  className="min-h-[120px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg h-12">
                <Save className="h-4 w-4 mr-2" />
                Save Profile Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive email updates about your listings and account activity
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-emerald-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Listing Status Updates</Label>
                    <p className="text-sm text-gray-600">
                      Get notified when your listing status changes (approved, rejected, etc.)
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-purple-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">New Inquiries</Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications for new property inquiries from potential buyers
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-amber-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Marketing Updates</Label>
                    <p className="text-sm text-gray-600">
                      Get tips and updates about real estate marketing and industry news
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-amber-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-red-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">System Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Important system notifications and maintenance updates
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
                </div>
              </div>

              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg h-12">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Privacy & Security Settings */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-emerald-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Profile Visibility</Label>
                    <p className="text-sm text-gray-600">
                      Make your profile visible to potential clients and other agents
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 p-4 bg-blue-50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Show Contact Information</Label>
                    <p className="text-sm text-gray-600">
                      Display your contact details on your public listings
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg h-12">
                    <Shield className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-xl">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Download Your Data</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Export all your listings, account data, and activity history
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 h-12">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 p-6 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
                <Button variant="destructive" className="h-12 shadow-lg">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
