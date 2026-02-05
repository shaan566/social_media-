import React, { useState } from 'react';
import { WiDirectionRight } from "react-icons/wi";
import { WiDirectionUpRight } from "react-icons/wi";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import FloatingDecorations from "../../common/FloatingDecorations";
import img1 from "../../assets/img1.webp";
import img2 from "../../assets/img2.webp";
import img3 from "../../assets/img3.webp";
import img4 from "../../assets/img4.webp";
import img6 from "../../assets/img6.webp";


const Hero = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const navigate = useNavigate();


  return (
    <div className="relative min-h-screen overflow-hidden" >
   

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
       
        <div className="max-w-4xl mx-auto text-center space-y-8">
           <FloatingDecorations side="both" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
            Your social media <br className="hidden sm:block" /> workspace
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Share consistently without the chaos
          </p>
         {/* Email Form */}
          <div className="w-full max-w-lg bg-white rounded-full">
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full px-6 py-4 pr-48 text-lg rounded-full
                          outline-none border-none
                          focus:ring-2 focus:ring-blue-400
                          text-gray-900"
              />

              <button
                onClick={() => navigate('/login')}
                type="button"
                
                // path = "/login"
                className="absolute right-2 top-1/2 -translate-y-1/2
                          bg-blue-600 hover:bg-blue-700 text-white
                          px-4 py-3 rounded-full px-2.5 py-1.5 text-xs
                          flex items-center gap-2
                          transition-all duration-300
                          focus:outline-none"
              >
                Get started for free
                <WiDirectionUpRight size={22} />                
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-900 mt-3">
              By entering your email, you agree to receive emails from Us.
          </p>

          {/* Community Badge */}
           {/* <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              New
            </span>
            <span className="text-white font-semibold">Community</span>
            <span className="text-gray-300">A focused space to reply to every comment</span>
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.47 4.47a.75.75 0 0 1 1.06 0l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H5a.75.75 0 0 1 0-1.5h12.19l-5.72-5.72a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </div>  */}
        </div>
      </div>

        <div className="relative flex justify-center items-center overflow-hidden">

          {/* Left outer (desktop only) */}
          <img
            src={img2}
            className="absolute left-30 top-1/2 -translate-y-1/2 w-56 hidden lg:block z-[6]"
            alt=""
          />

          {/* Left inner (tablet+) */}
          <img
            src={img6}
            className="absolute left-[22%] top-1/2 -translate-y-1/2 w-64 hidden md:block z-[7]"
            alt=""
          />

          {/* Center main (always visible) */}
          <img
            src={img1}
            className="relative w-80 md:w-85 z-10"
            alt=""
          />

          {/* Right inner (tablet+) */}
          <img
            src={img3}
            className="absolute right-[22%] top-1/2 -translate-y-1/2 w-64 hidden md:block z-[7]"
            alt=""
          />

          {/* Right outer (desktop only) */}
          <img
            src={img4}
            className="absolute right-30 top-1/2 -translate-y-1/2 w-56 hidden lg:block z-[6]"
            alt=""
          />

        </div>


    
    </div>
  );
};

export default Hero;