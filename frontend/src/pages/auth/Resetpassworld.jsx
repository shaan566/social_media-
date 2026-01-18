import React from 'react'
import { useState} from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { GoLock } from "react-icons/go"
import FloatingDecorations from "./../../common/FloatingDecorations";
import { forgotPassword , verifyOtp, resetPassword , resendOtp} from './../../services/authServices';
import { useRef } from 'react';

const Resetpassworld = () => {
    const [email, setEmail] = useState('');
    const [error, seterror] = useState("")
    const [step , setstep] = useState(1)
    const [otp,setotp] = useState(new Array(6).fill(""))
    const inputRefs = useRef([])
    const [password,setpassword] = useState("")
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const togglePasswordVisibility = () =>
  setShowPassword((prev) => !prev);

const toggleConfirmPasswordVisibility = () =>
  setShowConfirmPassword((prev) => !prev);
    
    const handleChange = (element, index) => {
  if (isNaN(element.value)) return;

  const newOtp = [...otp];
  newOtp[index] = element.value;
  setotp(newOtp);

  if (element.value !== "" && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

const handleKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

  const handleSendotp = async () => {
  try {
    seterror("");

    if (!email) {
      return seterror("Please enter your email");
    }

    await forgotPassword({
      email: email
    });
    setstep(2)  


    alert("OTP sent to your email")

  } catch (err) {
    console.log(err);
    seterror(err.response?.data?.message || "Something went wrong");
  }
};

const handleVerifyOtp = async () => {

  try{

    seterror("")

    if(!otp) return seterror("Please Enter OTP ")

    const otpValue = otp.join("");
    // console.log("otp",otpValue)
    if (otpValue.length !== 6) {
      return seterror("Please enter complete 6-digit OTP");
    }
    await verifyOtp({
      email:email,
      otp:otpValue
    }) 
    setstep(3)
  }catch(err){
    console.log(err)
     seterror(err.response?.data?.message || "Invalid OTP")
  }
}

const handleResetPassword = async () => {
  try {
    seterror("");

    if (!newPassword || !confirmPassword) {
      return seterror("Both password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return seterror("Passwords do not match");
    }

    await resetPassword({
      email,
      password: newPassword,
    });

    alert("Password reset successful");
    navigate("/login");

  } catch (err) {
    console.log(err);
    seterror(err.response?.data?.message || "Password reset failed");
  }
};

const handleResendOtp = async () => {
  try {
    seterror("");

    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail) return seterror("Email not found. Please signup again.");

    // Only resend OTP, do NOT send old otpValue
    await resendOtp({ email: storedEmail });

    // Reset input fields
    // ✅ Clear OTP (force new reference)
    setotp(() => ["", "", "", "", "", ""]);

    // ✅ Delay focus slightly (VERY IMPORTANT)
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);

    alert("New OTP sent to your email");
  } catch (err) {
    seterror(err.response?.data?.message || "Failed to resend OTP");
  }
};


return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="flex flex-col items-center gap-6 w-full max-w-md">

      {/* TITLE */}
      <h1 className="text-black text-3xl font-semibold">
        {step === 1 && "Reset your password"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Set New Password"}
      </h1>

      {/* SUBTITLE */}
      <p className="text-gray-600 text-center">
        {step === 1 && "Enter your email address and we'll send you an OTP."}
        {step === 2 && "Enter the OTP sent to your email."}
        {step === 3 && "Create a new password for your account."}
      </p>

      {/* CARD */}
      <div className="flex flex-col gap-4 w-full">

        {/* STEP 1 – EMAIL */}
        {step === 1 && (
          <>
            <label className="text-black text-lg font-medium">Email</label>
            <div className="relative">
              <MdOutlineMailOutline
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                size={25}
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 rounded-md p-2 px-10 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 text-white rounded-md p-2 mt-2 hover:bg-blue-600"
              onClick={handleSendotp}
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 – OTP */}
        {step === 2 && (
          <>
            {step === 2 && (
              <div className="flex flex-col items-center gap-6">

                <h1 className="text-black text-3xl font-semibold">
                  Enter OTP
                </h1>

                <p className="text-gray-600 text-center max-w-sm">
                  Please enter the One-Time Password (OTP) sent to your email address.
                </p>

                <div className="flex flex-col gap-4 items-center">
                  <label className="text-black text-lg font-medium">
                    OTP Code
                  </label>

                  <div className="flex gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleResendOtp}
                    className="text-blue-500 hover:underline self-start"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="bg-blue-500 text-white rounded-md p-2 mt-4 text-lg hover:bg-blue-600 w-full"
                >
                  Validate OTP
                </button>

                {error && (
                  <p className="text-red-600 text-sm text-center">
                    {error}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* STEP 3 – PASSWORD */}
       {step === 3 && (
          <>
            <h1 className="text-black text-3xl font-semibold">
              Reset Password
            </h1>

            <p className="text-gray-600 text-center">
              Enter your new password and confirm it below.
            </p>

            {/* New Password */}
            <label className="label">New Password</label>
            <div className="relative">
              <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="border border-gray-300 rounded-md p-2 px-10 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <label className="label">Confirm Password</label>
            <div className="relative">
              <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="border border-gray-300 rounded-md p-2 px-10 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              className="bg-green-500 text-white rounded-md p-2 mt-4 hover:bg-green-600 w-full"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}


        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {/* BACK TO LOGIN */}
        {step === 1 && (
          <div className="flex justify-center mt-6">
            <h3 className="text-gray-600">
              Remember your password?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Back to login
              </span>
            </h3>
          </div>
        )}
      </div>

      {/* DECORATION */}
      <div className="hidden md:block">
        <FloatingDecorations side="both" />
      </div>
    </div>
  </div>
);


    
  
}

export default Resetpassworld
