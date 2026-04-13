import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { registerUser } from "./../../services/authServices";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter valid email"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain A-Z, a-z, 0-9"),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "Accept terms" }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SignUp() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("otpEmail", data.email);
      navigate("/otp");
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left */}
      <div className="w-full max-w-md flex flex-col justify-center px-8 lg:px-12">
        <h1 className="text-2xl font-extrabold mb-8">Schedly</h1>

        <h2 className="text-3xl font-bold mb-2">Create account</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Already have an account?{' '}
          <span
            className="underline font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Username"
              {...register("name")}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <MdOutlineMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="you@example.com"
              {...register("email")}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black"
            />
            {(errors.email || serverError) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email?.message || serverError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <GoLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPw ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <GoLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showCPw ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowCPw(!showCPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCPw ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="accent-green-300 mt-1"
            />
            <span className="text-gray-600">
              I agree to{' '}
              <span className="font-semibold underline">Terms</span> and{' '}
              <span className="font-semibold underline">Privacy</span>
            </span>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-500">
              {errors.agreeToTerms.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-300 border-2 border-black rounded-lg font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Right */}
     <div className="hidden lg:flex flex-1 p-6">
        <div className="w-full bg-blue-300 rounded-3xl p-12 relative overflow-hidden flex flex-col justify-center">
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
            {["No credit card needed. Free forever.", "Connect your all favourite accounts", "Know what's actually working"].map((text, i) => (
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