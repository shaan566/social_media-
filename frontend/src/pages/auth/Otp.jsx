import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "./../../services/authServices";

export default function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);
  const [timeleft , setTimeLeft] = useState(600)
  

  const handleChange = (element, index) => {
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

  const handleVerify = async () => {
    setError("");
    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail)
      return setError("Email not found. Please sign up again.");

    const otpValue = otp.join("");
    if (otpValue.length !== 6)
      return setError("Please enter the complete 6-digit OTP");

    try {
      setIsLoading(true);
      await verifyOtp({ email: storedEmail, otp: otpValue });
      localStorage.removeItem("otpEmail");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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


  const handleResend = async () => {
    setError("");
    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail)
      return setError("Email not found. Please sign up again.");

    try {
      await resendOtp({ email: storedEmail });
      setOtp(new Array(6).fill(""));
      setResent(true);
      setTimeLeft(600);
      setTimeout(() => setResent(false), 3000);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

   const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const filledCount = otp.filter((v) => v !== "").length;

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left */}
      <div className="w-full max-w-md flex flex-col justify-center px-8 lg:px-12">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
          Schedly
        </h1>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Check your email
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          We've sent a 6-digit code to your email address.
        </p>

        {/* OTP */}
        <div className="mb-7">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            OTP Code
          </label>

          <div className="flex gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition
                ${data ? "border-black bg-yellow-50" : "border-gray-200 bg-gray-50"}
                focus:border-purple-400 focus:bg-purple-300-50`}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all"
              style={{ width: `${(filledCount / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {resent && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-300 rounded-lg text-sm text-green-700 font-semibold">
            ✓ New OTP sent!
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading || filledCount < 6}
          className="w-full py-3 bg-purple-300 border-2 border-black rounded-lg font-extrabold text-black text-sm disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Validate OTP"}
        </button>

        <p className="text-sm mt-2 text-gray-600 text-center">
  {timeleft > 0 ? (
    <>OTP expires in <span className="font-bold">{formatTime(timeleft)}</span></>
  ) : (
    <span className="text-red-500 font-bold">OTP Expired ❌</span>
  )}
</p>

        <p className="text-xs text-gray-500 text-center mt-4">
          Didn’t receive the code?{' '}
          <button
            onClick={handleResend}
            // className="underline font-semibold text-gray-900"
             className={`underline font-semibold ${
      timeleft > 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-900"
    }`}
          >
            Resend OTP
          </button>
        </p>
      </div>

      {/* Right */}
      <div className="hidden lg:flex flex-1 p-6">
        <div className="w-full bg-purple-300 rounded-3xl p-12 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute w-72 h-72 bg-black/5 rounded-full -top-20 -right-20"></div>
          <div className="absolute w-52 h-52 bg-black/5 rounded-full -bottom-16 -left-16"></div>

          {/* <span className="bg-white border-2 border-black px-5 py-1 rounded-full text-xs font-extrabold w-fit mb-6">
            VERIFY
          </span> */}

          <h2 className="text-4xl font-extrabold text-black mb-3 max-w-sm">
            Almost there — confirm your identity
          </h2>

          <p className="text-black/60 text-sm mb-8 max-w-xs">
            This step keeps your account safe and secure.
          </p>

          <div className="space-y-3">
            {["Never share OTP", "Check spam folder", "Expires in 10 min"].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-black/10 px-4 py-2 rounded-lg"
              >
                <span>🔒</span>
                <span className="text-sm font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}