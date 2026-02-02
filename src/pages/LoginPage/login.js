import React, { useState } from 'react';
import './login.css';

const RealEstateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrors({ email: '', password: '' });
    
    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = '/cataloge';
    }, 400);
  };

  return (
    <div className="re-login-container">
      <div className="re-login-card">
        {/* Left Side */}
        <div className="re-login-left">
          <div className="re-brand">
            <svg 
              className="re-brand-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>PROMETHEUS</span>
          </div>

          <div className="re-welcome-content">
            <h1 className="re-welcome-title">WELCOME<br />BACK</h1>
            <p className="re-welcome-subtitle">Nice to see you again</p>
          </div>

          <div></div>
        </div>

        {/* Right Side */}
        <div className="re-login-right">
          <div className="re-login-header">
            <h2 className="re-login-title">Login</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="re-form-group">
              <label className="re-form-label">Email</label>
              <input
                type="email"
                className={`re-form-input ${errors.email ? 're-form-input-error' : ''}`}
                placeholder="Enter Your Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="re-error-message">{errors.email}</div>
              )}
            </div>

            <div className="re-form-group">
              <label className="re-form-label">Password</label>
              <div className="re-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`re-form-input ${errors.password ? 're-form-input-error' : ''}`}
                  placeholder="Enter Your Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="re-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="re-error-message">{errors.password}</div>
              )}
            </div>

            <button 
              type="submit" 
              className="re-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RealEstateLogin;