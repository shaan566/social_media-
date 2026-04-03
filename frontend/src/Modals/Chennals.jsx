import React from "react";
import {
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaYoutube,
  FaMastodon,
  FaBluesky,
} from "react-icons/fa6";
import { SiThreads } from "react-icons/si";

const Channels = () => {
  const Social_icon = [
    { name: "Instagram", theme: "instagram", icon: <FaInstagram /> },
    { name: "Facebook", theme: "facebook", icon: <FaFacebook /> },
    { name: "Threads", theme: "threads", icon: <SiThreads /> },
    { name: "X (Twitter)", theme: "x", icon: <FaXTwitter /> },
    { name: "LinkedIn", theme: "linkedin", icon: <FaLinkedin /> },
    { name: "YouTube", theme: "youtube", icon: <FaYoutube /> },
    { name: "TikTok", theme: "tiktok", icon: <FaTiktok /> },
    { name: "Pinterest", theme: "pinterest", icon: <FaPinterest /> },
    { name: "Bluesky", theme: "bluesky", icon: <FaBluesky /> },
    { name: "Mastodon", theme: "mastodon", icon: <FaMastodon /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 w-full max-w-[520px] border">

      {/* Title */}
      <p className="text-xs text-gray-500 mb-4">
        Supported social media channels
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Social_icon.map((item) => (
          <a
            key={item.name}
            href="#"
            data-theme={item.theme}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
          >
            {/* Icon */}
            <span
              className="text-2xl transition"
              style={{ color: "var(--theme-color)" }}
            >
              {React.cloneElement(item.icon, { size: 22 })}
            </span>

            {/* Name */}
            <span className="text-sm font-medium text-gray-800 group-hover:text-black">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Channels;