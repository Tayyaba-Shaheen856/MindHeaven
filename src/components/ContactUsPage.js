import React from 'react';
import './style/ContactUsPage.css';

const ContactUsPage = () => {
  return (
    <div className="contact-us-page">
      <h1>Facing problems or want to help us improve?</h1>
      <p>Let us know! You can reach us via email or follow us on social media:</p>

      <div className="contact-details">
        <h3>Email</h3>
        <ul>
          <li><a href="mailto:support@mindheaven.com">support@mindheaven.com</a></li>
          <li><a href="mailto:feedback@mindheaven.com">feedback@mindheaven.com</a></li>
        </ul>

        <h3>Follow Us</h3>
        <ul className="social-links">
          <li><a href="https://twitter.com/mindheaven" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li><a href="https://facebook.com/mindheaven" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href="https://instagram.com/mindheaven" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUsPage;
