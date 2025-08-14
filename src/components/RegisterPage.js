// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './style/RegisterPage.css';

// const RegistrationPage = () => {
//   const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: '', // Note: backend currently doesn't store name
//             email: '',
//                 password: '',
//                     confirmPassword: '',
//                       });

//                         const [loading, setLoading] = useState(false);

//                           const handleChange = (e) => {
//                               setFormData({ ...formData, [e.target.name]: e.target.value });
//                                 };

//                                   const handleSubmit = async (e) => {
//                                       e.preventDefault();

//                                           if (formData.password !== formData.confirmPassword) {
//                                                 alert('Passwords do not match!');
//                                                       return;
//                                                           }

//                                                               setLoading(true);

//                                                                   try {
//                                                                         const response = await fetch('http://localhost:5000/api/auth/register', {
//                                                                                 method: 'POST',
//                                                                                         headers: {
//                                                                                                   'Content-Type': 'application/json',
//                                                                                                           },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (!response.ok) {
//         alert(data.error || 'Registration failed');
//         return;
//       }

//       // Store token + user in localStorage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));

//       // Redirect to test page
//       navigate('/personality');
//     } catch (error) {
//       console.error('Error registering:', error);
//       setLoading(false);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className="registration-page">
//       <div className="form-container">
//         <h2>Create Your Account</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegistrationPage;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/RegisterPage.css"; 
const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    openness: "",
    conscientiousness: "",
    extraversion: "",
    agreeableness: "",
    neuroticism: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

<<<<<<< HEAD
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
=======
                                                                  try {
                                                                        const response = await fetch('https://upgraded-space-lamp-x5q9xvxq4p6qhvw55-5000.app.github.dev/api/register', {
                                                                                method: 'POST',
                                                                                        headers: {
                                                                                                  'Content-Type': 'application/json',
                                                                                                          },
>>>>>>> a427266 (Update backend and components with latest changes)
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          gender: formData.gender,
          openness: formData.openness,
          conscientiousness: formData.conscientiousness,
          extraversion: formData.extraversion,
          agreeableness: formData.agreeableness,
          neuroticism: formData.neuroticism,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/personality");
    } catch (error) {
      console.error("Error registering:", error);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <input
  type="date"
  name="dateOfBirth"
  placeholder="Enter your date of birth"
  value={formData.dateOfBirth}
  onChange={handleChange}
  required
/>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

         
          

          



          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;