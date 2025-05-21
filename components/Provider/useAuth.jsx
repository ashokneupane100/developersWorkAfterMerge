"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { createClient } from '@/utils/supabase/client';

const AuthContext = createContext();

export function NestAuthProvider({ children }) {
  // NextAuth state
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  
  // Supabase state
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [supabaseSession, setSupabaseSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Combined state
  const [user, setUser] = useState(null);
  const [authProvider, setAuthProvider] = useState(null); // 'nextauth' or 'supabase'
  
  // Initialize and listen to Supabase auth changes
  useEffect(() => {
    const supabase = createClient();
    
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSupabaseSession(session);
          setSupabaseUser(session?.user ?? null);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initSession();
  }, []);
  
  // Combine authentication states
  useEffect(() => {
    if (nextAuthSession?.user) {
      setUser(nextAuthSession.user);
      setAuthProvider('nextauth');
      setLoading(false);
    } else if (supabaseUser) {
      // Transform Supabase user to match NextAuth user format
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '',
        email: supabaseUser.email,
        image: supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || '')}&background=AFE1AF&color=ffff`
      });
      setAuthProvider('supabase');
      setLoading(false);
    } else {
      setUser(null);
      setAuthProvider(null);
      setLoading(nextAuthStatus === "loading");
    }
  }, [nextAuthSession, supabaseUser, nextAuthStatus]);
  
  // Sign out function that handles both auth systems
  const signOut = async (options = {}) => {
    const { callbackUrl = '/' } = options;
    
    if (authProvider === 'nextauth') {
      await nextAuthSignOut({ callbackUrl });
    } else if (authProvider === 'supabase') {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = callbackUrl;
    }
  };
  
  // Special signIn methods to maintain NextAuth compatibility
  const signIn = async (provider, options = {}) => {
    if (provider === 'google') {
      return signInWithGoogle(options);
    } else if (provider === 'facebook') {
      return signInWithFacebook(options);
    } else {
      return nextAuthSignIn(provider, options);
    }
  };
  
  // Google sign in with Supabase
  const signInWithGoogle = async (options = {}) => {
    const supabase = createClient();
    
    const redirectTo = process.env.NEXT_PUBLIC_SITE_URL 
      || `${window.location.origin}/auth/callback`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
    
    if (data?.url) {
      window.location.href = data.url;
    }
  };
  
  // Facebook sign in with Supabase
  const signInWithFacebook = async (options = {}) => {
  const supabase = createClient();
  
  const redirectTo = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    : `${window.location.origin}/auth/callback`;
  
  console.log("Facebook login redirect URL:", redirectTo);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo,
      scopes: 'email,public_profile',
      queryParams: {
        // Adding a provider hint to help with debugging
        provider: 'facebook'
      }
    }
  });
  
  if (error) {
    console.error("Facebook sign-in error:", error);
    throw error;
  }
  
  if (data?.url) {
    console.log("Redirecting to Facebook OAuth URL:", data.url);
    window.location.href = data.url;
  }
};
  
  // Credential sign in with NextAuth
  const signInWithCredentials = async (email, password, options = {}) => {
    return nextAuthSignIn("credentials", {
      email,
      password,
      redirect: options.redirect ?? false,
      ...options
    });
  };
  
  // Calculate overall authentication status to match NextAuth's useSession format
  const getSessionData = () => {
    // For compatibility with components using useSession directly
    let status = "unauthenticated";
    
    if (loading) {
      status = "loading";
    } else if (user) {
      status = "authenticated";
    }
    
    const session = user ? {
      user,
      expires: supabaseSession?.expires_at ? new Date(supabaseSession.expires_at).toISOString() : 
        (nextAuthSession?.expires || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
    } : null;
    
    return {
      data: session,
      status,
      update: () => Promise.resolve(session)
    };
  };
  
  const value = {
    user,
    session: supabaseSession || nextAuthSession,
    isLoading: loading,
    isAuthenticated: !!user,
    authProvider,
    signOut,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithCredentials,
    // For compatibility with existing components
    getSessionData
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook to override useSession functionality
export const useAuthSession = () => {
  const { getSessionData } = useAuth();
  return getSessionData();
};