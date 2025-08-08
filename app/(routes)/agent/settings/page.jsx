"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/agentui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/agentui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Bell,
  Shield,
  Save,
  Download,
  Trash2,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

export default function Settings() {
  const supabase = createClient();

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [debug, setDebug] = useState({ id: "", email: "" });

  // Form state — only columns that exist in your profiles table
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    full_address: "",
    address: "",
    avatar_url: "",
    user_role: "",
  });

  // hidden file input for avatar change
  const fileInputRef = useRef(null);

  // Load current user + profile
  useEffect(() => {
    const load = async () => {
      try {
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (userErr) console.warn("[Settings] getUser error:", userErr.message);

        const userId = userRes?.user?.id ?? "";
        const email = userRes?.user?.email ?? "";
        setDebug({ id: userId, email });

        if (!userId && !email) {
          setLoading(false);
          toast.error("Not signed in.");
          return;
        }

        // Prefer by PK id
        let profile = null;
        if (userId) {
          const { data, error } = await supabase
            .from("profiles")
            .select(
              "id, email, full_name, avatar_url, phone, full_address, address, user_role, updated_at"
            )
            .eq("id", userId)
            .single();
          if (!error && data) profile = data;
        }

        // Fallback by email
        if (!profile && email) {
          const { data, error } = await supabase
            .from("profiles")
            .select(
              "id, email, full_name, avatar_url, phone, full_address, address, user_role, updated_at"
            )
            .eq("email", email)
            .single();
          if (!error && data) profile = data;
        }

        if (!profile) {
          setForm((prev) => ({
            ...prev,
            email: email ?? "",
            user_role: "Buyer",
          }));
        } else {
          setForm({
            full_name: profile.full_name ?? "",
            email: profile.email ?? email ?? "",
            phone: profile.phone ?? "",
            full_address: profile.full_address ?? "",
            address: profile.address ?? "",
            avatar_url: profile.avatar_url ?? "",
            user_role: profile.user_role ?? "Buyer",
          });
        }
      } catch (e) {
        console.error("[Settings] load fatal:", e);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const dismiss = toast.loading("Saving profile…");
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id ?? "";
      const email = userRes?.user?.email ?? "";

      if (!userId && !email) {
        toast.dismiss(dismiss);
        toast.error("Not signed in.");
        setSaving(false);
        return;
      }

      const payload = {
        full_name: form.full_name?.trim() || null,
        phone: form.phone?.trim() || null,
        full_address: form.full_address?.trim() || null,
        address: form.address?.trim() || null,
        avatar_url: form.avatar_url?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Update by PK
      let { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        .select()
        .single();

      // If no row, upsert
      if (error && error.code === "PGRST116") {
        const upsertPayload = {
          id: userId,
          user_id: userId,
          email: email || form.email,
          user_role: form.user_role || undefined,
          ...payload,
        };

        const upsertRes = await supabase
          .from("profiles")
          .upsert(upsertPayload)
          .select()
          .single();

        toast.dismiss(dismiss);

        if (upsertRes.error) {
          console.error("[Settings] upsert error:", upsertRes.error);
          toast.error("Could not save profile.");
        } else {
          setForm((prev) => ({
            ...prev,
            email: upsertRes.data.email ?? prev.email,
            avatar_url: upsertRes.data.avatar_url ?? prev.avatar_url,
            user_role: upsertRes.data.user_role ?? prev.user_role,
          }));
          toast.success("Profile saved.");
        }
      } else if (error) {
        toast.dismiss(dismiss);
        console.error("[Settings] update error:", error);
        toast.error("Could not save profile.");
      } else {
        toast.dismiss(dismiss);
        toast.success("Profile saved.");
      }
    } catch (e) {
      toast.dismiss(dismiss);
      console.error("[Settings] save fatal:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Open file picker
  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // When a file is chosen → call API route
  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dismiss = toast.loading("Uploading avatar…");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      toast.dismiss(dismiss);

      if (!res.ok) {
        console.error("Upload error:", json?.error);
        toast.error(json?.error || "Upload failed");
        return;
      }

      // Update UI with new URL
      setForm((prev) => ({ ...prev, avatar_url: json.url }));
      toast.success("Avatar updated!");
    } catch (err) {
      toast.dismiss(dismiss);
      console.error("Upload fatal:", err);
      toast.error("Upload failed");
    } finally {
      // reset input so the same file can be re-selected later
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? "Loading…" : `Signed in as ${debug.email || "—"}`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 bg-white shadow-sm">
          <TabsTrigger value="profile" className="h-10">Profile</TabsTrigger>
          {/* If you want, re-enable other tabs */}
          {/* <TabsTrigger value="notifications" className="h-10">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="h-10">Security</TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={form.avatar_url || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileSelected}
                  />
                  <Button
                    type="button"
                    onClick={handleChangePhoto}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    disabled={loading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, GIF, PNG (max 5MB)</p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Your full name"
                  className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={form.full_name}
                  onChange={onChange("full_name")}
                  disabled={loading}
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 h-12 bg-gray-50 border-gray-200"
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    placeholder="+977 98XXXXXXXX"
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={form.phone}
                    onChange={onChange("phone")}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address (sync to both columns) */}
             {/* Full Address */}
<div className="space-y-2">
  <Label htmlFor="full_address" className="text-sm font-medium">
    Full Address
  </Label>
  <div className="relative">
    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      id="full_address"
      placeholder="House No, Street, City"
      className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
      value={form.full_address}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          full_address: e.target.value,
        }))
      }
      disabled={loading}
    />
  </div>
</div>

{/* Address (Place name only) */}
<div className="space-y-2">
  <Label htmlFor="address" className="text-sm font-medium">
    Address (Place Name)
  </Label>
  <div className="relative">
    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      id="address"
      placeholder="e.g., New Baneshwor, Maitidevi"
      className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
      value={form.address}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          address: e.target.value,
        }))
      }
      disabled={loading}
    />
  </div>
</div>


              {/* Role (read-only) */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">Role</Label>
                <div className="text-sm text-gray-700">{form.user_role || "—"}</div>
              </div>

              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg h-12"
                onClick={handleSave}
                disabled={loading || saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Profile Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
