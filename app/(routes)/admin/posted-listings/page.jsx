// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/utils/supabase/client";
// import { Check, X, Eye, Calendar, MapPin, DollarSign, RefreshCw } from "lucide-react";
// //admin import
// import AdminDashboard from "@/components/admin/AdminDashboard";

// const PostedListingsPage = () => {
//   const [listings, setListings] = useState([]);
//   const [allListings, setAllListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [updating, setUpdating] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [statusFilter, setStatusFilter] = useState("pending");

//   const fetchAllListings = async () => {
//     setIsInitialLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("listing")
//         .select("*, listingImages(url, listing_id)")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setAllListings(data || []);
//       setListings(data || []);
//     } catch (error) {
//       console.error("Error fetching listings:", error);
//       setAllListings([]);
//       setListings([]);
//     } finally {
//       setIsInitialLoading(false);
//       setLoading(false);
//     }
//   };

//   const getFilteredListings = () => {
//     if (statusFilter === "all") return allListings;
//     return allListings.filter((listing) => (listing.admin_status || "pending") === statusFilter);
//   };

//   const displayListings = getFilteredListings();
//   const totalPages = Math.ceil(displayListings.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = displayListings.slice(indexOfFirstItem, indexOfLastItem);

//   const updateListingStatus = async (listingId, status) => {
//     setUpdating(listingId);
//     try {
//       const { error } = await supabase.from("listing").update({ admin_status: status }).eq("id", listingId);
//       if (error) throw error;

//       const updateInArray = (arr) => arr.map((item) => (item.id === listingId ? { ...item, admin_status: status } : item));
//       setAllListings(updateInArray);
//       setListings(updateInArray);
//     } catch (error) {
//       console.error("Update error:", error);
//     } finally {
//       setUpdating(null);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved": return "bg-green-100 text-green-800";
//       case "rejected": return "bg-red-100 text-red-800";
//       default: return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   const getStatusCounts = () => {
//     const all = allListings.length;
//     const pending = allListings.filter((l) => (l.admin_status || "pending") === "pending").length;
//     const approved = allListings.filter((l) => l.admin_status === "approved").length;
//     const rejected = allListings.filter((l) => l.admin_status === "rejected").length;
//     return { all, pending, approved, rejected };
//   };

//   const statusCounts = getStatusCounts();

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => { fetchAllListings(); }, []);
//   useEffect(() => { setCurrentPage(1); }, [statusFilter]);

//   return (
    

  
//     <AdminDashboard>

//         <div className="px-4 sm:px-6 lg:px-8 py-6">
//       {(loading || isInitialLoading) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-2xl">
//             <div className="flex flex-col items-center space-y-4">
//               <div className="relative">
//                 <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Eye className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900">Loading Posted Listings...</h3>
//               <p className="text-sm text-gray-600">Fetching all property listings</p>
//               <div className="text-blue-600 text-xl animate-bounce">...</div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Posted Listings</h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Manage all listings ({statusCounts.all} total, {statusCounts.pending} pending)
//           </p>
//         </div>
//         <button
//           onClick={fetchAllListings}
//           disabled={loading}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       <div className="mb-6 border-b border-gray-200">
//         <div className="flex flex-wrap gap-3">
//           {["pending", "rejected", "all", "approved"].map((key) => (
//             <button
//               key={key}
//               onClick={() => setStatusFilter(key)}
//               className={`pb-2 px-2 text-sm font-medium relative ${statusFilter === key ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
//             >
//               {key.charAt(0).toUpperCase() + key.slice(1)} ({statusCounts[key]})
//               {statusFilter === key && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto max-w-full">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {["Property Details", "Price & Location", "Status", "Created", "Actions"].map((head) => (
//                   <th key={head} className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     {head}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentItems.map((listing) => (
//                 <tr key={listing.id} className="hover:bg-gray-50">
//                   <td className="px-3 sm:px-6 py-4">
//                     <div className="flex items-start">
//                       <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
//                         <Eye className="h-5 w-5 text-indigo-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
//                           {listing.post_title || "Property Title"}
//                         </div>
//                         <div className="text-sm text-gray-500 max-w-xs truncate">
//                           {listing.description || "No description"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-6 py-4">
//                     <div className="text-sm text-gray-900 flex items-center">
//                       <DollarSign className="h-4 w-4 mr-1 text-green-600" />
//                       Rs {listing.price?.toLocaleString() || "0"}
//                     </div>
//                     <div className="text-sm text-gray-500 flex items-center">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       {listing.location || "No location"}
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.admin_status)}`}>
//                       {listing.admin_status || "pending"}
//                     </span>
//                   </td>
//                   <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : "N/A"}
//                     </div>
//                   </td>
//                   <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex gap-2 flex-wrap">
//                       {listing.admin_status !== "approved" ? (
//                         <>
//                           <button
//                             onClick={() => updateListingStatus(listing.id, "approved")}
//                             disabled={updating === listing.id}
//                             className="px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => updateListingStatus(listing.id, "rejected")}
//                             disabled={updating === listing.id}
//                             className="px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       ) : (
//                         <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded">
//                           <Check className="h-3 w-3 inline mr-1" />Approved
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//     </AdminDashboard>

   
//   );
// };

// export default PostedListingsPage;
"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import { Check, X, Eye, Calendar, MapPin, DollarSign, RefreshCw, Edit, Trash2, Search, Filter } from "lucide-react"
import AdminDashboard from "@/components/admin/AdminDashboard"

const PostedListingsPage = () => {
  const [listings, setListings] = useState([])
  const [allListings, setAllListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter states
  const [statusFilter, setStatusFilter] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [editModal, setEditModal] = useState({ show: false, listing: null })
  const [deleteModal, setDeleteModal] = useState({ show: false, listing: null })

  // Edit form state
  const [editForm, setEditForm] = useState({
    post_title: "",
    description: "",
    price: "",
    location: "",
  })

  const fetchAllListings = async () => {
    setIsInitialLoading(true)
    try {
      const { data, error } = await supabase
        .from("listing")
        .select("*, listingImages(url, listing_id)")
        .order("created_at", { ascending: false })
      if (error) throw error
      setAllListings(data || [])
      setListings(data || [])
    } catch (error) {
      console.error("Error fetching listings:", error)
      setAllListings([])
      setListings([])
    } finally {
      setIsInitialLoading(false)
      setLoading(false)
    }
  }

  const getFilteredListings = () => {
    let filtered = allListings

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing) => (listing.admin_status || "pending") === statusFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (listing) =>
          (listing.post_title || "").toLowerCase().includes(query) ||
          (listing.description || "").toLowerCase().includes(query) ||
          (listing.location || "").toLowerCase().includes(query),
      )
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((listing) => {
        const price = listing.price || 0
        const min = priceRange.min ? Number.parseFloat(priceRange.min) : 0
        const max = priceRange.max ? Number.parseFloat(priceRange.max) : Number.POSITIVE_INFINITY
        return price >= min && price <= max
      })
    }

    return filtered
  }

  const displayListings = getFilteredListings()
  const totalPages = Math.ceil(displayListings.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = displayListings.slice(indexOfFirstItem, indexOfLastItem)

  const updateListingStatus = async (listingId, status) => {
    setUpdating(listingId)
    try {
      const { error } = await supabase.from("listing").update({ admin_status: status }).eq("id", listingId)
      if (error) throw error
      const updateInArray = (arr) =>
        arr.map((item) => (item.id === listingId ? { ...item, admin_status: status } : item))
      setAllListings(updateInArray)
      setListings(updateInArray)
    } catch (error) {
      console.error("Update error:", error)
    } finally {
      setUpdating(null)
    }
  }

  const handleEdit = (listing) => {
    setEditForm({
      post_title: listing.post_title || "",
      description: listing.description || "",
      price: listing.price?.toString() || "",
      location: listing.location || "",
    })
    setEditModal({ show: true, listing })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editModal.listing) return

    setUpdating(editModal.listing.id)
    try {
      const { error } = await supabase
        .from("listing")
        .update({
          post_title: editForm.post_title,
          description: editForm.description,
          price: Number.parseFloat(editForm.price) || 0,
          location: editForm.location,
        })
        .eq("id", editModal.listing.id)

      if (error) throw error

      const updateInArray = (arr) =>
        arr.map((item) =>
          item.id === editModal.listing.id
            ? {
                ...item,
                post_title: editForm.post_title,
                description: editForm.description,
                price: Number.parseFloat(editForm.price) || 0,
                location: editForm.location,
              }
            : item,
        )

      setAllListings(updateInArray)
      setListings(updateInArray)
      setEditModal({ show: false, listing: null })
    } catch (error) {
      console.error("Edit error:", error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.listing) return

    setDeleting(deleteModal.listing.id)
    try {
      const { error } = await supabase.from("listing").delete().eq("id", deleteModal.listing.id)
      if (error) throw error

      const filterArray = (arr) => arr.filter((item) => item.id !== deleteModal.listing.id)
      setAllListings(filterArray)
      setListings(filterArray)
      setDeleteModal({ show: false, listing: null })
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleting(null)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange({ min: "", max: "" })
    setStatusFilter("pending")
    setCurrentPage(1)
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
    const all = allListings.length
    const pending = allListings.filter((l) => (l.admin_status || "pending") === "pending").length
    const approved = allListings.filter((l) => l.admin_status === "approved").length
    const rejected = allListings.filter((l) => l.admin_status === "rejected").length
    return { all, pending, approved, rejected }
  }

  const statusCounts = getStatusCounts()

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    fetchAllListings()
  }, [])
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery, priceRange])

  return (
    <AdminDashboard>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading Overlay */}
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
                <h3 className="text-lg font-semibold text-gray-900">Loading Posted Listings...</h3>
                <p className="text-sm text-gray-600">Fetching all property listings</p>
                <div className="text-blue-600 text-xl animate-bounce">...</div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Posted Listings</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage all listings ({statusCounts.all} total, {displayListings.length} filtered)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
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

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            {["pending", "rejected", "all", "approved"].map((key) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`pb-2 px-2 text-sm font-medium relative ${
                  statusFilter === key ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ({statusCounts[key]})
                {statusFilter === key && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Property Details", "Price & Location", "Status", "Created", "Actions"].map((head) => (
                    <th
                      key={head}
                      className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {listing.post_title || "Property Title"}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {listing.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        Rs {listing.price?.toLocaleString() || "0"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location || "No location"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.admin_status)}`}
                      >
                        {listing.admin_status || "pending"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1 flex-wrap">
                        {/* Status Actions */}
                        {listing.admin_status !== "approved" && (
                          <>
                            <button
                              onClick={() => updateListingStatus(listing.id, "approved")}
                              disabled={updating === listing.id}
                              className="px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => updateListingStatus(listing.id, "rejected")}
                              disabled={updating === listing.id}
                              className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(listing)}
                          disabled={updating === listing.id}
                          className="px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                        >
                          <Edit className="h-3 w-3" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteModal({ show: true, listing })}
                          disabled={deleting === listing.id}
                          className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, displayListings.length)} of{" "}
              {displayListings.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-lg ${
                    currentPage === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Listing</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.post_title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, post_title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={updating === editModal.listing?.id}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating === editModal.listing?.id ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModal({ show: false, listing: null })}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Listing</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{deleteModal.listing?.post_title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting === deleteModal.listing?.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting === deleteModal.listing?.id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setDeleteModal({ show: false, listing: null })}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  )
}

export default PostedListingsPage
