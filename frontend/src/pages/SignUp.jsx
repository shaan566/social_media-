import React, { useState } from "react"
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa"
import { MdOutlineMailOutline } from "react-icons/md"
import { GoLock } from "react-icons/go"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FloatingDecorations from "../common/FloatingDecorations"
import { registerUser } from "../services/authServices.js"

// ✅ Validation Schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase and number"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({
        message: "You must agree to the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ✅ React Hook Form 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
    
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  
    
  // ✅ Real submit handler
  const onSubmit = async (data) => {
    //  console.log("Form Data Submitted:", data);
    setServerError("");
    try {
      
      await registerUser({
        name : data.name,
        email:data.email,
        password:data.password
      })
      // console.log("Registration successful:", response)
      
      navigate("/otp")
    } catch (error) {
      console.error(error)
      setServerError(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center py-10 px-20 gap-3">
      <h1 className="text-black text-3xl">Create your account</h1>

      <p className="text-gray-600">
        Already have an account?
        <span
          className="text-blue-500 hover:underline cursor-pointer ml-1"
          onClick={() => navigate("/login")}
        >
          Sign in
        </span>
      </p>

      {/* ✅ FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-96"
      >
        {/* Name */}
        <label className="label">Username</label>
        <div className="relative">
          <FaUser className="absolute left-3 top-2.5 text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Enter your username"
            className="border border-gray-300 rounded-md p-2 px-10 w-full"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

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
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
          {serverError && (
            <p className="text-red-600 text-sm">
              {serverError}
            </p>
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
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <label className="label">Confirm Password</label>
        <div className="relative">
          <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="border border-gray-300 rounded-md p-2 px-10 w-full"
            {...register("confirmPassword")}
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Terms */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            {...register("agreeToTerms")}
          />
          <span className="text-gray-600 text-sm">
            I agree to the Terms and Conditions and Privacy Policy
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="hidden md:block">
        <FloatingDecorations side="both" />
      </div>
    </div>
  )
}

export default SignUp
