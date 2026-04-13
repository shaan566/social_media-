import React from "react"

export const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  formSide: {
    flex: "0 0 460px",
    padding: "3rem 3.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "2.5rem",
  },
  logoText: {
    fontSize: "21px",
    fontWeight: 800,
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
  },
  heading: {
    fontSize: "30px",
    fontWeight: 800,
    color: "#1a1a1a",
    margin: "0 0 0.35rem",
    letterSpacing: "-0.5px",
  },
  subheading: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 2rem",
    lineHeight: 1.5,
  },
  inlineLink: {
    color: "#1a1a1a",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    cursor: "pointer",
  },
  field: { marginBottom: "1rem" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "6px",
    letterSpacing: "0.1px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#2563eb",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    cursor: "pointer",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "2px solid #e2e2e2",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1a1a1a",
    background: "#fafafa",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  inputWithIcon: {
    paddingLeft: "38px",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "#aaa",
    display: "flex",
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "#f5c842",
    border: "2px solid #1a1a1a",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 800,
    color: "#1a1a1a",
    letterSpacing: "-0.2px",
    marginTop: "0.5rem",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
  },
  errorMsg: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "5px",
  },
  errorDot: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    background: "#e74c3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  errorText: { fontSize: "12px", color: "#e74c3c" },
  footNote: { fontSize: "13px", color: "#777", lineHeight: 1.6, margin: 0, textAlign: "center" },

  // Promo panel
  promoPanelWrap: { flex: 1, padding: "1.25rem 1.25rem 1.25rem 0" },
  promoPanel: {
    background: "#f5c842",
    borderRadius: "20px",
    padding: "3rem 2.5rem",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  promoBg1: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.05)",
  },
  promoBg2: {
    position: "absolute",
    bottom: "-60px",
    left: "-60px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.04)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fff",
    border: "2px solid #1a1a1a",
    borderRadius: "24px",
    padding: "5px 18px",
    fontSize: "11px",
    fontWeight: 800,
    color: "#1a1a1a",
    letterSpacing: "1.5px",
    width: "fit-content",
    marginBottom: "1.5rem",
    position: "relative",
  },
  promoHeading: {
    fontSize: "34px",
    fontWeight: 900,
    color: "#1a1a1a",
    lineHeight: 1.2,
    margin: "0 0 0.75rem",
    letterSpacing: "-0.5px",
    maxWidth: "320px",
    position: "relative",
  },
  promoSub: {
    fontSize: "14px",
    color: "rgba(0,0,0,0.55)",
    margin: "0 0 2rem",
    lineHeight: 1.6,
    position: "relative",
    maxWidth: "300px",
  },
  mockCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    border: "1.5px solid rgba(0,0,0,0.08)",
    maxWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "relative",
  },
  mockHeader: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  commentRow: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0 },
  commentName: { fontSize: "12px", fontWeight: 700, color: "#1a1a1a" },
  commentMsg: { fontSize: "11px", color: "#888" },
  replyBtn: {
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "6px",
    marginLeft: "auto",
    flexShrink: 0,
  },
}

export const Logo = () => (
  <div style={s.logo}>
    {/* <svg width="24" height="19" viewBox="0 0 24 19" fill="none">
      <rect x="0" y="0"    width="24" height="5"  rx="2.5" fill="#1a1a1a"/>
      <rect x="0" y="7"    width="24" height="5"  rx="2.5" fill="#1a1a1a"/>
      <rect x="0" y="14"   width="24" height="5"  rx="2.5" fill="#1a1a1a"/>
    </svg> */}
    <span style={s.logoText}>Schedly</span>
  </div>
)

export const ErrorMsg = ({ text }) => (
  <div style={s.errorMsg}>
    <div style={s.errorDot}>
      <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>!</span>
    </div>
    <span style={s.errorText}>{text}</span>
  </div>
)

export const InputField = ({
  label,
  type = "text",
  placeholder,
  register,
  error,
  rightElement,
  labelRight,
  iconLeft,
}) => (
  <div style={s.field}>
    <div style={s.labelRow}>
      <label style={s.label}>{label}</label>
      {labelRight}
    </div>
    <div style={s.inputWrap}>
      {iconLeft && <span style={s.inputIcon}>{iconLeft}</span>}
      <input
        type={type}
        placeholder={placeholder}
        style={{
          ...s.input,
          ...(iconLeft ? s.inputWithIcon : {}),
          ...(rightElement ? { paddingRight: "44px" } : {}),
          borderColor: error ? "#e74c3c" : "#e2e2e2",
        }}
        onFocus={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff" }}
        onBlur={e => { e.target.style.borderColor = error ? "#e74c3c" : "#e2e2e2"; e.target.style.background = "#fafafa" }}
        {...(register || {})}
      />
      {rightElement && <span style={s.eyeBtn}>{rightElement}</span>}
    </div>
    {error && <ErrorMsg text={error} />}
  </div>
)

export const SubmitBtn = ({ isSubmitting, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    style={{ ...s.submitBtn, opacity: isSubmitting ? 0.65 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
    onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.opacity = "0.85" }}
    onMouseOut={e => { e.currentTarget.style.opacity = isSubmitting ? "0.65" : "1" }}
  >
    {isSubmitting ? loadingLabel : label}
  </button>
)

export const PromoPanel = ({ badge, heading, sub, children }) => (
  <div style={s.promoPanelWrap}>
    <div style={s.promoPanel}>
      <div style={s.promoBg1} />
      <div style={s.promoBg2} />
      <div style={s.badge}>{badge}</div>
      <h2 style={s.promoHeading}>{heading}</h2>
      {sub && <p style={s.promoSub}>{sub}</p>}
      {children}
    </div>
  </div>
)

export const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)