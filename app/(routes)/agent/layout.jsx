import { Inter } from 'next/font/google';
import { SidebarProvider, SidebarTrigger } from "@/components/agentui/sidebar";
import AgentSidebar from "@/components/agent/agent-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { Toaster } from "@/components/agentui/toaster";
import './agent.css'
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AgentSidebar />
          <main className="flex-1 flex flex-col min-h-screen">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
              <SidebarTrigger className="h-8 w-8 p-0" />
              <h1 className="font-semibold text-gray-900">Agent Dashboard</h1>
              <div className="w-8" /> {/* Spacer */}
            </div>
            <div className="flex-1">
              {children}
            </div>
          </main>
       
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
