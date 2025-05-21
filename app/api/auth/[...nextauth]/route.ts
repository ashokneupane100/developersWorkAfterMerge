import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@/utils/supabase/server";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid email profile"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = createClient();
          
          // Sign in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data?.user) {
            console.error("Auth error:", error);
            return null;
          }
          
          // Check if email is verified in our users table
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email_verified, full_name, avatar_url')
            .eq('id', data.user.id)
            .single();
            
          if (userError) {
            console.error("User query error:", userError);
            return null;
          }
          
          // If email not verified, don't allow login
          if (!userData.email_verified) {
            console.log("Email not verified for user:", data.user.email);
            throw new Error("Please verify your email before logging in");
          }

          // Return user with email_verified property to match NextAuth User type
          return {
            id: data.user.id,
            email: data.user.email,
            name: userData.full_name || data.user.email,
            image: userData.avatar_url,
            email_verified: userData.email_verified,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
  }),
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign In Callback Debug:", {
        user: JSON.stringify(user, null, 2),
        account: JSON.stringify(account, null, 2),
        profile: JSON.stringify(profile, null, 2)
      });

      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          const supabase = createClient();
          
          // Ensure comprehensive user creation/update
          const { data: existingUser, error: queryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (queryError && queryError.code !== 'PGRST116') {
            console.error("User query error:", queryError);
            return false;
          }
          
          // Upsert user with more detailed information
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id || '',
              full_name: (user.name || profile?.name || '').toString(),
              email: user.email || '',
              avatar_url: user.image|| null,
              email_verified: true
            }, { 
              onConflict: 'id' 
            });
          
          if (upsertError) {
            console.error("Upsert error:", upsertError);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Comprehensive sign-in error:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback Debug:", {
        token: JSON.stringify(token, null, 2),
        user: JSON.stringify(user, null, 2),
        account: JSON.stringify(account, null, 2),
        profile: JSON.stringify(profile, null, 2)
      });

      // Capture more information in the token
      if (account?.provider === "google" || account?.provider === "facebook") {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.email_verified = user.email_verified;
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback Debug:", {
        session: JSON.stringify(session, null, 2),
        token: JSON.stringify(token, null, 2)
      });

      // Populate session with token information
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.email_verified = token.email_verified as boolean;
      }

      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("Sign In Event:", JSON.stringify(message, null, 2));
    },
    async session(message) {
      console.log("Session Event:", JSON.stringify(message, null, 2));
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/verify-otp",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  // Enable debug logging
  debug: true,
});

export { handler as GET, handler as POST };