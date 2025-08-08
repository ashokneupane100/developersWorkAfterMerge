"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  Users,
  Activity,
} from "lucide-react";

export default function AgentDashboard() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState([]); // fetched listings for this agent

  useEffect(() => {
    const run = async () => {
      try {
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("[Dashboard] getUser error:", userErr.message);

        const userEmail = userRes?.user?.email || "";
        setEmail(userEmail);

        if (!userEmail) {
          setRows([]);
          return;
        }

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
          .eq("createdBy", userEmail)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) {
          console.error("[Dashboard] fetch error:", error);
          setRows([]);
          return;
        }

        setRows(data || []);
      } catch (e) {
        console.error("[Dashboard] fatal:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [supabase]);

  // helpers
  const norm = (s) => (s ?? "").toString().trim().toLowerCase();
  const fmtPrice = (p) =>
    typeof p === "number" ? `Nrs. ${p.toLocaleString()}` : "—";

  const totalListings = rows.length;
  const totalViews = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.views) || 0), 0),
    [rows]
  );
  const approvedCount = useMemo(
    () => rows.filter((r) => norm(r.admin_status) === "approved").length,
    [rows]
  );
  const pendingCount = useMemo(
    () => rows.filter((r) => ["pending"].includes(norm(r.admin_status))).length,
    [rows]
  );
  const rejectedCount = useMemo(
    () => rows.filter((r) => norm(r.admin_status) === "rejected").length,
    [rows]
  );

  // last 4 recent listings (already sorted desc by created_at)
  const recentListings = useMemo(() => rows.slice(0, 4), [rows]);

  const getStatusColor = (statusRaw) => {
    const status = norm(statusRaw);
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            {loading
              ? "Loading your listings…"
              : email
              ? `Signed in as ${email}`
              : "Not signed in"}
          </p>
        </div>
 
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
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? "…" : totalListings}
            </div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {/* keep a neutral note instead of fake growth */}
              {loading ? "—" : "All-time"}
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
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? "…" : approvedCount}
            </div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {loading ? "—" : "Case-insensitive status"}
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
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? "…" : pendingCount}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              {loading ? "—" : "Avg. review varies"}
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
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {loading ? "…" : rejectedCount}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Users className="h-3 w-3 mr-1" />
              {loading ? "—" : "Fix & resubmit if allowed"}
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
                <CardTitle className="text-xl font-semibold">
                  Recent Listings
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Your latest property submissions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500 text-sm">Loading…</div>
            ) : recentListings.length === 0 ? (
              <div className="text-gray-500 text-sm">No listings yet.</div>
            ) : (
              <div className="space-y-4">
                {recentListings.map((listing) => {
                  const status = listing.admin_status || "";
                  const title = listing.post_title || "Untitled Property";
                  const location =
                    listing.full_address || listing.address || "—";
                  const image =
                    listing.profileImage || "/placeholder.svg?height=60&width=60";
                  return (
                    <div
                      key={listing.id}
                      className="flex items-center space-x-4 p-4 bg-white rounded-xl border hover:shadow-md transition-all duration-200"
                    >
                      <div className="relative">
                        <img
                          src={image}
                          alt={title}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1">
                          <Badge
                            className={`text-xs px-2 py-1 ${getStatusColor(
                              status
                            )}`}
                          >
                            {norm(status) || "—"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {location}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {fmtPrice(listing.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <span className="text-sm font-medium text-gray-700">
                    New Listings
                  </span>
                  {/* If you later want “this month only”, filter rows by created_at month */}
                  <span className="text-lg font-bold text-blue-600">
                    {loading ? "…" : rows.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Approved
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {loading ? "…" : approvedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Total Views
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {loading ? "…" : totalViews.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Inquiries
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {/* no inquiries column yet, so zero */}
                    0
                  </span>
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
  );
}
