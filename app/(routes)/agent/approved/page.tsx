import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Eye, Edit, MoreHorizontal, Search, Filter, TrendingUp, Users, DollarSign } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ApprovedListings() {
  const approvedListings = [
    {
      id: 1,
      title: "Luxury Apartment in Lalitpur",
      location: "Lalitpur, Nepal",
      date: "6/27/2025",
      price: "$180,000",
      views: 245,
      inquiries: 8,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 2,
      title: "Modern House in Kathmandu",
      location: "Kathmandu, Nepal",
      date: "6/25/2025", 
      price: "$320,000",
      views: 189,
      inquiries: 12,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 3,
      title: "Villa with Garden in Bhaktapur",
      location: "Bhaktapur, Nepal",
      date: "6/23/2025",
      price: "$275,000",
      views: 156,
      inquiries: 6,
      image: "/placeholder.svg?height=80&width=80"
    },
    {
      id: 4,
      title: "Penthouse in Pokhara",
      location: "Pokhara, Nepal", 
      date: "6/20/2025",
      price: "$195,000",
      views: 298,
      inquiries: 15,
      image: "/placeholder.svg?height=80&width=80"
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Approved Listings
          </h1>
          <p className="text-gray-600 mt-1">Your successfully approved properties</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Home className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="gradient-card border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedListings.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">888</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">41</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
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
                placeholder="Search your approved listings..." 
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

      {/* Listings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {approvedListings.map((listing) => (
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
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-500 shadow-lg">
                      approved
                    </Badge>
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
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Views</p>
                          <p className="text-lg font-bold text-blue-600">{listing.views}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Inquiries</p>
                          <p className="text-lg font-bold text-purple-600">{listing.inquiries}</p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-gray-600">Listed</p>
                          <p className="text-xs font-medium text-emerald-600">{listing.date}</p>
                        </div>
                      </div>
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
                              <TrendingUp className="h-4 w-4 mr-2" />
                              View Analytics
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
