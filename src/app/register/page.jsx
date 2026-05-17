"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { registerUser } from "@/services/authService";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3) newErrors.username = "Min. 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Min. 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      login(result.data.user, result.data.token);
      toast.success("Welcome to ANIMEX, " + result.data.user.username + "!");
      router.push("/");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch {
      toast.error("Google sign up failed. Try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-5 py-20">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tighter" style={{ color: "#e50914" }}>
            ANIMEX
          </Link>
          <p className="text-sm mt-2" style={{ color: "#af8782" }}>Create your free account</p>
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
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] mb-6"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#ffdad5",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: googleLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            {googleLoading ? (
              <span>Redirecting to Google...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#5e3f3b" }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Username
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: errors.username ? "#ff4444" : "rgba(255,255,255,0.1)",
                }}
              >
                <User size={18} style={{ color: "#af8782", flexShrink: 0 }} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="coolwatcher99"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: "#ffdad5" }}
                />
              </div>
              {errors.username && (
                <p className="text-xs mt-1.5" style={{ color: "#ff4444" }}>{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Email
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Password
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
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
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#ffdad5" }}>
                Confirm Password
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: errors.confirmPassword ? "#ff4444" : "rgba(255,255,255,0.1)",
                }}
              >
                <Lock size={18} style={{ color: "#af8782", flexShrink: 0 }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: "#ffdad5" }}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs mt-1.5" style={{ color: "#ff4444" }}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] mt-1"
              style={{
                background: loading ? "rgba(229,9,20,0.5)" : "#e50914",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-6" style={{ color: "#af8782" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#e50914" }}>
              Sign In
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center text-sm mt-6">
          <Link href="/" className="hover:underline" style={{ color: "#af8782" }}>
            Back to Home
          </Link>
        </p>
      </div>
    </main>
  );
}