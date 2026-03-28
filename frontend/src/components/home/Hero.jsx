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
import { FaFacebook, FaLinkedin, FaPinterest, FaYoutube, FaMastodon } from 'react-icons/fa6';
import { FaBluesky } from 'react-icons/fa6';

import { SiThreads,  } from 'react-icons/si';

const tabs = [
  {
    id: "creators",
    label: "Creators",
    headline: ["Grow from zero", "to → one", "to → one million"],
    accentIndex: 1,
    sub: "Whether you're just getting started or scaling to new heights, Schedly gets your content in front of more people.",
    features: [
      { icon: "💡", title: "Save Ideas", desc: "Capture every spark of inspiration the moment it strikes." },
      { icon: "📊", title: "Learn What Works", desc: "Understand exactly what content performs best and why." },
      { icon: "🔁", title: "Crosspost Everywhere", desc: "Create once, publish to every platform instantly." },
    ],
    bg: "linear-gradient(145deg, #bbf7d0 0%, #86efac 60%, #4ade80 100%)",
    cardBg: "rgba(255,255,255,0.75)",
    accentColor: "#5994bb",
    headlineAccent: "#15803d",
    tabActiveBg: "#15803d",
    pillBg: "rgba(21,128,61,0.12)",
    pillText: "#14532d",
  },
  {
    id: "small-biz",
    label: "Small Businesses",
    headline: ["Level up your", "social presence", "without the drain"],
    accentIndex: 1,
    sub: "Every minute and dollar counts. Schedly multiplies your efforts and keeps your presence thriving with minimal effort.",
    features: [
      { icon: "📅", title: "Schedule Ahead", desc: "Plan content weeks or months in advance effortlessly." },
      { icon: "🗂️", title: "One Dashboard", desc: "See all posts, channels, and analytics in one clean view." },
      { icon: "🏆", title: "World-Class Support", desc: "Real humans ready to help whenever you need them." },
    ],
    bg: "linear-gradient(145deg, #bfdbfe 0%, #93c5fd 60%, #60a5fa 100%)",
    cardBg: "rgba(255,255,255,0.75)",
    accentColor: "#1d4ed8",
    headlineAccent: "#1e40af",
    tabActiveBg: "#1d4ed8",
    pillBg: "rgba(29,78,216,0.1)",
    pillText: "#1e3a8a",
  },
  {
    id: "agencies",
    label: "Agencies",
    headline: ["The most trusted", "tool for agencies", "& freelancers"],
    accentIndex: 1,
    sub: "Schedly has been helping freelancers, consultants, and agencies grow client accounts for more than a decade.",
    features: [
      { icon: "✅", title: "Review & Approve", desc: "Intuitive workflows that keep every client in the loop." },
      { icon: "🔐", title: "Custom Permissions", desc: "Fine-grained access control for every team and client." },
      { icon: "📈", title: "Scales With You", desc: "Unlimited invites and pricing that grows with your business." },
    ],
    bg: "linear-gradient(145deg, #fde68a 0%, #fcd34d 60%, #f59e0b 100%)",
    cardBg: "rgba(255,255,255,0.75)",
    accentColor: "#b45309",
    headlineAccent: "#92400e",
    tabActiveBg: "#b45309",
    pillBg: "rgba(180,83,9,0.1)",
    pillText: "#78350f",
  },
];

const Social_icon = [
  { name: "Instagram", theme: "instagram", icon: <FaInstagram size={35} />, link: "/instagram" },
  { name: "Facebook", theme: "facebook", icon: <FaFacebook size={35} />, link: "/facebook" },
  { name: "Threads", theme: "threads", icon: <SiThreads size={35} />, link: "/threads" },
  { name: "X", theme: "x", icon: <FaXTwitter size={35} />, link: "/x" },
  { name: "LinkedIn", theme: "linkedin", icon: <FaLinkedin size={35} />, link: "/linkedin" },
  { name: "YouTube", theme: "youtube", icon: <FaYoutube size={35} />, link: "/youtube" },
  { name: "TikTok", theme: "tiktok", icon: <FaTiktok size={35} />, link: "/tiktok" },
  { name: "Pinterest", theme: "pinterest", icon: <FaPinterest size={35} />, link: "/pinterest" },
  { name: "Bluesky", theme: "bluesky", icon: <FaBluesky size={35} />, link: "/bluesky" },
  { name: "Mastodon", theme: "mastodon", icon: <FaMastodon size={35} />, link: "/mastodon" },
];

const Hero = () => {
  const [email, setEmail] = useState('');
  const [active, setActive] = useState(0);
  const tab = tabs[active];
 

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

 
 <div className="rounded-[2.5rem] flex flex-col items-center mt-5 h-[300px] max-w-7xl mx-auto py-8 px-6 shadow-2xl bg-white ">
      <span className="text-3xl font-semibold mb-6">Connect your favourite accounts</span>
      <br />

      <div className="flex flex-row gap-3 flex-wrap justify-center">
        {Social_icon.map((items) => (
          <a
            key={items.name}
            href={items.link}
            data-theme={items.theme} 
            className="flex items-center gap-3 px-5 py-3 rounded-xl border border-black bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="w-10 h-10 text-xl" style={{ color: "var(--theme-color)" }}>
              {items.icon}
            </span>
             {/* <span className="text-sm font-medium text-gray-700">{items.name}</span>              */}
            {/* <span className="text-xs text-gray-400">→</span> */}
          </a>
          
        ))}

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
<div className='flex flex-col lg:flex-row gap-16 justify-center items-center max-w-7xl mx-auto px-6 mt-20 '>
  
  {/* Left Side: Text Content */}
  <div className='w-full lg:w-1/2 space-y-6'>
    <h1 className='font-bold font-Roboto Condensed text-4xl md:text-6xl lg:text-7xl leading-tight text-gray-900'>
      Monetize your everyday influence
    </h1>
    
    <p className='text-xl md:text-2xl font-Roboto Condensed text-gray-600 leading-relaxed max-w-xl'>
    Schedly helps you plan, create, and schedule content your audience loves — all while building and monetizing your presence.
      
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


  <div className="min-h-screen flex items-center justify-center px-4 py-8 font-sans">

  {/* Card */}
  <div
    className="w-full max-w-7xl h-[500px] rounded-[2.5rem] border-[10px] border-white shadow-[0_32px_80px_rgba(0,0,0,0.18),0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300"
    style={{ background: tab.bg }}
  >

    {/* Tabs */}
    <div className="flex gap-2 px-5 pt-5 justify-center flex-wrap">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          onClick={() => setActive(i)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:-translate-y-[1px]
            ${i === active
              ? "text-white shadow-lg"
              : "bg-white/70 text-black/60"
            }`}
          style={{
            background: i === active ? tab.tabActiveBg : undefined,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>

    {/* Divider */}
    <div className="h-[1px] bg-white/50 mx-5 mt-4" />

    {/* Content */}
    <div key={active} className="p-7 flex flex-col gap-6 animate-[fadeUp_0.3s_ease]">

      {/* Headline */}
      <div>
        {tab.headline.map((line, i) => (
          <h1
            key={i}
            className={`text-5xl font-bold leading-tight tracking-tight ${
              i === tab.accentIndex ? "italic" : ""
            }`}
            style={{
              color:
                i === tab.accentIndex
                  ? tab.headlineAccent
                  : "rgba(0,0,0,0.78)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            {line}
          </h1>
        ))}

        <p className="text-xl text-black/60 mt-3 leading-relaxed">
          {tab.sub}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-row gap-3">
        {tab.features.map((f) => (
          <div
            key={f.title}
            className="flex gap-3 p-4 rounded-xl border border-white/80 bg-white/70 backdrop-blur-md hover:translate-x-1 transition-all"
          >
            <span className="text-lg">{f.icon}</span>
            <div>
              <p className="text-sm font-semibold text-black/80">
                {f.title}
              </p>
              <p className="text-xs text-black/50">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {/* <div className="flex items-center gap-3">
        <button
          className="flex-1 px-5 py-3 rounded-full text-sm font-semibold text-white hover:scale-[1.02] transition"
          style={{ background: tab.tabActiveBg }}
        >
          Get started free →
        </button>

        <button className="px-5 py-3 rounded-full text-sm font-medium bg-white/60 border border-white/80 text-black/60 hover:bg-white/90 transition whitespace-nowrap">
          See how it works
        </button>
      </div> */}
    </div>

    
  </div>
</div>
  <div className = "py-25"> 
    <div className='rounded-[2.5rem] flex flex-col w-full max-w-7xl mx-auto px-4 h-[500px] items-center justify-center p-8 overflow-hidden shadow-2xl border-[12px] border-white bg-blue-300 aspect-[9/16] space-y-6'>
      
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