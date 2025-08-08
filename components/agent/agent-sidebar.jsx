
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { createClient } from "@/utils/supabase/client";
import {
  BarChart3, CheckCircle, Clock, XCircle, Settings, LogOut, Home, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/agentui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/agentui/avatar";

const menuItems = [
  { title: "Overview", url: "/agent", icon: BarChart3 },
  { title: "Approved Listings", url: "/agent/approved", icon: CheckCircle },
  { title: "Pending Listings", url: "/agent/pending", icon: Clock },
  { title: "Rejected Listings", url: "/agent/rejected", icon: XCircle },
  { title: "Settings", url: "/agent/settings", icon: Settings },
];

export default function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [agent, setAgent] = useState({
    full_name: "",
    user_role: "",
    email: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      const supabase = createClient();

      try {
        // 1) Resolve userId: prefer cookie, else current auth user
        let userId = Cookies.get("agent_id");
        if (!userId) {
          const { data, error } = await supabase.auth.getUser();
          if (error) console.warn("auth.getUser error:", error.message);
          userId = data?.user?.id || null;
        }

        console.log("[Sidebar] Resolved agent_id:", userId);

        if (!userId) {
          console.warn("[Sidebar] No agent_id found in cookies or auth session.");
          return;
        }

        // 2) Fetch full profile for that id
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(`
            id,
            user_id,
            full_name,
            email,
            avatar_url,
            user_role,
            email_verified,
            password_updated_at,
            latitude,
            longitude,
            location_updated_at,
            location_permission,
            full_address,
            address,
            phone,
            is_number_verified,
            created_at,
            updated_at,
            auth_provider
          `)
          .eq("id", userId) // if your PK is user_id, switch to .eq("user_id", userId)
          .single();

        if (profileError) {
          console.error("[Sidebar] Profile fetch error:", profileError.message);
          return;
        }

        console.log("[Sidebar] Full profile fetched:", profile);

        // 3) Hydrate UI
        setAgent({
          full_name: profile.full_name || "",
          user_role: profile.user_role || "",
          email: profile.email || "",
          avatar_url: profile.avatar_url || "",
        });
      } catch (err) {
        console.error("[Sidebar] Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, []);
//on logout clear all cookies and redirect to login

  // const handleLogout = async () => {
  //   const supabase = createClient();
  //   await supabase.auth.signOut();

  //   ["agent_token", "agent_role", "agent_id", "agent_email", "agent_name"].forEach((k) =>
  //     Cookies.remove(k)
  //   );

  //   router.push("/login");
  //   //set timeout to location reload
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 2000);
    
  // };


  const handleLogout = async () => {
  const supabase = createClient();

  try {
    await supabase.auth.signOut();
  } catch {}

  // Best-effort client removal: must match how you set them (path/domain)
  const opts = { path: "/" }; // add { domain: ".yourdomain.com" } in prod if you set it that way
  ["agent_token","agent_role","agent_id","agent_email","agent_name"].forEach((k) =>
    Cookies.remove(k, opts)
  );

  // Clear any Supabase localStorage artifacts
  try {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("sb-")) localStorage.removeItem(k);
    });
  } catch {}

  // Authoritative server-side clear (for HttpOnly cookies)
  await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });

  // Navigate & hard refresh so middleware sees cleared cookies immediately
  router.replace("/login");
  window.location.replace("/login");
};


  return (
    <Sidebar className="border-r-0 bg-white md:bg-sidebar md:text-sidebar-foreground">
      <SidebarHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start mb-4 text-white hover:bg-white/20 border-white/20"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Main Site
        </Button>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agent Portal</h2>
            <p className="text-blue-100 text-sm">Real Estate Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 p-3 bg-white/10 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={agent.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-white/20 text-white">
              {(agent.full_name || agent.email || "A").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">
              {loading ? "Loading…" : agent.full_name || "Agent"}
            </p>
            <p className="text-blue-100 text-xs">
              {loading ? "" : agent.user_role || "—"}
            </p>
          </div>
        </div>
      </SidebarHeader>

     <SidebarContent className="px-4 py-6 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-12 px-4 rounded-xl hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-blue-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-white md:bg-gradient-to-r md:from-red-50 md:to-red-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 rounded-xl hover:bg-red-100">
              <button
                className="w-full flex items-center text-red-600 hover:text-red-700 font-medium"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
