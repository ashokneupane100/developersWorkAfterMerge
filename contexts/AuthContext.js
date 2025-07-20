"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

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
  const fetchUserProfile = async (userId) => {
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
  const signUp = async (email, password, metadata = {}) => {
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
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Signed in successfully!");
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with OAuth (Google, etc.)
  const signInWithOAuth = async (provider, options = {}) => {
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
    } catch (error) {
      console.error("OAuth sign in error:", error);
      toast.error(error.message || "Failed to sign in with OAuth");
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
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent!");
      return { error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send reset email");
      return { error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      return { error: null };
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
      return { error };
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
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
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      return { error };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
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
