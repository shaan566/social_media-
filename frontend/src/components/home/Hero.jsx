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
import image1 from "../../assets/float-16.9k-02.png"
import image2 from "../../assets/float-commission-02.png"
import image3 from "../../assets/influencer-static-hero.webp"
import video from "../../assets/home-page-no-audio-1.mov"
import video2 from "../../assets/brands-page-no-audio.mov"


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
              <div className="hidden md:block">
                   <FloatingDecorations side="both" />
              </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
            Your social media <br className="hidden sm:block" /> workspace
          </h1>
          
          {/* <span className="text-sm  text-black  mx-auto">
           turn consistency into growth
          </span> */}
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

 <div className="relative mx-auto max-w-7xl px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 overflow-hidden">
  
  {/* Mobile & Tablet: Stacked/scrollable row */}
  <div className="flex items-center justify-center gap-3 sm:gap-4 md:hidden">
    <div className="w-1/3 max-w-[140px]">
      <img src={img2} className="w-full h-auto block rounded-xl shadow-md" alt="" />
    </div>
    <div className="w-1/3 max-w-[160px] -mt-4">
      <img src={img6} className="w-full h-auto block rounded-xl shadow-md" alt="" />
    </div>
    <div className="w-1/3 max-w-[180px] -mt-8">
      <img src={img1} className="w-full h-auto block rounded-xl shadow-lg" alt="" />
    </div>
    <div className="w-1/3 max-w-[160px] -mt-4">
      <img src={img3} className="w-full h-auto block rounded-xl shadow-md" alt="" />
    </div>
    <div className="w-1/3 max-w-[140px]">
      <img src={img4} className="w-full h-auto block rounded-xl shadow-md" alt="" />
    </div>
  </div>

  {/* md: 3-card layout */}
  <div className="hidden md:flex lg:hidden items-end justify-center gap-0">
    {/* Left */}
    <div className="relative z-[6] w-[28%] max-w-[220px] translate-x-6 translate-y-4">
      <img src={img6} className="w-full h-auto block rounded-2xl shadow-lg" alt="" />
    </div>

    {/* Center */}
    <div className="relative z-10 w-[44%] max-w-[340px]">
      <img src={img1} className="w-full h-auto block rounded-2xl shadow-2xl" alt="" />
    </div>

    {/* Right */}
    <div className="relative z-[6] w-[28%] max-w-[220px] -translate-x-6 translate-y-4">
      <img src={img3} className="w-full h-auto block rounded-2xl shadow-lg" alt="" />
    </div>
  </div>

  {/* lg+: Full 5-card fan layout */}
  <div className="hidden lg:block relative h-[520px] xl:h-[580px]">

    {/* LEFT OUTER */}
    <div className="absolute -left-10 top-1/2 -translate-y-[40%] z-[5] w-[18%] max-w-[280px]">
      <img src={img2} className="w-full h-auto block rounded-2xl shadow-lg opacity-90" alt="" />
    </div>

    {/* LEFT INNER */}
    <div className="absolute left-[14%] top-1/2 -translate-y-[45%] z-[7] w-[22%] max-w-[320px]">
      <img src={img6} className="w-full h-auto block rounded-2xl shadow-xl" alt="" />
    </div>

    {/* CENTER */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[28%] max-w-[420px]">
      <img src={img1} className="w-full h-auto block rounded-2xl shadow-2xl" alt="" />
    </div>

    {/* RIGHT INNER */}
    <div className="absolute right-[14%] top-1/2 -translate-y-[45%] z-[7] w-[22%] max-w-[320px]">
      <img src={img3} className="w-full h-auto block rounded-2xl shadow-xl" alt="" />
    </div>

    {/* RIGHT OUTER */}
    <div className="absolute -right-10 top-1/2 -translate-y-[40%] z-[5] w-[18%] max-w-[280px]">
      <img src={img4} className="w-full h-auto block rounded-2xl shadow-lg opacity-90" alt="" />
    </div>

  </div>
</div>

{/* <div className='flex flex-row gap-10 justify-center'>
  <div className='w-1/2'>
   <div className=''>
    <span className='font-bold text-6xl'>Earn money as an Everyday Influencer</span><br/>
    
    <span className='text-4xl'>Turn your passions into profit. Mavely's easy-to-use technology lets you create shoppable SmartLinks to share products your audience loves. When they shop, you earn.</span>
   </div>

  </div>
  <div className='w-1/2'>
    <img  className = "" src = {image1}/>
    <img className='' src = {image2} />
   
  
    <video className='w-full h-150 rounded-xl shadow-lg' src = {video1}  autoPlay loop muted playsInline controlsList='nodownload'></video>
  </div>

</div> */}
<div className='flex flex-col lg:flex-row gap-16 justify-center items-center max-w-7xl mx-auto px-6 '>
  
  {/* Left Side: Text Content */}
  <div className='w-full lg:w-1/2 space-y-6'>
    <h1 className='font-bold font-Roboto Condensed text-4xl md:text-6xl lg:text-7xl leading-tight text-gray-900'>
      Earn money as an Everyday Influencer
    </h1>
    
    <p className='text-xl md:text-2xl font-Roboto Condensed text-gray-600 leading-relaxed max-w-xl'>
      Turn your passions into profit. Schedly easy-to-use technology lets you 
      create shoppable SmartLinks to share products your audience loves. 
      When they shop, you earn.
    </p>

    {/* Optional: Add your button here to match the design */}
    {/* <button  className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all">
      Join now
    </button> */}
  </div>

  {/* Right Side: Video + Floating Images */}
  <div className='w-full lg:w-1/2 flex justify-center'>
    {/* This relative div is the "anchor" for the absolute images */}
    <div className='relative w-full max-w-[400px]'>
      
      {/* Floating Image 1 (Top Left) */}
      <img 
        className="absolute -top-10 -left-10 w-32 md:w-44 z-20 animate-drift-left drop-shadow-xl" 
        src={image1} 
        alt="decoration"
      />
      
      {/* Floating Image 2 (Bottom Right) */}
      <img 
        className="absolute -bottom-8 -right-8 w-36 md:w-52 z-20 animate-drift-left drop-shadow-xl" 
        src={image2} 
        alt="decoration"
      />
   
      {/* The Central Video */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-12 border-white bg-gray-100 aspect-[9/16]">
        <video 
          className='w-full h-full object-cover' 
          src={video}  
          autoPlay 
          loop 
          muted 
          playsInline 
          controlsList='nodownload'
        />
      </div>
    </div>
  </div>

  </div>
   <div className='rounded-[2.5rem] flex flex-col w-full mt-20 max-w-7xl mx-auto px-4 h-[500px] items-center justify-center p-8 overflow-hidden shadow-2xl border-[12px] border-white bg-green-300 aspect-[9/16] space-y-6'>
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          
        </div>
      </div>
    </div>
  <div className = "py-25"> 
    <div className='rounded-[2.5rem] flex flex-col w-full max-w-7xl mx-auto px-4 h-[500px] items-center justify-center p-8 overflow-hidden shadow-2xl border-[12px] border-white bg-green-300 aspect-[9/16] space-y-6'>
      
      {/* Header Text */}
    <span className="text-center font-semibold text-black text-5xl  mx-auto px-4">
      Grow your social presence <br/>with confidence
    </span>

      {/* Main Button */}
      <button onClick={() => navigate('/login')} className='w-full max-w-[200px] bg-black hover:bg-gray-800 text-white py-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105'>
        <span className="font-medium">
          Get started for free
        </span>
      </button>

      {/* Footer Badge/Text */}
      <div className="text-black px-4 py-2  text-xl font-medium">
        No credit card needed. Free forever.
      </div>
    </div>
</div>

       


    
    </div>
  );
};

export default Hero;