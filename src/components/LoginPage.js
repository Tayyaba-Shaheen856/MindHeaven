import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      // Store JWT token + user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login successful!');
      navigate('/personality');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;



// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './style/LoginPage.css';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       const storedUser = JSON.parse(localStorage.getItem('user'));
      
//       if (!storedUser) {
//         alert('No registered user found. Please register first.');
//         setLoading(false);
//         return;
//       }

//       // Check credentials
//       if (
//         storedUser.email === formData.email &&
//         localStorage.getItem('password') === formData.password
//       ) {
//         localStorage.setItem('isLoggedIn', 'true');
//         navigate('/personality');
//       } else {
//         alert('Invalid email or password!');
//       }

//       setLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>Login to Your Account</h2>
//         <form onSubmit={handleSubmit}>
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

//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         {/* Forgot Password + Create Account Links */}
//         <div className="login-links">
//           <Link to="/forgot">Forgot Password?</Link>
//           <span> | </span>
//           <Link to="/register">Create your account</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;