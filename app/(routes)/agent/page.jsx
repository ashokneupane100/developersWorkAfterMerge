import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/agentui/avatar"
import { Button } from "@/components/ui/button"
import { Home, CheckCircle, Clock, XCircle, TrendingUp, Eye, Plus, ArrowUpRight, Users, Activity } from 'lucide-react'

export default function AgentDashboard() {
  const recentListings = [
    {
      id: 1,
      title: "Modern Villa in Kathmandu",
      location: "Kathmandu, Nepal",
      date: "6/28/2025",
      status: "pending",
      price: "$250,000",
      image: "/placeholder.svg?height=60&width=60"
    },
    {
      id: 2,
      title: "Luxury Apartment in Lalitpur",
      location: "Lalitpur, Nepal", 
      date: "6/27/2025",
      status: "approved",
      price: "$180,000",
      image: "/placeholder.svg?height=60&width=60"
    },
    {
      id: 3,
      title: "Commercial Space in Pokhara",
      location: "Pokhara, Nepal",
      date: "6/26/2025",
      status: "rejected",
      price: "$120,000",
      image: "/placeholder.svg?height=60&width=60"
    },
    {
      id: 4,
      title: "Family House in Bhaktapur",
      location: "Bhaktapur, Nepal",
      date: "6/25/2025",
      status: "pending",
      price: "$95,000",
      image: "/placeholder.svg?height=60&width=60"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your listings.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="gradient-card stat-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Listings
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">24</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card stat-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approved
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">18</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card stat-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">4</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Avg. 2-3 days review
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card stat-card border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rejected
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">2</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Users className="h-3 w-3 mr-1" />
              Can be resubmitted
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Listings */}
        <Card className="gradient-card lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl font-semibold">Recent Listings</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Your latest property submissions</p>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                <Eye className="h-4 w-4 mr-2" />
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl border hover:shadow-md transition-all duration-200">
                  <div className="relative">
                    <img 
                      src={listing.image || "/placeholder.svg"} 
                      alt={listing.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1">
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {listing.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {listing.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{listing.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance & Quick Actions */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">New Listings</span>
                  <span className="text-lg font-bold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                  <span className="text-lg font-bold text-emerald-600">6</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Views</span>
                  <span className="text-lg font-bold text-purple-600">1,247</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Inquiries</span>
                  <span className="text-lg font-bold text-orange-600">23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12">
                  <Home className="h-4 w-4 mr-3" />
                  Add New Listing
                </Button>
                <Button className="w-full justify-start h-12" variant="outline">
                  <Eye className="h-4 w-4 mr-3" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start h-12" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
