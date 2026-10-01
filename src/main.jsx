import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login, { WelcomeBar } from "./Login.jsx";

function Root() {
  const [student, setStudent] = useState(() => {
    try {
      const saved = window.sessionStorage.getItem("hcl_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (s) => {
    try { window.sessionStorage.setItem("hcl_user", JSON.stringify(s)); } catch {}
    setStudent(s);
  };

  const handleLogout = () => {
    try { window.sessionStorage.removeItem("hcl_user"); } catch {}
    setStudent(null);
  };

  if (!student) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <WelcomeBar student={student} onLogout={handleLogout} />
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
