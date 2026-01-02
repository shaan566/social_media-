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

const Hero = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const navigate = useNavigate();

  const rightFloatingPositions = [
  { top: "8%", right: "6%" },
  { top: "18%", right: "14%" },
  { top: "30%", right: "8%" },
  { top: "42%", right: "18%" },
  { top: "56%", right: "10%" },
  { top: "70%", right: "16%" },
  { top: "82%", right: "8%" },
];
 const leftFloatingPositions = [
  { top: "8%", left: "6%" },
  { top: "18%", left: "14%" },
  { top: "30%", left: "8%" },
  { top: "42%", left: "18%" },
  { top: "56%", left: "10%" },
  { top: "70%", left: "16%" },
  { top: "82%", left: "8%" },
];
  return (
    <div className="relative min-h-screen overflow-hidden" >
{/* Decorative Elements - Left Side */}
<div className="absolute inset-0 pointer-events-none">
  {/* Row 1 */}
  <div className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300 "
  style={leftFloatingPositions[0]}>
    👏
  </div>
  <div className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[1]}>
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="url(#instagram-gradient)" fillRule="evenodd" d="M20.387 3.653C19.34 2.565 17.847 2 16.153 2H7.847C4.339 2 2 4.339 2 7.847v8.266c0 1.734.565 3.226 1.694 4.314C4.782 21.476 6.234 22 7.887 22h8.226c1.734 0 3.185-.564 4.234-1.573C21.435 19.38 22 17.887 22 16.153V7.847c0-1.694-.564-3.145-1.613-4.194Zm-.161 12.5c0 1.25-.444 2.258-1.17 2.944-.725.685-1.733 1.048-2.943 1.048H7.887c-1.21 0-2.218-.363-2.943-1.048-.726-.726-1.09-1.734-1.09-2.984V7.847c0-1.21.364-2.218 1.09-2.944.685-.685 1.733-1.048 2.943-1.048h8.306c1.21 0 2.218.363 2.944 1.089.686.725 1.089 1.733 1.089 2.903v8.306Zm-1.694-9.476a1.17 1.17 0 1 1-2.339 0 1.17 1.17 0 0 1 2.339 0ZM6.838 11.96c0-2.863 2.34-5.162 5.162-5.162s5.161 2.34 5.161 5.162S14.863 17.12 12 17.12a5.146 5.146 0 0 1-5.162-5.161Zm1.855 0A3.321 3.321 0 0 0 12 15.266a3.321 3.321 0 0 0 3.306-3.306A3.321 3.321 0 0 0 12 8.653a3.321 3.321 0 0 0-3.307 3.307Z"/>
      <defs>
        <linearGradient id="instagram-gradient" x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#f58529"/>
          <stop offset="50%" stopColor="#dd2a7b"/>
          <stop offset="100%" stopColor="#8134af"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
  {/* Row 2 */}
  <div className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[2]}>
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#3b5998" d="M23 12.067C23 5.955 18.075 1 12 1S1 5.955 1 12.067C1 17.591 5.023 22.17 10.281 23v-7.734H7.488v-3.199h2.793V9.63c0-2.774 1.643-4.306 4.155-4.306 1.204 0 2.462.216 2.462.216v2.724h-1.387c-1.366 0-1.792.853-1.792 1.728v2.076h3.05l-.487 3.2h-2.563V23C18.977 22.17 23 17.591 23 12.067Z"/>
    </svg>
  </div>
  <div className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[3]}>
    🚀
  </div>
  {/* Row 3 */}
  <div className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[4]}>
    ❤️
  </div>
  <div className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[5]}>
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#000000" d="M13.903 10.469 21.348 2h-1.764l-6.465 7.353L7.955 2H2l7.808 11.12L2 22h1.764l6.828-7.765L16.044 22H22l-8.097-11.531Z" />
    </svg>
  </div>
  {/* Row 4 */}
  <div className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[6]}>
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#000000" d="M16.1 1c.347 3.122 2.01 4.983 4.9 5.181v3.511c-1.675.172-3.142-.402-4.849-1.485v6.568c0 8.342-8.677 10.95-12.166 4.97-2.242-3.848-.87-10.6 6.322-10.87v3.702c-.548.092-1.133.237-1.668.429-1.6.567-2.507 1.63-2.255 3.505.485 3.59 6.77 4.653 6.247-2.363V1.007h3.47V1Z"/>
    </svg>
  </div>
  <div className=" animate-float  absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
  style={leftFloatingPositions[7]}>
    📈
  </div>
</div>

{/* Decorative Elements - Right Side */}
<div className="absolute inset-0 pointer-events-none">

  <div
    className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[0]}
  >
    
<svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#E60023" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12c0 4.66 2.9 8.644 6.991 10.247-.096-.87-.183-2.21.039-3.16.2-.858 1.29-5.467 1.29-5.467s-.33-.659-.33-1.633c0-1.53.887-2.672 1.99-2.672.94 0 1.392.705 1.392 1.55 0 .944-.6 2.355-.91 3.662-.26 1.095.549 1.988 1.628 1.988 1.955 0 3.458-2.061 3.458-5.037 0-2.634-1.892-4.475-4.594-4.475-3.13 0-4.967 2.347-4.967 4.774 0 .945.364 1.959.818 2.51a.33.33 0 0 1 .077.315c-.084.348-.27 1.095-.306 1.248-.048.201-.16.244-.368.147-1.374-.64-2.233-2.648-2.233-4.262 0-3.47 2.521-6.656 7.268-6.656 3.816 0 6.782 2.719 6.782 6.353 0 3.791-2.39 6.842-5.708 6.842-1.115 0-2.163-.58-2.521-1.263 0 0-.552 2.1-.686 2.615-.248.955-.919 2.153-1.367 2.883 1.03.319 2.123.491 3.257.491 6.075 0 11-4.925 11-11S18.075 1 12 1Z"/>
    </svg>
  </div>

  <div
    className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[1]}
  >
    📣
  </div>

  <div
    className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[2]}
  >
    💬
  </div>

  <div
    className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[3]}
  >
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  </div>

  <div
    className="animate-float absolute w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[4]}
  >
     <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#1da1f2" d="M5.769 4.212C8.29 5.972 11.004 9.539 12 11.453c.996-1.914 3.709-5.482 6.231-7.241C20.051 2.942 23 1.96 23 5.086c0 .624-.385 5.244-.611 5.994-.785 2.608-3.647 3.273-6.192 2.87 4.449.704 5.58 3.035 3.136 5.366-4.642 4.426-6.672-1.111-7.192-2.53-.096-.26-.14-.382-.141-.278 0-.104-.045.018-.14.278-.52 1.419-2.55 6.956-7.193 2.53-2.445-2.331-1.313-4.662 3.136-5.366-2.545.403-5.407-.262-6.192-2.87C1.385 10.33 1 5.71 1 5.086c0-3.126 2.949-2.144 4.769-.874Z"/>
    </svg>
  </div>

  <div
    className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[5]}
  >
    🗓️
  </div>

  <div
    className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[6]}
  >
    🤳
  </div>
 <div
    className="animate-float absolute w-15 h-15 blur-sm rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300"
    style={rightFloatingPositions[6]}
  >
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path fill="#0077B5" fillRule="evenodd" d="M18.338 18.338H15.67v-4.177c0-.997-.018-2.278-1.387-2.278-1.39 0-1.602 1.085-1.602 2.206v4.25h-2.668v-8.59h2.561v1.173h.036c.356-.675 1.227-1.388 2.526-1.388 2.703 0 3.202 1.78 3.202 4.092v4.712ZM7.004 8.574a1.548 1.548 0 1 1 0-3.097 1.548 1.548 0 0 1 0 3.097ZM5.67 18.338h2.67v-8.59h-2.67v8.59ZM19.668 3H4.328C3.597 3 3 3.581 3 4.297v15.404C3 20.418 3.596 21 4.329 21h15.339c.734 0 1.332-.582 1.332-1.299V4.297C21 3.581 20.402 3 19.668 3Z"/>
    </svg>
  </div>


</div>

     

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;