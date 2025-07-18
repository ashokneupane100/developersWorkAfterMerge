"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import { Check, X, Eye, Calendar, MapPin, DollarSign, RefreshCw } from "lucide-react"

const PostedListingsPage = () => {
  const [listings, setListings] = useState([])
  const [allListings, setAllListings] = useState([]) // Store all fetched data
  const [loading, setLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("pending") // Changed default to "pending"

  // Fetch all listings on component mount
  const fetchAllListings = async () => {
    setIsInitialLoading(true)
    try {
      const { data, error } = await supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching listings:", error)
        throw error
      }

      console.log("✅ Fetched listings:", data?.length || 0)
      setAllListings(data || [])
      setListings(data || [])
    } catch (error) {
      console.error("🚨 Fetch error:", error)
      setAllListings([])
      setListings([])
    } finally {
      setIsInitialLoading(false)
      setLoading(false)
    }
  }

  // Filter listings based on status - show all listings for "all" tab
  const getFilteredListings = () => {
    if (statusFilter === "all") {
      // Show all listings (pending, approved, rejected)
      return allListings
    }
    return allListings.filter((listing) => {
      const status = listing.admin_status || "pending"
      return status === statusFilter
    })
  }

  const displayListings = getFilteredListings()
  const totalPages = Math.ceil(displayListings.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = displayListings.slice(indexOfFirstItem, indexOfLastItem)

  // Update listing status with your pattern
  const updateListingStatus = async (listingId, status) => {
    setUpdating(listingId)

    try {
      const { error } = await supabase.from("listing").update({ admin_status: status }).eq("id", listingId)

      if (error) {
        console.error("❌ Error updating listing:", error)
        alert("Failed to update listing status")
        return
      }

      // Update both allListings and listings state (like your pattern)
      const updateListingInArray = (listings) =>
        listings.map((listing) => (listing.id === listingId ? { ...listing, admin_status: status } : listing))

      setAllListings((prev) => updateListingInArray(prev))
      setListings((prev) => updateListingInArray(prev))

      alert(`Listing ${status} successfully`)
      console.log(`✅ Listing ${listingId} updated to ${status}`)
    } catch (error) {
      console.error("🚨 Update error:", error)
      alert("An error occurred while updating the listing")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusCounts = () => {
    const all = allListings.length // Show total count of all listings
    const pending = allListings.filter((l) => (l.admin_status || "pending") === "pending").length
    const approved = allListings.filter((l) => l.admin_status === "approved").length
    const rejected = allListings.filter((l) => l.admin_status === "rejected").length
    return { all, pending, approved, rejected }
  }

  const statusCounts = getStatusCounts()

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Load data on mount (like your pattern)
  useEffect(() => {
    fetchAllListings()
  }, [])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])

  return (
    <div className="ml-64 p-8">
      {/* Full Screen Loading Overlay (like your pattern) */}
      {(loading || isInitialLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Loading Posted Listings...</h3>
                <p className="text-sm text-gray-600">Fetching all property listings from database</p>
                <div className="flex items-center justify-center space-x-1 text-blue-600">
                  <div className="animate-bounce">.</div>
                  <div className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                    .
                  </div>
                  <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                    .
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                🏢 Loading all property listings
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Posted Listings</h1>
            <p className="text-gray-600 mt-2">
              Manage and review all posted listings ({allListings.length} total, {statusCounts.pending} pending review)
            </p>
          </div>
          <button
            onClick={fetchAllListings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Filter Tabs - Modified to focus on actionable items */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { key: "pending", label: "Pending Review", count: statusCounts.pending },
            { key: "rejected", label: "Rejected", count: statusCounts.rejected },
            { key: "all", label: "All Listings", count: statusCounts.all },
            { key: "approved", label: "Approved (View Only)", count: statusCounts.approved },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`pb-3 px-1 font-medium relative ${
                statusFilter === key ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {label} ({count})
              {statusFilter === key && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner for Approved Tab */}
      {statusFilter === "approved" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Approved Listings (View Only)</h3>
              <p className="text-sm text-green-700 mt-1">
                These listings have already been approved and are live on the site. No actions needed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {listing.post_title || listing.propertyType || "Property Title"}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {listing.description || "No description"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">ID: {String(listing.id || "").slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        Rs {listing.price?.toLocaleString() || "0"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-xs">
                          {listing.full_address || listing.address || listing.location || "No location"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {listing.propertyType} • {listing.action || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.admin_status)}`}
                    >
                      {listing.admin_status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* Only show action buttons for non-approved listings */}
                      {listing.admin_status !== "approved" && (
                        <>
                          <button
                            onClick={() => updateListingStatus(listing.id, "approved")}
                            disabled={updating === listing.id}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            {updating === listing.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </button>
                          {listing.admin_status !== "rejected" && (
                            <button
                              onClick={() => updateListingStatus(listing.id, "rejected")}
                              disabled={updating === listing.id}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                            >
                              {updating === listing.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                      {/* Show "Already Approved" message for approved listings */}
                      {listing.admin_status === "approved" && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                          <Check className="h-3 w-3 mr-1" />
                          Already Approved
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && displayListings.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, displayListings.length)}</span> of{" "}
                  <span className="font-medium">{displayListings.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && displayListings.length === 0 && (
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {statusFilter === "all" ? "" : statusFilter} listings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === "pending"
                ? "No listings are waiting for approval."
                : statusFilter === "rejected"
                  ? "No rejected listings available."
                  : statusFilter === "approved"
                    ? "No approved listings found."
                    : statusFilter === "all"
                      ? "No listings have been posted yet."
                      : "No listings found."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostedListingsPage
