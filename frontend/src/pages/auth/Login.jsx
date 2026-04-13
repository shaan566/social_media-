import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "./../../services/authServices";

// Validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await loginUser(data);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form */}
      <div className="w-full max-w-md flex flex-col justify-center px-8 lg:px-12">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Schedly</h1>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Log in
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          New to the app?{' '}
          <Link to="/signup" className="underline font-semibold">
            Create an account
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email
            </label>
            <div className="relative">
              <MdOutlineMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black outline-none text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-900">
                Password
              </label>
              <Link
                to="/reset-password"
                className="text-sm text-blue-600 underline"
              >
                Forgot Passworld
              </Link>
            </div>

            <div className="relative">
              <GoLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="accent-yellow-400 cursor-pointer"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </div>

          {serverError && (
            <p className="text-sm text-red-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-300 border-2 border-black rounded-lg font-extrabold text-black text-sm hover:opacity-90 transition"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="underline font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 p-6">
        <div className="w-full bg-green-300 rounded-3xl p-12 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute w-72 h-72 bg-black/5 rounded-full -top-20 -right-20"></div>
          <div className="absolute w-52 h-52 bg-black/5 rounded-full -bottom-16 -left-16"></div>

          <span className="bg-white border-2 border-black px-5 py-1 rounded-full text-xs font-extrabold w-fit mb-6">
            SECURE
          </span>

          <h2 className="text-4xl font-extrabold text-black leading-tight mb-3 max-w-sm">
            Everything you need, all in one place
          </h2>

          <p className="text-black/60 text-sm mb-8 max-w-xs">
            Sign in to manage your work, track progress and collaborate with your team.
          </p>

          <div className="space-y-3">
            {["Schedule once, post everywhere", "Write captions in seconds with AI", "See your whole month at a glance"].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-black/10 px-4 py-2 rounded-lg"
              >
                <span className="font-bold">✦</span>
                <span className="text-sm font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}