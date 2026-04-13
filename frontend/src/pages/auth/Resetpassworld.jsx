import React, { useState, useRef , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { forgotPassword, verifyOtp, resetPassword, resendOtp } from "./../../services/authServices";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
   const [timeleft , setTimeLeft] = useState(600)

     useEffect(() => {
     const timer = setInterval(() => {
       setTimeLeft((prev) => {
         if (prev <= 1) {
           clearInterval(timer);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
   
     return () => clearInterval(timer);
   }, []);

    const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };


  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && index < 5)
      inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleSendOtp = async () => {
    setError("");
    if (!email) return setError("Please enter your email");
    try {
      setIsLoading(true);
      await forgotPassword({ email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6)
      return setError("Enter complete OTP");
    try {
      setIsLoading(true);
      await verifyOtp({ email, otp: otpValue });
      setStep(3);
    } catch (err) {
      setError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");
    try {
      setIsLoading(true);
      await resetPassword({ email, password: newPassword });
      navigate("/login");
    } catch (err) {
      setError("Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email });
      setOtp(new Array(6).fill(""));
    } catch {
      setError("Resend failed");
    }
  };

  const filledOtp = otp.filter((v) => v !== "").length;

  return (
    <div className="min-h-screen flex justify-center pt-[70px] bg-green-300">
      {/* Left */}
      {/* Card */}
    <div className="w-full  h-full max-w-md max-h-md  bg-white rounded-3xl shadow-xl p-8">
      
      <h1 className="text-2xl font-extrabold mb-6 text-center">
        Schedly
      </h1>

      {/* Step Bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`flex-1 h-1 rounded ${
              n <= step ? "bg-black" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-2 text-center">
        {step === 1 && "Reset password"}
        {step === 2 && "Enter OTP"}
        {step === 3 && "New password"}
      </h2>

      <p className="text-gray-600 mb-6 text-sm text-center">
        {step === 1 && "Enter your email"}
        {step === 2 && "We've sent an OTP to your email. Please check your inbox or spam folder."}
        {step === 3 && "Set a new password"}
      </p>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="relative mb-4">
              <MdOutlineMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full py-3 bg-green-300 border-2 border-black rounded-lg font-bold"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="flex gap-2 mb-4">
              {otp.map((d, i) => (
                <input
                  key={i}
                  maxLength="1"
                  value={d}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-14 text-center border-2 rounded-lg"
                />
              ))}
            </div>
            
        <p className="text-sm mt-2 text-gray-600 text-center">
  {timeleft > 0 ? (
    <>OTP expires in <span className="font-bold">{formatTime(timeleft)}</span></>
  ) : (
    <span className="text-red-500 font-bold">OTP Expired ❌</span>
  )}
</p>
            
            <button
              onClick={handleVerifyOtp}
              disabled={filledOtp < 6}
              className="w-full py-3 bg-green-300 border-2 border-black rounded-lg font-bold disabled:opacity-50"
            >
              Verify OTP
            </button>
            <button onClick={handleResendOtp} className="mt-3 underline text-sm">
              Resend OTP
            </button>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="relative mb-4">
              <GoLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPw ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            <div className="relative mb-4">
              <GoLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCPw ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg"
              />
              <button
                onClick={() => setShowCPw(!showCPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showCPw ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              
              className="w-full py-3 bg-green-300 border-2 border-black rounded-lg font-bold"
            >
              Reset Password
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      
    </div>
  );
}