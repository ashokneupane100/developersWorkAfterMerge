"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home, Eye, Edit, MoreHorizontal, Clock, Search, Filter, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/agentui/progress";

export default function PendingListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debug, setDebug] = useState({ email: "" });

  // --- fetch listings like Approved page ---
  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("[PendingListings] getUser error:", userErr.message);
        const email = userData?.user?.email || "";
        setDebug({ email });

        if (!email) {
          setListings([]);
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
          .eq("createdBy", email)
          .order("created_at", { ascending: false })
          .limit(100);

        console.log("📦 [PendingListings] server response:", { data, error });

        if (error) {
          console.error("[PendingListings] fetch error:", error);
          setListings([]);
          return;
        }
        setListings(data || []);
      } catch (e) {
        console.error("[PendingListings] unexpected error:", e);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // helpers
  const norm = (s) => (s ?? "").toString().trim().toLowerCase();
  const fmtNrs = (p) => (typeof p === "number" ? `Nrs. ${p.toLocaleString("en-NP")}` : "—");
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" });

  const daysSince = (iso) => {
    if (!iso) return 0;
    const ms = Date.now() - new Date(iso).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  };

  // simple progress model: each day adds 20% up to 95%
  const deriveProgress = (d) => Math.min(95, d * 20);

  // only pending (case-insensitive)
  const onlyPending = useMemo(
    () => (listings || []).filter((l) => norm(l.admin_status) === "pending"),
    [listings]
  );

  // add derived fields (submittedDays, progress)
  const pendingWithMeta = useMemo(
    () =>
      onlyPending.map((l) => {
        const submittedDays = daysSince(l.created_at);
        const progress = deriveProgress(submittedDays);
        return { ...l, submittedDays, progress };
      }),
    [onlyPending]
  );

  // search
  const filtered = useMemo(() => {
    const q = norm(search);
    if (!q) return pendingWithMeta;
    return pendingWithMeta.filter((l) => {
      const title = norm(l.post_title);
      const addr = norm(l.full_address || l.address);
      return title.includes(q) || addr.includes(q);
    });
  }, [pendingWithMeta, search]);

  // stats
  const avgWait =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, l) => s + (l.submittedDays || 0), 0) / filtered.length)
      : 0;
  const longest = filtered.reduce((m, l) => Math.max(m, l.submittedDays || 0), 0);

  const getUrgencyColor = (days) => {
    if (days <= 2) return "text-green-600";
    if (days <= 4) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Pending Listings
          </h1>
          <p className="text-gray-600 mt-1">Properties currently under review</p>
        </div>
        <Button asChild className="h-11 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow">
          <Link href="/agent/new">
            <Home className="h-4 w-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="rounded-2xl shadow-sm border-l-4 border-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Under Review</p>
                <p className="text-3xl font-semibold text-slate-900">{loading ? "…" : filtered.length}</p>
                <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-l-4 border-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Wait Time</p>
                <p className="text-3xl font-semibold text-slate-900">{loading ? "…" : avgWait}</p>
                <p className="text-xs text-blue-600 mt-1">days review</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-l-4 border-red-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Longest Pending</p>
                <p className="text-3xl font-semibold text-slate-900">{loading ? "…" : longest}</p>
                <p className="text-xs text-red-600 mt-1">days ago</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search pending listings..."
                className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 px-5 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
              onClick={() => setSearch("")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Listings */}
      <div className="grid gap-6">
        {loading ? (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-slate-600">Loading pending listings…</CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-slate-600">
              No pending listings found for <b>{debug.email || "(no email)"}</b>.
            </CardContent>
          </Card>
        ) : (
          filtered.map((l) => {
            const title = l.post_title || "Untitled Property";
            const location = l.full_address || l.address || "—";
            const image = l.profileImage || "/placeholder.svg?height=80&width=80";
            const listedOn = fmtDate(l.created_at);

            return (
              <Card key={l.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image + status + progress */}
                    <div className="sm:w-40 md:w-48 h-48 sm:h-auto relative">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500 shadow-lg animate-pulse">
                          pending
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-600">Review Progress</span>
                            <span className="font-medium">{l.progress}%</span>
                          </div>
                          <Progress value={l.progress} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug line-clamp-2">
                            {title}
                          </h3>
                          <p className="text-slate-600 mt-1 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="truncate">{location}</span>
                          </p>

                          {/* Stats pills */}
                          <div className="mt-4 grid grid-cols-2 gap-3 max-w-2xl">
                            <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
                              <p className="text-xs text-slate-500">Submitted</p>
                              <p className="text-sm font-semibold text-amber-700">{listedOn}</p>
                            </div>
                            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
                              <p className="text-xs text-slate-500">Days Ago</p>
                              <p className={`text-lg font-semibold ${getUrgencyColor(l.submittedDays)}`}>
                                {l.submittedDays}
                              </p>
                            </div>
                          </div>

                          {l.submittedDays > 3 && (
                            <div className="mt-3 flex items-center p-3 bg-red-50 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-700">Taking longer than usual</span>
                            </div>
                          )}
                        </div>

                        {/* Price + actions */}
                        <div className="flex items-start justify-between sm:flex-col sm:items-end sm:justify-start gap-3 shrink-0">
                          <span className="text-2xl md:text-3xl font-bold text-slate-900 whitespace-nowrap">
                            {fmtNrs(l.price)}
                          </span>
                          <div className="flex gap-2">
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
            );
          })
        )}
      </div>
    </div>
  );
}
