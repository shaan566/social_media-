import React, { useState, useRef } from 'react';
import { AiOutlineGlobal } from 'react-icons/ai';
import FloatingDecorations from "../common/FloatingDecorations";
import { Verfiyotp } from '../services/authServices';

const OTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

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
            <button className="text-blue-500 hover:underline">
                Resend OTP
            </button>
            </div>
        
      </div>

      {/* Global Icon / Decorative Section */}
     
        {/* <AiOutlineGlobal size={20}/>
        <span className="text-sm">Secure Global Verification</span> */}
            <button 
            className='bg-blue-500 h-full w-50 text-white rounded-md p-2 mt-4 text-xl hover:bg-blue-600'
            // onClick={() => navigate('/otp')}
            >
            Validate OTP
            </button>
      

      {/* Floating Decorations placeholder */}
      <div className='hidden md:block'>
        <FloatingDecorations side="both" />
      </div>
    </div>
  );
};

export default OTP;