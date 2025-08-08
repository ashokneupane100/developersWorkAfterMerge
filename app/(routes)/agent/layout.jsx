import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/agentui/sidebar";
import AgentSidebar from "@/components/agent/agent-sidebar";
import { Toaster } from "@/components/agentui/toaster";
import "./agent.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* critical for responsive behavior */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <SidebarProvider>
          <AgentSidebar />

          <main className="flex-1 flex min-h-screen flex-col bg-slate-50">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm sticky top-0 z-40">
              <SidebarTrigger className="h-8 w-8 p-0" />
              <h1 className="font-semibold text-gray-900">Agent Dashboard</h1>
              <div className="w-8" />
            </div>

            {/* Content */}
            <div className="flex-1">
              
              <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-8 py-4 md:py-8">
                {children}
              </div>
            </div>
          </main>
        </SidebarProvider>

        <Toaster />
      </body>
    </html>
  );
}
