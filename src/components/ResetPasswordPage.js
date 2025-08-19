import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./style/ResetPasswordPage.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token: urlToken } = useParams(); // token from email link
  const loggedInToken = localStorage.getItem("token"); // logged-in user
  const isLoggedIn = !!loggedInToken;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      let res;

      if (isLoggedIn) {
        // Logged-in user: change password
        res = await fetch("http://localhost:5000/api/auth/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInToken}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
      } else {
        // Forgot password flow
        if (!urlToken) {
          setMessage("No reset token found. Please request a new one.");
          return;
        }

        res = await fetch(
          `http://localhost:5000/api/auth/reset-password/${urlToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          }
        );
      }

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      // Show success
      setMessage(data.message || "Password updated successfully!");
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (!isLoggedIn) localStorage.removeItem("resetToken");

      // Auto-redirect after 2s
      setTimeout(() => {
        navigate(isLoggedIn ? "/dashboard" : "/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Server error, try again later");
    }
  };

  return (
    <div className="reset-container">
      <h2>{isLoggedIn ? "Change Password" : "Reset Password"}</h2>
      <form onSubmit={handleSubmit}>
        {isLoggedIn && (
          <div className="input-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {isLoggedIn ? "Update Password" : "Reset Password"}
        </button>
      </form>

      {message && (
        <p className={`info-text ${success ? "success" : "error"}`}>{message}</p>
      )}

      {success && (
        <div className="success-overlay">
          <div className="success-modal">
            <h3>Password Updated ✅</h3>
            <p>
              You will be redirected to {isLoggedIn ? "Dashboard" : "Login"} shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
