import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Eye, Edit, MoreHorizontal, XCircle, RefreshCw, Search, Filter, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RejectedListings() {
  const rejectedListings = [
    {
      id: 1,
      title: "Commercial Space in Pokhara",
      location: "Pokhara, Nepal",
      date: "6/26/2025",
      price: "$120,000",
      reason: "Incomplete documentation",
      rejectedDays: 3,
      canResubmit: true,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 2,
      title: "Old House in Kathmandu",
      location: "Kathmandu, Nepal",
      date: "6/22/2025",
      price: "$85,000",
      reason: "Property images unclear",
      rejectedDays: 7,
      canResubmit: true,
      image: "/placeholder.svg?height=80&width=80"
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Rejected Listings
          </h1>
          <p className="text-gray-600 mt-1">Properties that need revision before resubmission</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Home className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="gradient-card border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{rejectedListings.length}</p>
                <p className="text-xs text-red-600 mt-1">Need revision</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Can Resubmit</p>
                <p className="text-3xl font-bold text-gray-900">{rejectedListings.filter(l => l.canResubmit).length}</p>
                <p className="text-xs text-blue-600 mt-1">After fixing issues</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">92%</p>
                <p className="text-xs text-emerald-600 mt-1">Overall approval</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <RefreshCw className="h-6 w-6 text-emerald-600" />
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
                placeholder="Search rejected listings..." 
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

      {/* Rejected Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {rejectedListings.map((listing) => (
          <Card key={listing.id} className="gradient-card hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-l-red-200">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-32 h-48 sm:h-32 relative">
                  <img 
                    src={listing.image || "/placeholder.svg"} 
                    alt={listing.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white hover:bg-red-500 shadow-lg">
                      rejected
                    </Badge>
                  </div>
                  {listing.canResubmit && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full text-center">
                        Can Resubmit
                      </div>
                    </div>
                  )}
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
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                            <p className="text-sm text-red-700 mt-1">{listing.reason}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Rejected</p>
                          <p className="text-sm font-bold text-gray-800">{listing.rejectedDays} days ago</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-sm font-bold text-blue-600">
                            {listing.canResubmit ? "Can Resubmit" : "Under Review"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className="text-2xl font-bold text-gray-900">{listing.price}</span>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          disabled={!listing.canResubmit}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resubmit
                        </Button>
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
                                Edit & Resubmit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Resubmit As Is
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
