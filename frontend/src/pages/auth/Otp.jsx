import React, { useState, useRef } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import FloatingDecorations from "./../../common/FloatingDecorations";
import { verifyOtp , resendOtp } from './../../services/authServices';
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error,setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate()
  
 const [email,setemail] = useState(() => localStorage.getItem("otpEmail"));



  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];

    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

 const handleVerifyOtp = async () => {
  try {
    
    setError("");   

    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail) {
      return setError("Email not found. Please signup again.");
    }

    const otpValue = otp.join("");
    // console.log("otp",otpValue)
    if (otpValue.length !== 6) {
      return setError("Please enter complete 6-digit OTP");
    }

    const responce =await verifyOtp({
      email: storedEmail,
      otp: otpValue,
    });

    console.log("ss",responce)
    localStorage.removeItem("otpEmail");
    setemail(null);
    alert("OTP verified successfully!");

    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Invalid OTP");
  }
};
//  console.log("OTP array:", otp);
// console.log("OTP string:", otp.join(""));

const handleResendOtp = async () => {
  try {
    setError("");

    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail) return setError("Email not found. Please signup again.");

    // Only resend OTP, do NOT send old otpValue
    await resendOtp({ email: storedEmail });

    // Reset input fields
    // ✅ Clear OTP (force new reference)
    setOtp(() => ["", "", "", "", "", ""]);

    // ✅ Delay focus slightly (VERY IMPORTANT)
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);

    alert("New OTP sent to your email");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to resend OTP");
  }
};


const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className='flex flex-col items-center py-30 px-20 gap-6'>
      <h1 className='text-black text-3xl font-semibold'>Enter OTP</h1>
      <p className='text-gray-600 text-center max-w-sm'>
        Please enter the One-Time Password (OTP) sent to your email address.
      </p>

      <div className='flex flex-col gap-4 items-center'>
        <label className='text-black text-lg font-medium'>OTP Code</label>
        
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
       
         
         <div className="flex justify-start">
            <button
            onClick = {handleResendOtp}
             className="text-blue-500 hover:underline">
                Resend OTP
            </button>
          </div>
        
      </div>

      {/* Global Icon / Decorative Section */}
     
        {/* <AiOutlineGlobal size={20}/>
        <span className="text-sm">Secure Global Verification</span> */}
            <button 
            onClick={handleVerifyOtp}
            className='bg-blue-500 h-full w-50 text-white rounded-md p-2 mt-4 text-xl hover:bg-blue-600'
            // onClick={() => navigate('/otp')}
            >
            Validate OTP
            </button>

            {error && (
              <p className = "text-red-600 text-sm">
            {error}
              </p>
            )}
      

      {/* Floating Decorations placeholder */}
      <div className='hidden md:block'>
        <FloatingDecorations side="both" />
      </div>
    </div>
  );
};

export default OTP;