"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const handleSubmit = async (e:React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);

  //   try {
  //     // Direct admin login without checking user session
  //     const response = await fetch('/api/admin/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       setError(data.error || 'Login failed');
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Store admin token in localStorage
  //     localStorage.setItem('adminToken', data.token);

  //     // Redirect to admin dashboard
  //     router.push('/admin/');
  //   } catch (error) {
  //     console.error('Authentication error:', error);
  //     setError('An error occurred during authentication');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Authenticate user using Supabase Auth
      const authRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await authRes.json();

      if (!authRes.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // 2. Store token from server
      localStorage.setItem("adminToken", data.token);

      // 3. Redirect only if user is admin (this is already checked by server)
      router.push("/admin/");
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top-left Button */}
      <div className="absolute top-6 left-6">
        
      </div>

      {/* Centered Form */}
      <div className="flex items-center justify-center h-screen px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm transition"
                required
              />
            </div>

            <button
  type="submit"
  disabled={isLoading}
  style={{
    backgroundColor: "#333", 
    color: "#fff",           
    width: "100%",
    padding: "12px 0",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    transition: "background-color 0.3s ease"
  }}
>
  {isLoading ? "Logging in..." : "Log In"}
</button>

          </form>
          {/* Return to Main Site Link */}
<div className="mt-6 text-center">
  <Link
    href="/"
    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
  >
    <ChevronLeft className="h-4 w-4 mr-1" />
    Back to Main Site
  </Link>
</div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
