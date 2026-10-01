import React, { useState } from "react";
import STUDENTS from "./students.json";

/* Build a lookup map: regNo (uppercase) -> student info */
const STUDENT_MAP = Object.fromEntries(
  STUDENTS.map((s) => [s.reg.toUpperCase(), s])
);

const BRANCH_COLORS = {
  ECE:  { bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8" },
  AIML: { bg: "#fdf4ff", border: "#a855f7", text: "#7e22ce" },
  IT:   { bg: "#fff7ed", border: "#f97316", text: "#c2410c" },
  EEE:  { bg: "#fefce8", border: "#eab308", text: "#854d0e" },
  CSE:  { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  CSM:  { bg: "#ecfeff", border: "#06b6d4", text: "#0e7490" },
  CSD:  { bg: "#fff0f9", border: "#ec4899", text: "#9d174d" },
  CAI:  { bg: "#faf5ff", border: "#8b5cf6", text: "#6d28d9" },
  MECH: { bg: "#fff1f2", border: "#f43f5e", text: "#9f1239" },
};

const getBranchStyle = (branch) =>
  BRANCH_COLORS[branch?.toUpperCase()] || {
    bg: "#f8fafc", border: "#64748b", text: "#334155",
  };

const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}

  .login-root{min-height:100vh;display:flex;flex-direction:column;
    background:linear-gradient(135deg,#1e1b4b 0%,#4338ca 35%,#7c3aed 65%,#c026d3 100%);}

  .login-bg{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0;}
  .login-bg span{position:absolute;border-radius:50%;opacity:0.12;}
  .login-bg span:nth-child(1){width:400px;height:400px;background:#fff;top:-100px;right:-80px;}
  .login-bg span:nth-child(2){width:300px;height:300px;background:#fff;bottom:-80px;left:-60px;}
  .login-bg span:nth-child(3){width:200px;height:200px;background:#fff;top:40%;left:20%;}

  .login-center{flex:1;display:flex;align-items:center;justify-content:center;
    padding:24px 16px;position:relative;z-index:1;}

  .login-card{background:#fff;border-radius:24px;padding:40px 36px;width:100%;max-width:420px;
    box-shadow:0 32px 80px rgba(0,0,0,0.35);}

  .login-logo{text-align:center;margin-bottom:28px;}
  .login-logo-icon{font-size:48px;display:block;margin-bottom:10px;}
  .login-logo h1{font-size:22px;font-weight:900;color:#1e1b4b;letter-spacing:-0.03em;}
  .login-logo p{font-size:13px;color:#64748b;margin-top:5px;}

  .login-form label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;
    letter-spacing:.06em;color:#64748b;margin-bottom:6px;}
  .login-form .field{margin-bottom:18px;position:relative;}
  .login-form input{width:100%;border:2px solid #e2e8f0;border-radius:12px;padding:13px 14px;
    font-size:15px;color:#0f172a;background:#f8fafc;outline:none;
    transition:border-color .2s,box-shadow .2s;}
  .login-form input:focus{border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,0.12);background:#fff;}
  .login-form input.error-input{border-color:#ef4444;background:#fff5f5;}

  .login-hint{font-size:12px;color:#94a3b8;margin-top:5px;cursor:pointer;}

  .login-btn{width:100%;padding:14px;border:none;border-radius:12px;cursor:pointer;
    font-size:16px;font-weight:700;letter-spacing:.01em;
    background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff;
    box-shadow:0 6px 20px rgba(99,102,241,0.4);transition:all .2s;margin-top:6px;}
  .login-btn:hover:not(:disabled){box-shadow:0 8px 28px rgba(99,102,241,0.55);transform:translateY(-1px);}
  .login-btn:disabled{opacity:.7;cursor:not-allowed;transform:none;}

  .login-error{background:#fef2f2;border:1.5px solid #fca5a5;color:#dc2626;
    border-radius:10px;padding:11px 14px;font-size:13.5px;font-weight:500;margin-bottom:16px;
    display:flex;align-items:center;gap:8px;}

  .login-footer{text-align:center;padding:16px;font-size:12px;
    color:rgba(255,255,255,0.55);position:relative;z-index:1;}

  /* ────── Welcome bar ────── */
  .welcome-bar{
    background:linear-gradient(90deg,#1e1b4b 0%,#4338ca 40%,#7c3aed 75%,#c026d3 100%);
    padding:0 20px;min-height:64px;
    display:flex;align-items:center;justify-content:space-between;
    gap:12px;flex-wrap:wrap;
    box-shadow:0 4px 20px rgba(67,56,202,0.5);}

  .wb-left{display:flex;align-items:center;gap:14px;}

  .wb-avatar{
    width:44px;height:44px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,#818cf8,#c084fc);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;font-weight:900;color:#fff;
    border:2.5px solid rgba(255,255,255,0.4);
    box-shadow:0 0 0 4px rgba(255,255,255,0.1),0 4px 12px rgba(0,0,0,0.25);}

  .wb-name{font-size:14px;font-weight:800;color:#fff;
    letter-spacing:0.01em;text-shadow:0 1px 6px rgba(0,0,0,0.25);}
  .wb-reg{font-size:11px;color:rgba(255,255,255,0.6);
    margin-top:2px;font-weight:500;letter-spacing:0.05em;}

  .wb-branch{
    font-size:11px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;
    padding:5px 14px;border-radius:99px;border:2px solid;
    box-shadow:0 2px 10px rgba(0,0,0,0.15);white-space:nowrap;}

  .wb-right{display:flex;align-items:center;gap:10px;}

  .wb-greeting{
    font-size:12.5px;color:rgba(255,255,255,0.65);
    font-style:italic;white-space:nowrap;}

  .logout-btn{
    display:flex;align-items:center;gap:6px;
    background:linear-gradient(135deg,#ef4444,#b91c1c);
    border:none;color:#fff;padding:9px 20px;border-radius:10px;
    font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;
    box-shadow:0 4px 14px rgba(239,68,68,0.5);transition:all .2s;}
  .logout-btn:hover{
    box-shadow:0 6px 20px rgba(239,68,68,0.65);transform:translateY(-1px);}

  @media(max-width:600px){
    .login-card{padding:28px 22px;}
    .login-logo h1{font-size:19px;}
    .wb-greeting{display:none;}
    .welcome-bar{padding:0 12px;min-height:56px;}
    .wb-avatar{width:38px;height:38px;font-size:14px;}
  }
`;

export default function Login({ onLogin }) {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const reg = regNo.trim().toUpperCase();
    const pass = password.trim().toUpperCase();
    if (!reg) { setError("Please enter your Registration Number."); return; }
    if (!pass) { setError("Please enter your Password."); return; }
    setLoading(true);
    setTimeout(() => {
      const student = STUDENT_MAP[reg];
      if (!student) {
        setError("Registration number not found. Please check and try again.");
        setLoading(false);
        return;
      }
      if (pass !== reg) {
        setError("Incorrect password. Your password is your Registration Number.");
        setLoading(false);
        return;
      }
      setLoading(false);
      onLogin(student);
    }, 600);
  };

  return (
    <div className="login-root">
      <style>{CSS}</style>
      <div className="login-bg"><span /><span /><span /></div>

      <div className="login-center">
        <div className="login-card">
          <div className="login-logo">
            <span className="login-logo-icon">🎯</span>
            <h1>HCL Question Bank 2026</h1>
            <p>On-Campus Drive – Phase I Practice Portal</p>
          </div>

          {error && (
            <div className="login-error"><span>⚠️</span> {error}</div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Registration Number</label>
              <input
                type="text"
                placeholder="e.g. 23FE1A0202"
                value={regNo}
                onChange={(e) => { setRegNo(e.target.value); setError(""); }}
                className={error && !regNo.trim() ? "error-input" : ""}
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={
                  error && password.trim() &&
                  password.trim().toUpperCase() !== regNo.trim().toUpperCase()
                    ? "error-input" : ""
                }
                autoComplete="current-password"
              />
              <div className="login-hint" onClick={() => setShowPass(p => !p)}>
                {showPass ? "🙈 Hide password" : "👁️ Show password"}
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in…" : "Login →"}
            </button>
          </form>
        </div>
      </div>

      <div className="login-footer">
        © 2026 HCL On-Campus Drive – Phase I Question Bank · {Object.keys(STUDENT_MAP).length} registered students
      </div>
    </div>
  );
}

const WELCOME_CSS = `
  .welcome-bar{
    background:linear-gradient(90deg,#1e1b4b 0%,#4338ca 40%,#7c3aed 75%,#c026d3 100%);
    padding:0 20px;min-height:64px;
    display:flex;align-items:center;justify-content:space-between;
    gap:12px;flex-wrap:wrap;
    box-shadow:0 4px 20px rgba(67,56,202,0.5);
    font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
  .wb-left{display:flex;align-items:center;gap:14px;}
  .wb-avatar{
    width:44px;height:44px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,#818cf8,#c084fc);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;font-weight:900;color:#fff;
    border:2.5px solid rgba(255,255,255,0.4);
    box-shadow:0 0 0 4px rgba(255,255,255,0.12),0 4px 14px rgba(0,0,0,0.3);}
  .wb-name{font-size:14px;font-weight:800;color:#fff;letter-spacing:0.01em;
    text-shadow:0 1px 6px rgba(0,0,0,0.25);}
  .wb-reg{font-size:11px;color:rgba(255,255,255,0.6);
    margin-top:2px;font-weight:500;letter-spacing:0.05em;}
  .wb-branch{
    font-size:11px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;
    padding:5px 14px;border-radius:99px;border:2px solid;
    box-shadow:0 2px 10px rgba(0,0,0,0.15);white-space:nowrap;}
  .wb-right{display:flex;align-items:center;gap:10px;}
  .wb-greeting{font-size:12.5px;color:rgba(255,255,255,0.7);
    font-style:italic;white-space:nowrap;}
  .logout-btn{
    display:flex;align-items:center;gap:6px;
    background:linear-gradient(135deg,#ef4444,#b91c1c);
    border:none;color:#fff;padding:9px 20px;border-radius:10px;
    font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;
    box-shadow:0 4px 14px rgba(239,68,68,0.5);transition:all .2s;}
  .logout-btn:hover{
    box-shadow:0 6px 20px rgba(239,68,68,0.65);transform:translateY(-1px);}
  @media(max-width:600px){
    .wb-greeting{display:none;}
    .welcome-bar{padding:0 12px;min-height:56px;}
    .wb-avatar{width:38px;height:38px;font-size:13px;}}
`;

/* ────── Welcome bar (shown above the question bank after login) ────── */
export function WelcomeBar({ student, onLogout }) {
  const bs = getBranchStyle(student.branch);
  const initials = student.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <>
      <style>{WELCOME_CSS}</style>
      <div className="welcome-bar">
        <div className="wb-left">
          <div className="wb-avatar">{initials}</div>
          <div>
            <div className="wb-name">👋 {student.name}</div>
            <div className="wb-reg">{student.reg}</div>
          </div>
          <span
            className="wb-branch"
            style={{ background: bs.bg, borderColor: bs.border, color: bs.text }}
          >
            {student.branch}
          </span>
        </div>
        <div className="wb-right">
          <span className="wb-greeting">✨ Good luck with your prep!</span>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}
