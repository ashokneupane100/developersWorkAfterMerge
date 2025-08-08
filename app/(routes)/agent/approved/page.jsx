"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Eye, Edit, MoreHorizontal, Search, Filter, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ApprovedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debug, setDebug] = useState({ email: "" });

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      try {
        // Get current user (don’t read HttpOnly cookies on client)
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("[ApprovedListings] getUser error:", userErr.message);

        const email = userData?.user?.email || "";
        setDebug({ email });
        console.log("[ApprovedListings] resolved email via auth:", email);

        if (!email) {
          console.warn("[ApprovedListings] No authenticated user. Nothing to fetch.");
          setListings([]);
          return;
        }

        // Fetch all listings for this email (exact quoted camelCase column "createdBy")
        const { data, error } = await supabase
          .from("listing")
          .select(`
            id,
            created_at,
            full_address,
            address,
            "createdBy",
            price,
            views,
            admin_status,
            post_title,
            "profileImage"
          `)
          .eq("createdBy", email)
          .order("created_at", { ascending: false })
          .limit(100);

        console.log("📦 [ApprovedListings] server response:", { data, error });

        if (error) {
          console.error("[ApprovedListings] fetch error:", error);
          setListings([]);
          return;
        }

        console.log("📦 [ApprovedListings] raw rows (id/status):", (data || []).map(r => ({ id: r.id, admin_status: r.admin_status })));
        setListings(data || []);
      } catch (e) {
        console.error("[ApprovedListings] unexpected error:", e);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  // Helpers
  const norm = (s) => (s ?? "").toString().trim().toLowerCase();

  // Only approved (robust to case/whitespace)
  const onlyApproved = useMemo(
    () => (listings || []).filter((l) => norm(l.admin_status) === "approved"),
    [listings]
  );

  // Debug what passed the filter
  useEffect(() => {
    console.log("✅ onlyApproved (id/status):", onlyApproved.map(r => ({ id: r.id, admin_status: r.admin_status })));
  }, [onlyApproved]);

  // Search within approved
  const filtered = useMemo(() => {
    const q = norm(search);
    if (!q) return onlyApproved;
    return onlyApproved.filter((l) => {
      const title = norm(l.post_title);
      const addr = norm(l.full_address || l.address);
      return title.includes(q) || addr.includes(q);
    });
  }, [onlyApproved, search]);

  const totalViews = useMemo(() => filtered.reduce((sum, l) => sum + (l.views || 0), 0), [filtered]);

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" });
  const fmtPrice = (p) => (typeof p === "number" ? `Nrs. ${p.toLocaleString()}` : "—");

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
        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
          <Link href="/agent/new">
            <Home className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="gradient-card border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Approved</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? "…" : filtered.length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{loading ? "…" : totalViews}</p>
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
                <p className="text-3xl font-bold text-gray-900">{loading ? "…" : 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="gradient-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your approved listings..."
                className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-6 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              onClick={() => setSearch("")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {loading ? (
          <Card className="gradient-card">
            <CardContent className="p-6 text-gray-600">Loading approved listings…</CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="gradient-card">
            <CardContent className="p-6 text-gray-600">
              No approved listings found for <b>{debug.email || "(no email)"}</b>.
              <div className="text-xs text-gray-500 mt-2">
                Tip: ensure RLS allows <code>SELECT</code> where <code>"createdBy" = auth.email()</code>.
              </div>
            </CardContent>
          </Card>
        ) : (
          filtered.map((listing) => {
            const title = listing.post_title || "Untitled Property";
            const location = listing.full_address || listing.address || "—";
            const date = fmtDate(listing.created_at);
            const image = listing.profileImage || "/placeholder.svg?height=80&width=80";
            return (
              <Card key={listing.id} className="gradient-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 h-48 sm:h-32 relative">
                      <img src={image} alt={title} className="w-full h-full object-cover p-4 mt-8" />
                      <div className="absolute top-3 left-3">
                        <Badge className="text-white bg-emerald-500 shadow-lg">approved</Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                          <p className="text-gray-600 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            {location}
                          </p>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-gray-600">Views</p>
                              <p className="text-lg font-bold text-blue-600">{listing.views ?? 0}</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-gray-600">Inquiries</p>
                              <p className="text-lg font-bold text-purple-600">0</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                              <p className="text-sm text-gray-600">Listed</p>
                              <p className="text-xs font-medium text-emerald-600">{date}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <span className="text-2xl font-bold text-gray-900">{fmtPrice(listing.price)}</span>
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
            );
          })
        )}
      </div>
    </div>
  );
}

