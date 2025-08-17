import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ForgotPage.css";

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your email!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      setMessage(data.message);

      // 👇 Save token in localStorage for ResetPasswordPage
      if (data.token) {
        localStorage.setItem("resetToken", data.token);
      }

      // Navigate to reset password page
      navigate("/resetpage");
    } catch (err) {
      console.error(err);
      setMessage("Server error, try again later");
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="info-text">{message}</p>}
    </div>
  );
}

export default ForgotPage;