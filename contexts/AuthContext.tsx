"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { User, Session, Provider } from "@supabase/supabase-js";

// Define the profile type
interface Profile {
  id?: string;
  user_id: string;
  user_role?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: any
  ) => Promise<{ data: any; error: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  signInWithOAuth: (
    provider: Provider,
    options?: any
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isAgent: () => boolean;
  isBuyer: () => boolean;
  supabase: any;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signInWithOAuth: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  hasRole: () => false,
  isAdmin: () => false,
  isAgent: () => false,
  isBuyer: () => false,
  supabase: createClient(),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  const supabase = createClient();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from our profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    metadata: any = {}
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in successfully!");
      return { data, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error?.message || "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with OAuth (Google, etc.)
  const signInWithOAuth = async (provider: Provider, options: any = {}) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...options,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error("OAuth sign in error:", error);
      toast.error(error?.message || "Failed to sign in with OAuth");
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success("Signed out successfully!");

      return { error: null };
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error?.message || "Failed to sign out");
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent!");
      return { error: null };
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error?.message || "Failed to send reset email");
      return { error };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      return { error: null };
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error?.message || "Failed to update password");
      return { error };
    }
  };

  // Update profile
  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchUserProfile(user.id);
      toast.success("Profile updated successfully!");

      return { error: null };
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.message || "Failed to update profile");
      return { error };
    }
  };

  // Check if user has specific role
  const hasRole = (role: string) => {
    return profile?.user_role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole("Admin");
  };

  // Check if user is agent
  const isAgent = () => {
    return hasRole("Agent");
  };

  // Check if user is buyer
  const isBuyer = () => {
    return hasRole("Buyer");
  };

  const value = {
    // State
    user,
    profile,
    session,
    loading,

    // Auth functions
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,

    // Helper functions
    hasRole,
    isAdmin,
    isAgent,
    isBuyer,

    // Supabase client for direct access if needed
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
