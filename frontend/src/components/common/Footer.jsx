import { RiTwitterXFill } from "react-icons/ri";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    heading: "Features",
    links: [
      { label: "Schedule Posts", to: "/schedule" },
      { label: "AI Captions", to: "/ai-captions" },
      { label: "Analytics", to: "/analytics" },
      { label: "Content Calendar", to: "/calendar" },
      { label: "Team & Agencies", to: "/teams" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "Instagram", to: "/platforms/instagram" },
      { label: "LinkedIn", to: "/platforms/linkedin" },
      { label: "Twitter / X", to: "/platforms/twitter" },
      { label: "Facebook", to: "/platforms/facebook" },
      { label: "YouTube", to: "/platforms/youtube" },
    ],
  },
  {
    heading: "Made for",
    links: [
      { label: "Small Businesses", to: "/for/small-business" },
      { label: "Freelancers", to: "/for/freelancers" },
      { label: "Agencies", to: "/for/agencies" },
      { label: "Creators", to: "/for/creators" },
      { label: "Startups", to: "/for/startups" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Help Center", to: "/help" },
      { label: "API Docs", to: "/docs" },
      { label: "Changelog", to: "/changelog" },
      { label: "Request a Feature", to: "/feedback" },
    ],
  },
  // {
  //   heading: "Company",
  //   links: [
  //     { label: "About", to: "/about" },
  //     { label: "Careers", to: "/careers" },
  //     { label: "Partner Program", to: "/partners" },
  //     { label: "Press", to: "/press" },
  //     { label: "Legal", to: "/legal" },
  //   ],
  // },
];

const socialLinks = [
  {
    label: "Twitter / X",
    href: "https://x.com/ch60868207",
    icon: <RiTwitterXFill size={18} />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shaan510/",
    icon: <FaLinkedin size={18} />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/learn_code147/",
    icon: <FaInstagram size={18} />,
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#1f2e2e] rounded-t-4xl text-white pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-32">

      {/* Top row: Brand + Newsletter */}
      <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-white/10">

        {/* Brand block */}
        <div className="flex flex-col gap-5 max-w-xs">
          <div>
                  
                    <Link
                      to="/"
                      className="mr-auto text-xl font-bold tracking-tight text-gray-900 shrink-0"
                    >
                    <span className="text-[40px] font-bold leading-[56px] text-blue-600">S</span>
                    chedly.
                    </Link>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Schedule smarter. Grow faster. Built for Indian businesses who
              take social media seriously.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-blue-600 hover:border-blue-600/40 hover:bg-blue-600/10 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* India badge */}
          <div className="inline-flex items-center gap-2 text-xs text-white/40 font-medium">
            <span className="text-base">🇮🇳</span>
            Made with love in India
          </div>
        </div>

        {/* Newsletter */}
        <div className="max-w-sm w-full">
          <h3 className="text-sm font-semibold text-white mb-1 tracking-wide uppercase">
            Stay in the loop
          </h3>
          <p className="text-sm text-white/45 mb-4 leading-relaxed">
            Social media tips, platform updates, and product news — in your
            inbox every week.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 min-w-0 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/40 transition-all"
            />
            <button className="h-10 px-5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-emerald-300 active:scale-95 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Middle: Link columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 py-12 border-b border-white/10">
        {footerLinks.map((group) => (
          <div key={group.heading}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {group.heading}
            </h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    // to={link.to}
                    className="text-sm text-white/55 hover:text-blue-600 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-white/30">
        <p>© {new Date().getFullYear()} Schedly. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/legal#privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          <span className="text-white/15">|</span>
          <Link to="/legal#terms" className="hover:text-white/60 transition-colors">Terms</Link>
          <span className="text-white/15">|</span>
          <Link to="/legal#security" className="hover:text-white/60 transition-colors">Security</Link>
        </div>
      </div>

    </footer>
  );
};

export default Footer;