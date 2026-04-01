import React from "react";
import Modal from "../common/Modal";
import { Link } from "react-router-dom";

// SVG icons for each feature
const icons = {
  Publish: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.889 4.222v3.111m6.222-3.11v3.11M5 10.444h14M6.556 5.778h10.888c.86 0 1.556.696 1.556 1.555v10.89c0 .858-.696 1.555-1.556 1.555H6.556c-.86 0-1.556-.697-1.556-1.556V7.333c0-.859.696-1.555 1.556-1.555" />
    </svg>
  ),
  Collaborate: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11.04 15.742 1.55 1.55a1.644 1.644 0 0 0 2.325-2.325m-1.55-1.55 1.938 1.937a1.644 1.644 0 1 0 2.325-2.325L14.62 10.02a2.326 2.326 0 0 0-3.286 0l-.682.682a1.644 1.644 0 0 1-2.326-2.325l2.178-2.179a4.488 4.488 0 0 1 5.473-.674l.364.217c.33.2.723.268 1.101.194l1.349-.272m0-.775.775 8.527h-1.55M4.838 4.89l-.776 8.527 5.04 5.039a1.644 1.644 0 1 0 2.325-2.325M4.837 5.664h6.202" />
    </svg>
  ),
  Create: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.333 13.556c.156-.778.545-1.323 1.167-1.945.778-.7 1.167-1.711 1.167-2.722a4.667 4.667 0 0 0-9.334 0c0 .778.156 1.711 1.167 2.722.544.545 1.011 1.167 1.167 1.945m0 3.11h4.666m-3.889 3.112h3.112" />
    </svg>
  ),
  Community: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.667 9.667h1.555a1.556 1.556 0 0 1 1.556 1.555v8.556l-3.111-3.111H12a1.555 1.555 0 0 1-1.556-1.556v-.778m3.112-4.666A1.556 1.556 0 0 1 12 11.222H7.333l-3.11 3.111V5.778a1.56 1.56 0 0 1 1.555-1.556H12a1.556 1.556 0 0 1 1.556 1.556z" />
    </svg>
  ),
  Analytics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.992 4.992v13.953h13.953m-2.326-3.1V9.642m-3.875 6.201V6.542m-3.876 9.302V13.52" />
    </svg>
  ),
  "AI Assistant": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13.519 8.093 2.325 2.325m-9.302-3.1v3.1m10.852 3.1v3.101M10.418 4.217v1.55m-2.325 3.1H4.992m13.953 6.202h-3.1M11.192 4.992h-1.55m9.798.496-.992-.992a.938.938 0 0 0-1.334 0l-12.62 12.62a.937.937 0 0 0 0 1.333l.993.992a.93.93 0 0 0 1.333 0l12.62-12.62a.932.932 0 0 0 0-1.333Z" />
    </svg>
  ),
};

const featuresData = [
  { title: "Publish",      description: "Plan and schedule your content across social media platforms", link: "/publish" },
  { title: "Collaborate",  description: "Work together seamlessly, from planning to publishing",        link: "/collaborate" },
  { title: "Create",       description: "Build your own library of content ideas",                     link: "/create" },
  { title: "Community",    description: "Easily engage with your community",                           link: "/community" },
  { title: "Analytics",    description: "Measure performance and turn insights into growth",           link: "/analyze" },
  { title: "AI Assistant", description: "Get help creating, refining, and repurposing content",       link: "/ai-assistant" },
];

const Features = ({ isOpen, setOpen }) => {
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <ul className="flex flex-col gap-1">
        {featuresData.map((item) => (
          <li key={item.title}>
            <Link
              to={item.link}
              onClick={() => setOpen(null)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group"
            >
              {/* Icon box */}
              <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white text-gray-600 shrink-0 transition">
                {icons[item.title]}
              </span>

              {/* Text */}
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 leading-snug mt-0.5">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default Features;