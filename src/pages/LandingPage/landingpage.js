import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';

const LandingPage = ({ userRole = 'admin', userName = "Reem Radwan" }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Format time (2:31 AM format)
  const formatTime = () => {
    return currentDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date (Tuesday, 28 April 2026 format)
  const formatDate = () => {
    return currentDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get welcome message based on time
  const getWelcomeMessage = () => {
    const hour = currentDateTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="homepage">
      {/* Building SVG Background Pattern */}
      <div className="building-pattern">
        <svg className="pattern-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="buildingPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Building 1 */}
              <rect x="10" y="40" width="25" height="150" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>
              <rect x="15" y="50" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              <rect x="25" y="50" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              <rect x="15" y="65" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              <rect x="25" y="65" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              <rect x="15" y="80" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              <rect x="25" y="80" width="5" height="8" fill="rgba(59,130,246,0.12)"/>
              
              {/* Building 2 */}
              <rect x="55" y="20" width="30" height="170" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>
              <rect x="62" y="30" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="73" y="30" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="62" y="48" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="73" y="48" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="62" y="66" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="73" y="66" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="62" y="84" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              <rect x="73" y="84" width="6" height="10" fill="rgba(59,130,246,0.12)"/>
              
              {/* Building 3 */}
              <rect x="110" y="60" width="20" height="130" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>
              <rect x="115" y="70" width="4" height="6" fill="rgba(59,130,246,0.12)"/>
              <rect x="122" y="70" width="4" height="6" fill="rgba(59,130,246,0.12)"/>
              <rect x="115" y="82" width="4" height="6" fill="rgba(59,130,246,0.12)"/>
              <rect x="122" y="82" width="4" height="6" fill="rgba(59,130,246,0.12)"/>
              
              {/* Building 4 */}
              <rect x="155" y="10" width="35" height="180" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="2"/>
              <rect x="163" y="20" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
              <rect x="175" y="20" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
              <rect x="163" y="40" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
              <rect x="175" y="40" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
              <rect x="163" y="60" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
              <rect x="175" y="60" width="7" height="12" fill="rgba(59,130,246,0.12)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#buildingPattern)"/>
        </svg>
      </div>

      <div className="container">
        {/* Hero Section with Buildings */}
        <div className="hero-section">
          <div className="hero-left">
            <div className="buildings-illustration">
              <svg className="buildings-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                {/* Building 1 - Tall Skyscraper */}
                <rect x="30" y="80" width="60" height="200" fill="url(#buildingGrad1)" stroke="rgba(59,130,246,0.3)" strokeWidth="2"/>
                <rect x="40" y="100" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="55" y="100" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="70" y="100" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="40" y="120" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="55" y="120" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="70" y="120" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="40" y="140" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="55" y="140" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                <rect x="70" y="140" width="8" height="12" fill="rgba(59,130,246,0.3)"/>
                {/* Antenna */}
                <line x1="60" y1="80" x2="60" y2="50" stroke="rgba(59,130,246,0.4)" strokeWidth="3"/>
                <circle cx="60" cy="48" r="3" fill="#ef4444" opacity="0.6"/>

                {/* Building 2 - Wide Building */}
                <rect x="110" y="110" width="80" height="170" fill="url(#buildingGrad2)" stroke="rgba(59,130,246,0.3)" strokeWidth="2"/>
                <rect x="120" y="130" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="135" y="130" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="150" y="130" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="165" y="130" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="120" y="150" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="135" y="150" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="150" y="150" width="8" height="10" fill="rgba(59,130,246,0.3)"/>
                <rect x="165" y="150" width="8" height="10" fill="rgba(59,130,246,0.3)"/>

                {/* Building 3 - Medium Tower */}
                <rect x="210" y="60" width="50" height="220" fill="url(#buildingGrad3)" stroke="rgba(59,130,246,0.3)" strokeWidth="2"/>
                <rect x="220" y="80" width="6" height="8" fill="rgba(59,130,246,0.3)"/>
                <rect x="232" y="80" width="6" height="8" fill="rgba(59,130,246,0.3)"/>
                <rect x="244" y="80" width="6" height="8" fill="rgba(59,130,246,0.3)"/>
                <rect x="220" y="96" width="6" height="8" fill="rgba(59,130,246,0.3)"/>
                <rect x="232" y="96" width="6" height="8" fill="rgba(59,130,246,0.3)"/>
                <rect x="244" y="96" width="6" height="8" fill="rgba(59,130,246,0.3)"/>

                {/* Building 4 - Small Building */}
                <rect x="280" y="150" width="70" height="130" fill="url(#buildingGrad4)" stroke="rgba(59,130,246,0.3)" strokeWidth="2"/>
                <rect x="290" y="165" width="7" height="9" fill="rgba(59,130,246,0.3)"/>
                <rect x="305" y="165" width="7" height="9" fill="rgba(59,130,246,0.3)"/>
                <rect x="320" y="165" width="7" height="9" fill="rgba(59,130,246,0.3)"/>
                <rect x="290" y="182" width="7" height="9" fill="rgba(59,130,246,0.3)"/>
                <rect x="305" y="182" width="7" height="9" fill="rgba(59,130,246,0.3)"/>
                <rect x="320" y="182" width="7" height="9" fill="rgba(59,130,246,0.3)"/>

                <defs>
                  <linearGradient id="buildingGrad1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.15)"/>
                    <stop offset="100%" stopColor="rgba(59,130,246,0.05)"/>
                  </linearGradient>
                  <linearGradient id="buildingGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(139,92,246,0.15)"/>
                    <stop offset="100%" stopColor="rgba(139,92,246,0.05)"/>
                  </linearGradient>
                  <linearGradient id="buildingGrad3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.15)"/>
                    <stop offset="100%" stopColor="rgba(16,185,129,0.05)"/>
                  </linearGradient>
                  <linearGradient id="buildingGrad4" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(245,158,11,0.15)"/>
                    <stop offset="100%" stopColor="rgba(245,158,11,0.05)"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="hero-right">
            <div className="welcome-card">
              <div className="welcome-badge">
                <span className="badge-icon">🏢</span>
                <span className="badge-text">Prometheus Real Estate</span>
              </div>
              <h1 className="welcome-title">
                {getWelcomeMessage()},<br />
                <span className="user-name">{userName}</span>
              </h1>
              <p className="welcome-message">
                Welcome to your real estate management platform
              </p>
              <div className="datetime-card">
                <div className="time-large">{formatTime()}</div>
                <div className="date-large">📅 {formatDate()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Building Row */}
        <div className="decorative-buildings">
          <div className="building-row">
            <div className="mini-building"></div>
            <div className="mini-building medium"></div>
            <div className="mini-building tall"></div>
            <div className="mini-building"></div>
            <div className="mini-building medium"></div>
            <div className="mini-building tall"></div>
            <div className="mini-building"></div>
          </div>
        </div>

        {/* Platform Info Section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">🏗️</div>
            <h3>Enterprise Platform</h3>
            <p>Comprehensive real estate management solution for modern businesses</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Bank-grade security with role-based access control</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Real-Time Insights</h3>
            <p>Live data synchronization and instant updates</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="10" width="4" height="15" fill="currentColor" opacity="0.6"/>
                <rect x="9" y="6" width="4" height="19" fill="currentColor" opacity="0.8"/>
                <rect x="15" y="3" width="4" height="22" fill="currentColor"/>
                <rect x="21" y="8" width="4" height="17" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <span className="footer-logo-text">Prometheus</span>
          </div>
          <div className="footer-copyright">
            © 2026 Prometheus Real Estate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;