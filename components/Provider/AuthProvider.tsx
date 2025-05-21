// components/providers/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { NestAuthProvider } from "./useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>
          <NestAuthProvider>
            {children}
          </NestAuthProvider>
          </SessionProvider>;
}