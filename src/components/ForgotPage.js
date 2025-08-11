// import React, { useState } from "react";
// import "./style/ForgotPage.css"; // simple CSS file

// function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Reset link sent to ${email}`);
//     setEmail("");
//   };

//   return (
//     <div className="forgot-container">
//       <h2>Forgot Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>
//     </div>
//   );
// }

// export default ForgotPassword;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ForgotPage.css";

function ForgotPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email!");
      return;
    }

    alert(`Reset link sent to ${email}`);

    // yahan navigate karein reset page par
    navigate("/resetpage");
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
    </div>
  );
}

export default ForgotPage;
