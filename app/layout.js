import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./Provider.tsx";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import AuthProvider from "@/components/Provider/AuthProvider";
import { HeroUIProvider } from "@heroui/react";


const inter = Outfit({ subsets: ["latin"] });

// Moved to separate metadata.js
export { metadata } from './metadata';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className}`}>
        <AuthProvider>
            <HeroUIProvider>
              <Provider>
                <Toaster />
                {children}
              </Provider>
            </HeroUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}