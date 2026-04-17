import { useState } from "react";

const socialIcons = {
  instagram: (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f58529"/>
          <stop offset="50%" stopColor="#dd2a7b"/>
          <stop offset="100%" stopColor="#8134af"/>
        </linearGradient>
      </defs>
      <path fill="url(#ig)" fillRule="evenodd" d="M20.387 3.653C19.34 2.565 17.847 2 16.153 2H7.847C4.339 2 2 4.339 2 7.847v8.266c0 1.734.565 3.226 1.694 4.314C4.782 21.476 6.234 22 7.887 22h8.226c1.734 0 3.185-.564 4.234-1.573C21.435 19.38 22 17.887 22 16.153V7.847c0-1.694-.564-3.145-1.613-4.194Zm-.161 12.5c0 1.25-.444 2.258-1.17 2.944-.725.685-1.733 1.048-2.943 1.048H7.887c-1.21 0-2.218-.363-2.943-1.048-.726-.726-1.09-1.734-1.09-2.984V7.847c0-1.21.364-2.218 1.09-2.944.685-.685 1.733-1.048 2.943-1.048h8.306c1.21 0 2.218.363 2.944 1.089.686.725 1.089 1.733 1.089 2.903v8.306Zm-1.694-9.476a1.17 1.17 0 1 1-2.339 0 1.17 1.17 0 0 1 2.339 0ZM6.838 11.96c0-2.863 2.34-5.162 5.162-5.162s5.161 2.34 5.161 5.162S14.863 17.12 12 17.12a5.146 5.146 0 0 1-5.162-5.161Zm1.855 0A3.321 3.321 0 0 0 12 15.266a3.321 3.321 0 0 0 3.306-3.306A3.321 3.321 0 0 0 12 8.653a3.321 3.321 0 0 0-3.307 3.307Z"/>
    </svg>
  ),
  facebook: (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M23 12.067C23 5.955 18.075 1 12 1S1 5.955 1 12.067C1 17.591 5.023 22.17 10.281 23v-7.734H7.488v-3.199h2.793V9.63c0-2.774 1.643-4.306 4.155-4.306 1.204 0 2.462.216 2.462.216v2.724h-1.387c-1.366 0-1.792.853-1.792 1.728v2.076h3.05l-.487 3.2h-2.563V23C18.977 22.17 23 17.591 23 12.067Z"/>
    </svg>
  ),
  x: (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path fill="currentColor" d="M13.903 10.469 21.348 2h-1.764l-6.465 7.353L7.955 2H2l7.808 11.12L2 22h1.764l6.828-7.765L16.044 22H22l-8.097-11.531Z"/>
    </svg>
  ),
  linkedin: (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path fill="#0077B5" fillRule="evenodd" d="M18.338 18.338H15.67v-4.177c0-.997-.018-2.278-1.387-2.278-1.39 0-1.602 1.085-1.602 2.206v4.25h-2.668v-8.59h2.561v1.173h.036c.356-.675 1.227-1.388 2.526-1.388 2.703 0 3.202 1.78 3.202 4.092v4.712ZM7.004 8.574a1.548 1.548 0 1 1 0-3.097 1.548 1.548 0 0 1 0 3.097ZM5.67 18.338h2.67v-8.59h-2.67v8.59ZM19.668 3H4.328C3.597 3 3 3.581 3 4.297v15.404C3 20.418 3.596 21 4.329 21h15.339c.734 0 1.332-.582 1.332-1.299V4.297C21 3.581 20.402 3 19.668 3Z"/>
    </svg>
  ),
  youtube: (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16.1 1c.347 3.122 2.01 4.983 4.9 5.181v3.511c-1.675.172-3.142-.402-4.849-1.485v6.568c0 8.342-8.677 10.95-12.166 4.97-2.242-3.848-.87-10.6 6.322-10.87v3.702c-.548.092-1.133.237-1.668.429-1.6.567-2.507 1.63-2.255 3.505.485 3.59 6.77 4.653 6.247-2.363V1.007h3.47V1Z"/>
    </svg>
  ),
  pinterest: (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path fill="#E60023" fillRule="evenodd" d="M12 1C5.925 1 1 5.925 1 12c0 4.66 2.9 8.644 6.991 10.247-.096-.87-.183-2.21.039-3.16.2-.858 1.29-5.467 1.29-5.467s-.33-.659-.33-1.633c0-1.53.887-2.672 1.99-2.672.94 0 1.392.705 1.392 1.55 0 .944-.6 2.355-.91 3.662-.26 1.095.549 1.988 1.628 1.988 1.955 0 3.458-2.061 3.458-5.037 0-2.634-1.892-4.475-4.594-4.475-3.13 0-4.967 2.347-4.967 4.774 0 .945.364 1.959.818 2.51a.33.33 0 0 1 .077.315c-.084.348-.27 1.095-.306 1.248-.048.201-.16.244-.368.147-1.374-.64-2.233-2.648-2.233-4.262 0-3.47 2.521-6.656 7.268-6.656 3.816 0 6.782 2.719 6.782 6.353 0 3.791-2.39 6.842-5.708 6.842-1.115 0-2.163-.58-2.521-1.263 0 0-.552 2.1-.686 2.615-.248.955-.919 2.153-1.367 2.883 1.03.319 2.123.491 3.257.491 6.075 0 11-4.925 11-11S18.075 1 12 1Z"/>
    </svg>
  ),
};

const features = [
  {
    label: "Publish",
    title: "The most complete publishing tool",
    desc: "Schedule content to Instagram, TikTok, LinkedIn, Threads, Bluesky, YouTube Shorts, Pinterest, and more from one place.",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Create",
    title: "Turn any idea into the perfect post",
    desc: "Capture ideas, draft content with AI assistance, and organize your content library across every channel.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    label: "Analyze",
    title: "Answers, not just analytics",
    desc: "Learn what content performs best and get actionable insights that drive real audience growth.",
    color: "#059669",
    bg: "#ecfdf5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    label: "Community",
    title: "Reply to comments in a flash",
    desc: "Engage with your audience 10x faster. Triage and respond to comments across all platforms from one dashboard.",
    color: "#d97706",
    bg: "#fffbeb",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const stats = [
  { value: "100,000+", label: "Businesses and creators" },
  { value: "11M+", label: "Posts published last month" },
  { value: "11", label: "Social platforms" },
];

const floatLeft = [
  { top: "12%", left: "4%" },
  { top: "28%", left: "10%" },
  { top: "46%", left: "5%" },
  { top: "62%", left: "12%" },
  { top: "78%", left: "6%" },
];
const floatRight = [
  { top: "10%", right: "5%" },
  { top: "26%", right: "11%" },
  { top: "44%", right: "6%" },
  { top: "60%", right: "13%" },
  { top: "76%", right: "7%" },
];

const floatItemsLeft = [
  { icon: socialIcons.instagram, bg: "#fff" },
  { emoji: "👏", bg: "linear-gradient(135deg,#f87171,#ef4444)" },
  { icon: socialIcons.facebook, bg: "#fff" },
  { emoji: "🚀", bg: "linear-gradient(135deg,#a78bfa,#7c3aed)" },
  { icon: socialIcons.x, bg: "#f3f4f6" },
];
const floatItemsRight = [
  { icon: socialIcons.youtube, bg: "#fff" },
  { emoji: "📣", bg: "linear-gradient(135deg,#6ee7b7,#059669)" },
  { icon: socialIcons.linkedin, bg: "#fff" },
  { emoji: "🗓️", bg: "linear-gradient(135deg,#93c5fd,#2563eb)" },
  { icon: socialIcons.tiktok, bg: "#f3f4f6" },
];

function FloatingIcon({ style, item }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 52,
        height: 52,
        borderRadius: 14,
        background: item.bg || "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
        fontSize: 24,
        animation: "floatBob 4s ease-in-out infinite",
        animationDelay: Math.random() * 2 + "s",
        ...style,
      }}
    >
      {item.emoji || item.icon}
    </div>
  );
}

export default function BufferLanding() {
  const [email, setEmail] = useState("");
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{`
        @keyframes floatBob {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-10px)}
        }
        .nav-link:hover{color:#2563eb;}
        .feat-tab{cursor:pointer;padding:10px 18px;border-radius:999px;border:1.5px solid transparent;font-size:14px;font-weight:500;transition:all .2s;}
        .feat-tab:hover{background:#f1f5f9;}
        .feat-tab.active{background:#eff6ff;color:#2563eb;border-color:#bfdbfe;}
        .cta-btn{background:#2563eb;color:#fff;border:none;border-radius:999px;padding:12px 22px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .15s;}
        .cta-btn:hover{background:#1d4ed8;}
        .sec-btn{background:#fff;color:#2563eb;border:1.5px solid #2563eb;border-radius:999px;padding:11px 22px;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;}
        .sec-btn:hover{background:#eff6ff;}
      `}</style>

      {/* Navbar */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 40px", borderBottom:"1px solid #f1f5f9", position:"sticky", top:0, background:"#fff", zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:32 }}>
          <a href="#" style={{ fontWeight:800, fontSize:22, color:"#111", textDecoration:"none", letterSpacing:"-0.5px" }}>
            <span style={{ color:"#2563eb" }}>B</span>uffer
          </a>
          {["Features","Channels","Pricing","Resources"].map(n => (
            <a key={n} href="#" className="nav-link" style={{ fontSize:14, fontWeight:500, color:"#374151", textDecoration:"none", transition:"color .15s" }}>{n}</a>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <a href="#" style={{ fontSize:14, fontWeight:500, color:"#374151", textDecoration:"none" }}>Log in</a>
          <button className="cta-btn" style={{ padding:"9px 18px", fontSize:14 }}>Get started for free</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position:"relative", minHeight:560, display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 24px 60px", overflow:"hidden", background:"#fff" }}>
        {/* Floating left */}
        {floatItemsLeft.map((item, i) => (
          <FloatingIcon key={i} style={{ ...floatLeft[i] }} item={item} />
        ))}
        {/* Floating right */}
        {floatItemsRight.map((item, i) => (
          <FloatingIcon key={i} style={{ ...floatRight[i] }} item={item} />
        ))}

        <div style={{ position:"relative", zIndex:2, textAlign:"center", maxWidth:600 }}>
          <h1 style={{ fontSize:56, fontWeight:800, lineHeight:1.1, letterSpacing:"-1.5px", color:"#0f172a", margin:"0 0 16px" }}>
            Your social media<br/>workspace
          </h1>
          <p style={{ fontSize:19, color:"#64748b", margin:"0 0 36px" }}>Share consistently without the chaos</p>

          {/* Email form pill */}
          <div style={{ display:"flex", alignItems:"center", background:"#fff", borderRadius:999, border:"1.5px solid #e2e8f0", padding:"6px 6px 6px 20px", maxWidth:480, margin:"0 auto 12px", boxShadow:"0 2px 16px rgba(0,0,0,0.07)" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email..."
              style={{ flex:1, border:"none", outline:"none", fontSize:15, background:"transparent", color:"#111", minWidth:0 }}
            />
            <button className="cta-btn" style={{ padding:"11px 20px", fontSize:14, whiteSpace:"nowrap" }}>
              Get started for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <p style={{ fontSize:12, color:"#94a3b8" }}>By entering your email, you agree to receive emails from Buffer.</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:"#f8fafc", padding:"40px 40px", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9" }}>
        <p style={{ textAlign:"center", fontSize:14, color:"#94a3b8", marginBottom:28, fontWeight:500 }}>Trusted by over 100,000 businesses and individuals</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, maxWidth:700, margin:"0 auto" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:800, color:"#0f172a", letterSpacing:"-1px" }}>{s.value}</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social logos row */}
      <section style={{ padding:"28px 40px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
        {Object.values(socialIcons).map((icon, i) => (
          <div key={i} style={{ opacity:0.7, transition:"opacity .15s", cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.opacity=1}
            onMouseLeave={e=>e.currentTarget.style.opacity=0.7}
          >{icon}</div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <p style={{ textAlign:"center", fontSize:13, fontWeight:600, color:"#2563eb", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Core features</p>
        <h2 style={{ textAlign:"center", fontSize:36, fontWeight:800, color:"#0f172a", margin:"0 0 40px", letterSpacing:"-0.5px" }}>Everything you need to grow</h2>

        {/* Feature tabs */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:48, flexWrap:"wrap" }}>
          {features.map((f, i) => (
            <button key={i} className={`feat-tab${activeFeature===i?" active":""}`} onClick={()=>setActiveFeature(i)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Feature card */}
        {features.map((f, i) => (
          <div key={i} style={{ display: activeFeature===i ? "grid" : "none", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:f.bg, borderRadius:10, padding:"8px 14px", marginBottom:18 }}>
                {f.icon}
                <span style={{ fontSize:14, fontWeight:600, color:f.color }}>{f.label}</span>
              </div>
              <h3 style={{ fontSize:28, fontWeight:800, color:"#0f172a", margin:"0 0 14px", letterSpacing:"-0.3px" }}>{f.title}</h3>
              <p style={{ fontSize:16, color:"#64748b", lineHeight:1.7, margin:"0 0 28px" }}>{f.desc}</p>
              <button className="cta-btn">Learn more →</button>
            </div>
            {/* Mock UI panel */}
            <div style={{ background:f.bg, borderRadius:20, padding:32, border:`1.5px solid ${f.color}22`, minHeight:260, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:64, height:64, borderRadius:18, background:f.color, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  {/* Re-render icon in white */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {i===0 && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                    {i===1 && <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>}
                    {i===2 && <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>}
                    {i===3 && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}
                  </svg>
                </div>
                <p style={{ fontSize:15, fontWeight:600, color:f.color }}>{f.label} Dashboard</p>
                <p style={{ fontSize:13, color:"#64748b", marginTop:6 }}>Your {f.label.toLowerCase()} workspace</p>
                {/* Mini mock bars */}
                <div style={{ display:"flex", gap:6, marginTop:20, justifyContent:"center" }}>
                  {[60,90,45,75,55].map((h,j) => (
                    <div key={j} style={{ width:16, height:h*0.8, background:f.color, borderRadius:4, opacity:0.3+j*0.12 }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Channels */}
      <section style={{ background:"#f8fafc", padding:"64px 40px", textAlign:"center" }}>
        <h2 style={{ fontSize:32, fontWeight:800, color:"#0f172a", marginBottom:12, letterSpacing:"-0.5px" }}>Connect your favorite accounts</h2>
        <p style={{ fontSize:16, color:"#64748b", marginBottom:36 }}>Publish to 11 social platforms from one beautiful workspace</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center", marginBottom:36 }}>
          {["Instagram","Facebook","TikTok","YouTube","LinkedIn","Pinterest","X / Twitter","Threads","Bluesky","Mastodon","Google Business"].map(name => (
            <div key={name} style={{ background:"#fff", borderRadius:10, padding:"10px 18px", fontSize:14, fontWeight:500, color:"#374151", border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
              {name}
            </div>
          ))}
        </div>
        <button className="cta-btn">Get started for free</button>
      </section>

      {/* Pricing CTA */}
      <section style={{ padding:"80px 40px", textAlign:"center", maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ fontSize:36, fontWeight:800, color:"#0f172a", margin:"0 0 14px", letterSpacing:"-0.5px" }}>Start for free. Grow at your pace.</h2>
        <p style={{ fontSize:17, color:"#64748b", margin:"0 0 36px" }}>No credit card required. Upgrade when you're ready.</p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="cta-btn" style={{ fontSize:16, padding:"14px 28px" }}>Get started for free</button>
          <button className="sec-btn" style={{ fontSize:16, padding:"14px 28px" }}>View pricing</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#0f172a", padding:"40px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <span style={{ fontWeight:800, fontSize:18, color:"#fff" }}>
          <span style={{ color:"#60a5fa" }}>B</span>uffer
        </span>
        <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
          {["Features","Pricing","Blog","Support","Privacy","Terms"].map(l => (
            <a key={l} href="#" style={{ fontSize:13, color:"#94a3b8", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize:13, color:"#475569" }}>© 2025 Buffer Inc.</span>
      </footer>
    </div>
  );
}