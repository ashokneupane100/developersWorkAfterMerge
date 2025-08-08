"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createClient } from "@/utils/supabase/client";
import {
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  LogOut,
  Home,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/agentui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/agentui/avatar";

const menuItems = [
  { title: "Overview", url: "/agent", icon: BarChart3 },
  { title: "Approved Listings", url: "/agent/approved", icon: CheckCircle },
  { title: "Pending Listings", url: "/agent/pending", icon: Clock },
  { title: "Rejected Listings", url: "/agent/rejected", icon: XCircle },
  { title: "Settings", url: "/agent/settings", icon: Settings },
];

export default function AgentSidebar() {
  const pathname = usePathname();
  const [agent, setAgent] = useState({
    full_name: "",
    user_role: "",
    email: "",
  });

  const router = useRouter();

  const handleLogout = () => {
    // Clear all related cookies
    Cookies.remove("agent_token");
    Cookies.remove("agent_role");
    Cookies.remove("agent_id");
    Cookies.remove("agent_email");
    Cookies.remove("agent_name");
    Cookies.clear();
    // Redirect to login
    router.push("/login/agent");
  };
  useEffect(() => {
    const fetchAgent = async () => {
      const supabase = createClient();
      const userId = Cookies.get("agent_id");

      if (!userId) return;

      // const { data: profile, error: profileError } = await supabase
      //   .from("profiles")
      //   .select("user_role, full_name, email")// userId = auth.user.id
      //   .eq("user_id", userId)
      //   .single();

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", auth.user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch agent profile:", profileError.message);
        return;
      }

      setAgent(data);
    };

    fetchAgent();
  }, []);

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start mb-4 text-white hover:bg-white/20 border-white/20"
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
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-white/20 text-white">
              {agent.full_name ? agent.full_name.charAt(0) : "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">
              {agent.full_name || "Agent"}
            </p>
            <p className="text-blue-100 text-xs">
              {agent.user_role || "Loading..."}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
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

      <SidebarFooter className="p-4 border-t bg-gradient-to-r from-red-50 to-red-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 rounded-xl hover:bg-red-100"
            >
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
