"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update field form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat user mulai ngetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validasi form sebelum submit
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const result = await loginUser(formData);

      // Simpan ke Zustand store + localStorage
      login(result.user, result.token);

      toast.success("Welcome back, " + result.user.username + "!");
      router.push("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-5 py-20">

      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tighter" style={{ color: "#e50914" }}>
            ANIMEX
          </Link>
          <p className="text-sm mt-2" style={{ color: "#af8782" }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(46,26,24,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Email
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: errors.email ? "#ff4444" : "rgba(255,255,255,0.1)",
                }}
              >
                <Mail size={18} style={{ color: "#af8782", flexShrink: 0 }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: "#ffdad5" }}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1.5" style={{ color: "#ff4444" }}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Password
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: errors.password ? "#ff4444" : "rgba(255,255,255,0.1)",
                }}
              >
                <Lock size={18} style={{ color: "#af8782", flexShrink: 0 }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: "#ffdad5" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: "#af8782" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1.5" style={{ color: "#ff4444" }}>{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
              style={{
                background: loading ? "rgba(229,9,20,0.5)" : "#e50914",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#5e3f3b" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm" style={{ color: "#af8782" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "#e50914" }}
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center text-sm mt-6">
          <Link href="/" className="transition-colors hover:underline" style={{ color: "#af8782" }}>
            Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}