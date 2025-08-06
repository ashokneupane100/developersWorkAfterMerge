import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Eye, Edit, MoreHorizontal, Clock, Search, Filter, AlertCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/agentui/progress"

export default function PendingListings() {
  const pendingListings = [
    {
      id: 1,
      title: "Modern Villa in Kathmandu",
      location: "Kathmandu, Nepal",
      date: "6/28/2025",
      price: "$250,000",
      submittedDays: 1,
      progress: 25,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 2,
      title: "Family House in Bhaktapur",
      location: "Bhaktapur, Nepal",
      date: "6/25/2025",
      price: "$95,000",
      submittedDays: 4,
      progress: 75,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 3,
      title: "Apartment in Lalitpur",
      location: "Lalitpur, Nepal",
      date: "6/24/2025",
      price: "$150,000",
      submittedDays: 5,
      progress: 90,
      image: "/placeholder.svg?height=80&width=80"
    }
  ]

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return "text-green-600"
    if (days <= 4) return "text-amber-600"
    return "text-red-600"
  }

  const getProgressColor = (progress: number) => {
    if (progress <= 30) return "bg-blue-500"
    if (progress <= 70) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Pending Listings
          </h1>
          <p className="text-gray-600 mt-1">Properties currently under review</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Home className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="gradient-card border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-3xl font-bold text-gray-900">{pendingListings.length}</p>
                <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Wait Time</p>
                <p className="text-3xl font-bold text-gray-900">2-3</p>
                <p className="text-xs text-blue-600 mt-1">days review</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Longest Pending</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-xs text-red-600 mt-1">days ago</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="gradient-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search pending listings..." 
                className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {pendingListings.map((listing) => (
          <Card key={listing.id} className="gradient-card hover:shadow-xl transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-32 h-48 sm:h-32 relative">
                  <img 
                    src={listing.image || "/placeholder.svg"} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500 text-white hover:bg-amber-500 shadow-lg animate-pulse">
                      pending
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Review Progress</span>
                        <span className="font-medium">{listing.progress}%</span>
                      </div>
                      <Progress 
                        value={listing.progress} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {listing.location}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="text-sm font-bold text-amber-600">{listing.date}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Days Ago</p>
                          <p className={`text-lg font-bold ${getUrgencyColor(listing.submittedDays)}`}>
                            {listing.submittedDays}
                          </p>
                        </div>
                      </div>

                      {listing.submittedDays > 3 && (
                        <div className="flex items-center p-3 bg-red-50 rounded-lg mb-4">
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-700">Taking longer than usual</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className="text-2xl font-bold text-gray-900">{listing.price}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-emerald-50 hover:text-emerald-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              Check Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
