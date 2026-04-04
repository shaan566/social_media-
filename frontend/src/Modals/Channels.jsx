import React from "react";
import {
  FaXTwitter, FaInstagram, FaTiktok,
  FaFacebook, FaLinkedin, FaPinterest,
  FaYoutube, FaMastodon, FaBluesky,
} from "react-icons/fa6";
import { SiThreads } from "react-icons/si";

/* Map each platform to a brand color */
// const BRAND = {
//   Instagram : "#E1306C",
//   Facebook  : "#1877F2",
//   Threads   : "#000000",
//   "X (Twitter)": "#000000",
//   LinkedIn  : "#0A66C2",
//   YouTube   : "#FF0000",
//   TikTok    : "#010101",
//   Pinterest : "#E60023",
//   Bluesky   : "#0085FF",
//   Mastodon  : "#6364FF",
// };

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

const Channels = () => (
  <div className="w-[min(90vw,480px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">

    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400 px-1">
      Supported channels
    </p>

    <div className="grid grid-cols-3 gap-1">
      {Social_icon.map((item) => (
        <a
          key={item.name}
          href="#"
          data-theme={item.theme} 
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 group"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-[17px] transition group-hover:opacity-90"
            style={{ color: "var(--theme-color)" }}
          >
            {item.icon}
          </span>
          <span className="text-sm font-medium text-gray-800 group-hover:text-black leading-tight">
            {item.name}
          </span>
        </a>
      ))}
    </div>
  </div>
);

export default Channels;