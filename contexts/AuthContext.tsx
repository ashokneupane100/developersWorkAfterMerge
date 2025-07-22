"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  email_verified: boolean;
  user_role: string;
  auth_provider: string;
  latitude?: number;
  longitude?: number;
  location_updated_at?: string;
  location_permission?: boolean;
  full_address?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata?: any
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (
    provider: "google" | "facebook"
  ) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // Memoized fetch user profile function
  const fetchUserProfile = useCallback(
    async (userId: string) => {
      try {
        // Check cache first
        const cachedProfile = sessionStorage.getItem(`profile_${userId}`);
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          const cacheTime = new Date(parsed.timestamp).getTime();
          const now = Date.now();
          // Cache for 5 minutes
          if (now - cacheTime < 5 * 60 * 1000) {
            setProfile(parsed.data);
            return;
          }
        }

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
          // Cache the profile
          sessionStorage.setItem(
            `profile_${userId}`,
            JSON.stringify({
              data,
              timestamp: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    },
    [supabase]
  );

  // Initialize auth state with optimization
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitialized) return;

      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          setIsInitialized(true);
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
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes with debouncing
    let timeoutId: NodeJS.Timeout;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Clear previous timeout
      clearTimeout(timeoutId);

      // Debounce auth state changes
      timeoutId = setTimeout(async () => {
        console.log("Auth state changed:", event, session?.user?.email);

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          // Clear cached profile
          if (user?.id) {
            sessionStorage.removeItem(`profile_${user.id}`);
          }
        }
        setLoading(false);
      }, 100); // 100ms debounce
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile, isInitialized, user?.id]);

  // Optimized sign up function
  const signUp = useCallback(
    async (email: string, password: string, metadata: any = {}) => {
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
    },
    [supabase]
  );

  // Optimized sign in function
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);

        // Pre-validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        console.log("Signing in user:", email);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

        if (error) {
          console.error("Sign in error:", error);

          // Provide user-friendly error messages
          let userMessage = "Failed to sign in";
          if (error.message.includes("Invalid login credentials")) {
            userMessage = "Invalid email or password";
          } else if (error.message.includes("Email not confirmed")) {
            userMessage = "Please verify your email before signing in";
          } else if (error.message.includes("Too many requests")) {
            userMessage = "Too many attempts. Please wait a moment";
          }

          throw new Error(userMessage);
        }

        if (data.user) {
          // Clear any cached profile for this user
          sessionStorage.removeItem(`profile_${data.user.id}`);

          // Fetch fresh profile data
          await fetchUserProfile(data.user.id);
        }

        toast.success("Signed in successfully!");
        return { data, error: null };
      } catch (error: any) {
        console.error("Sign in error:", error);
        toast.error(error?.message || "Failed to sign in");
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [supabase, fetchUserProfile]
  );

  // Optimized sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      // Clear cached data
      if (user?.id) {
        sessionStorage.removeItem(`profile_${user.id}`);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);

      toast.success("Signed out successfully!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }, [supabase, user?.id]);

  // Optimized OAuth sign in
  const signInWithOAuth = useCallback(
    async (provider: "google" | "facebook") => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        return { data, error: null };
      } catch (error: any) {
        console.error(`${provider} sign in error:`, error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      session,
      signIn,
      signUp,
      signOut,
      signInWithOAuth,
    }),
    [user, profile, loading, session, signIn, signUp, signOut, signInWithOAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
