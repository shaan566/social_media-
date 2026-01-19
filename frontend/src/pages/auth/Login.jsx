import React, { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { MdOutlineMailOutline } from "react-icons/md"
import { GoLock } from "react-icons/go"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FloatingDecorations from "./../../common/FloatingDecorations"
import { loginUser } from "./../../services/authServices"

// ✅ Validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setServerError("")
    try {
      await loginUser(data)
      alert("You are login user")
      navigate("/dashboard")
    } catch (err) {
      setServerError(err.message || "Invalid email or password")
    }
  }

  return (
    <div className="flex flex-col items-center py-10 px-20 gap-3">
      <h1 className="text-black text-3xl">Log in to your account</h1>
      <p className="text-gray-600">Welcome back! Please enter your details.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-96"
      >
        {/* Email */}
        <label className="label">Email</label>
        <div className="relative">
          <MdOutlineMailOutline
            className="absolute left-3 top-2.5 text-gray-600"
            size={20}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md p-2 px-10 w-full"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password */}
        <label className="label">Password</label>
        <div className="relative">
          <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md p-2 px-10 w-full"
            {...register("password")}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {serverError && (
          <p className="text-red-600 text-sm">{serverError}</p>
        )}

        {/* Forgot */}
       <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    
                    {...register("rememberMe")}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm font-medium hover:underline"
                  
                >
                  Forgot password?
                </Link>
              </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium hover:underline"
                    style={{ color: "#232323" }}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
      </form>

      <div className="hidden md:block">
        <FloatingDecorations side="both" />
      </div>
    </div>
  )
}

export default Login
