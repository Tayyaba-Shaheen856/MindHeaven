import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/LandingPage.css";
import 'animate.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
  <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
  <Link className="navbar-brand" to="/">
    <img src="images/logo.png" alt="Logo" style={{ height: "40px" }} />
  </Link>

  <div className="ms-auto">
    <Link to="/login" className="btn btn-success">
      Login
    </Link>
  </div>
</div>
        </nav>
        <div className="responsive-menu"></div>
      </div>
    </header>
      {/* ================= Hero Section ================= */}
      
        

        <div className="hero parallaxie">
      <div className="container">
        <div className="hero-dots">
          <span className="dot dot1"></span>
          <span className="dot dot2"></span>
          <span className="dot dot3"></span>
          <span className="dot dot4"></span>
          <span className="dot dot5"></span>
          <span className="dot dot6"></span>
          <span className="dot dot7"></span>
          <span className="dot dot8"></span>
        </div>
        <div className="row align-items-center">
          {/* Left Content Column */}
          <div className="col-lg-6">
            {/* Hero Content Start */}
            <div className="hero-content">
              {/* Section Title Start */}
              <div className="section-title">
                <h3 className="wow fadeInUp">welcome to MindHeaven</h3>
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  Discover Your Personality with Us
                </h1>
                <p className="wow fadeInUp" data-wow-delay="0.2s">
                  Are you curious about exploring your personality and finding what truly inspires you? Our platform is designed to guide you on a journey of self-understanding and growth. With personalized recommendations, mood tracking, journals, and daily tasks, we help you stay balanced, creative, and motivated every day.
                </p>
              </div>
              {/* Section Title End */}

              {/* Hero Content Body Start */}
              <div className="hero-content-body">
                {/* Hero Button Start */}
                <div className="hero-btn wow fadeInUp" data-wow-delay="0.4s">
                   <button
                   className="btn-default"
                   onClick={() => setShowInstructions(true)}
                   >
                   Take A Test
                   </button>
                   </div>
                {/* Hero Button End */}
              </div>
              {/* Hero Content Body End */}
            </div>
            {/* Hero Content End */}
          </div>
          {/* Left Content Column End */}

          {/* Right Image Column (optional, uncomment if needed) */}
          
          <div className="col-lg-6">
            <div className="hero-image wow fadeInRight" data-wow-delay="0.3s">
              <img
                src="/images/hero.webp"
                alt="Hero"
                className="img-fluid"
              />
            </div>
          </div> 
          
          {/* Right Image Column End */}
        </div>

        {/* Hero List Start */}
        <div className="hero-list wow fadeInUp" data-wow-delay="0.6s">
          <ul>
            <li>Personality Discovery</li>
            <li>Personalized Recommendations</li>
            <li>Mood Tracking</li>
            <li>Journals & Reflections</li>
             <li>Daily Tasks</li>
          </ul>
        </div>
        {/* Hero List End */}
      </div>
    </div>


    {/*nstruction model */}
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-modal">
            <h2>How to Take the Test</h2>
            <p>
              This test takes approximately 5-10 minutes.
              <br />
              Answer honestly and enjoy discovering your personality!
            </p>
            <button
              className="auth-btn take-test-btn pulse"
              onClick={() => navigate("/personality")}
            >
              I'm Ready!
            </button>
            <button
              className="close-btn"
              onClick={() => setShowInstructions(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="about-us">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Side Images */}
          <div className="col-lg-6">
            <div className="about-us-images">
              {/* About Image 1 */}
              <div className="about-img-1">
                <figure className="image-anime">
                  <img src="images/about-img1.jpg" alt="About Us 1" />
                </figure>
              </div>

              {/* About Image 2 */}
              <div className="about-img-2">
                <figure className="image-anime">
                  <img src="images/hero-image.jpg" alt="About Us 2" />
                </figure>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="col-lg-6">
            <div className="about-us-content">
              {/* Section Title */}
              <div className="section-title">
                <h3 className="wow fadeInUp">about us</h3>
                <h2
                  className="text-anime-style-2"
                  data-cursor="-opaque"
                >
                 Explore Your Personality, Find What Inspires You, Live Your Best Self
                </h2>
                <p
                  className="wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  Our platform is built to help you understand yourself better and live a more balanced life. By guiding minds through the Big Five Personality Test, we uncover your unique traits and provide personalized recommendations in movies, music, and books that truly connect with you.
                </p>
              </div>

              {/* Vision & Mission */}
              <div className="about-vision-mission">
                {/* Vision */}
                <div
                  className="vision-mission-content wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <h3>our vision</h3>
                  <p>
                    Our vision is to create a world where self-discovery and personal growth are accessible to everyone. We aim to make personality insights, mood tracking, and personalized recommendations a stigma-free and empowering experience—helping individuals live with clarity, balance, and confidence.
                  </p>
                </div>

                {/* Mission */}
                <div
                  className="vision-mission-content wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <h3>our mission</h3>
                  <ul>
                    <li>Guide Self-Discovery</li>
                    <li>Promote Mental Wellness</li>
                    <li>Empower Productivity</li>
                  </ul>
                </div>
              </div>
              {/* Vision & Mission End */}
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="our-services">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-6 col-md-9">
            {/* Section Title */}
            <div className="section-title">
              <h3 className="wow fadeInUp">services</h3>
              <h2 className="text-anime-style-2" data-cursor="-opaque">
                Explore Our Features for Mind and Growth
              </h2>
            </div>
          </div>

          <div className="col-lg-6 col-md-3">
            {/* Section Button */}
            <div
              className="section-btn wow fadeInUp"
              data-wow-delay="0.2s"
            >
              <Link to="/personality" className="btn-default">
                view all Recommendations
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Service Item 1 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="service-item wow fadeInUp"
              data-wow-delay="0.2s"
            >
              <div className="service-image">
                <Link to="/service-single" data-cursor-text="View">
                  <figure className="image-anime">
                    <img src="images/music.jfif" alt="Service 1" />
                  </figure>
                </Link>
              </div>
              <div className="service-content">
                <h3>Music</h3>
              </div>
            </div>
          </div>

          {/* Service Item 2 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="service-item wow fadeInUp"
              data-wow-delay="0.4s"
            >
              <div className="service-image">
                <Link to="/service-single" data-cursor-text="View">
                  <figure className="image-anime">
                    <img src="images/movie.jfif" alt="Service 2" />
                  </figure>
                </Link>
              </div>
              <div className="service-content">
                <h3>Movies</h3>
              </div>
            </div>
          </div>

          {/* Service Item 3 */}
          <div className="col-lg-4 col-md-6">
            <div
              className="service-item wow fadeInUp"
              data-wow-delay="0.6s"
            >
              <div className="service-image">
                <Link to="/service-single" data-cursor-text="View">
                  <figure className="image-anime">
                    <img src="images/book.jfif" alt="Service 3" />
                  </figure>
                </Link>
              </div>
              <div className="service-content">
                <h3>Books</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div className="why-choose-us">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="why-choose-us-box">
              {/* Why Choose Image Start */}
              <div className="why-choose-image">
                <figure className="image-anime reveal">
                  <img src="/images/why-choose-us.jpg" alt="Why Choose Us" />
                </figure>
              </div>
              {/* Why Choose Image End */}

              {/* Why Choose Content Start */}
              <div className="why-choose-content">
                {/* Section Title */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">why choose us</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Personalized guidance, meaningful growth
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    With a commitment to self-discovery and personal growth, we empower individuals to create lasting positive change in their lives. Through the Big Five Personality Test, personalized recommendations, mood tracking, journaling, and daily tasks, our platform provides tools that inspire reflection, balance, and motivation every day.
                  </p>
                </div>

                {/* Why Choose List */}
                <div className="why-choose-list">
                  <div className="why-choose-item wow fadeInUp">
                    <div className="icon-box">
                      <img src="/images/icon-why-choose-1.svg" alt="" />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Commitment to Growth</h3>
                    </div>
                  </div>

                  <div
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="icon-box">
                      <img src="/images/icon-why-choose-2.svg" alt="" />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Personalized Insights</h3>
                    </div>
                  </div>

                  <div
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.4s"
                  >
                    <div className="icon-box">
                      <img src="/images/icon-why-choose-3.svg" alt="" />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Tailored Recommendations</h3>
                    </div>
                  </div>

                  <div
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.6s"
                  >
                    <div className="icon-box">
                      <img src="/images/icon-why-choose-4.svg" alt="" />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Safe & Private</h3>
                    </div>
                  </div>
                </div>

                {/* Why Choose Body */}
                <div className="why-choose-body">
                  <div className="why-choose-body-image">
                    <figure className="image-anime reveal">
                      <img src="/images/choose-us-img-2.jpg" alt="" />
                    </figure>
                  </div>

                  <div className="why-choose-body-content wow fadeInUp">
                    <h3>Explore, Reflect, Transform</h3>
                    <p>
                      Choosing us means choosing a platform dedicated to your self-discovery and growth. Our holistic approach combines psychology-based insights, personalized recommendations, and wellness tools to help you live with balance, confidence, and clarity.
                    </p>
                  </div>
                </div>
              </div>
              {/* Why Choose Content End */}
            </div>
          </div>
        </div>
      </div>
    </div>


    

   <div className="how-it-work">
      <div className="container">
        {/* Section Title */}
        <div className="row section-row align-items-center">
          <div className="col-lg-6">
            <div className="section-title">
              <h3 className="wow fadeInUp">how it work</h3>
              <h2 className="text-anime-style-2" data-cursor="-opaque">
                Guiding you our work process
              </h2>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="row">
          <div className="col-lg-12">
            <div className="how-work-step-box">
              {/* Step 1 */}
              <div className="how-work-step-item wow fadeInUp">
                <div className="how-work-step-no">
                  <h3>01</h3>
                </div>
                <div className="how-work-step-content">
                  <h3>01.Take the Personality Test</h3>
                  <p>Complete the Big Five Personality Test to uncover your unique personality traits.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="how-work-step-item wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="how-work-step-no">
                  <h3>02</h3>
                </div>
                <div className="how-work-step-content">
                  <h3>02.View Your Results</h3>
                  <p>Get instant insights about your personality in an easy-to-understand report.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className="how-work-step-item wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <div className="how-work-step-no">
                  <h3>03</h3>
                </div>
                <div className="how-work-step-content">
                  <h3>03. Explore Recommendations</h3>
                  <p>Receive personalized suggestions for movies, music, and books tailored to your traits.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div
                className="how-work-step-item wow fadeInUp"
                data-wow-delay="0.6s"
              >
                <div className="how-work-step-no">
                  <h3>04</h3>
                </div>
                <div className="how-work-step-content">
                  <h3>04. Track & Grow</h3>
                  <p>Monitor your mood, write journals, and manage your daily tasks to support your personal growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

       <footer className="main-footer">
      <div className="footer-copyright">
        <div className="row align-items-center">
          <div className="col-md-12 text-center">
            <div className="footer-copyright-text">
              <p>Copyright © 2024 All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default LandingPage;










