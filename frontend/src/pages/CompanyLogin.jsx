import React, { useState } from 'react';

export default function CompanyLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login submitted:', formData);
      setIsLoading(false);
      // Add your login logic here
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Oranienbaum', serif;
          overflow-x: hidden;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 25%, #f5f5f5 50%, #fafafa 75%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 21, 56, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
        }

        .login-container::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(107, 15, 42, 0.06) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 15s infinite ease-in-out reverse;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        .login-split {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 60px 20px;
          position: relative;
          z-index: 1;
        }



        .login-form-wrapper {
          width: 100%;
          max-width: 480px;
          animation: fadeInUp 1s ease forwards;
        }

        .form-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .form-title {
          font-size: 3rem;
          color: #2c2c2c;
          margin-bottom: 15px;
          font-weight: 400;
          letter-spacing: 2px;
        }

        .form-subtitle {
          font-size: 1.2rem;
          color: #666;
          letter-spacing: 1px;
        }

        .login-form {
          background: white;
          padding: 50px 40px;
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(139, 21, 56, 0.15);
          position: relative;
        }

        .login-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          border-radius: 30px 30px 0 0;
        }

        .form-group {
          margin-bottom: 30px;
        }

        .form-label {
          display: block;
          font-size: 1.1rem;
          color: #2c2c2c;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          font-size: 1.1rem;
          font-family: 'Oranienbaum', serif;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .form-input:focus {
          outline: none;
          border-color: #8b1538;
          background: white;
          box-shadow: 0 4px 15px rgba(139, 21, 56, 0.1);
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          color: #8b1538;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-family: 'Oranienbaum', serif;
          letter-spacing: 0.5px;
        }

        .password-toggle:hover {
          color: #6b0f2a;
          text-decoration: underline;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #8b1538;
        }

        .checkbox-label {
          font-size: 1rem;
          color: #666;
          cursor: pointer;
        }

        .forgot-link {
          font-size: 1rem;
          color: #8b1538;
          text-decoration: none;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .forgot-link:hover {
          color: #6b0f2a;
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          font-size: 1.3rem;
          font-family: 'Oranienbaum', serif;
          background: linear-gradient(135deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          letter-spacing: 2px;
          transition: all 0.4s ease;
          box-shadow: 0 8px 25px rgba(139, 21, 56, 0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(139, 21, 56, 0.4);
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:active {
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 30px;
          font-size: 1.1rem;
          color: #666;
        }

        .signup-link {
          color: #8b1538;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .signup-link:hover {
          color: #6b0f2a;
          text-decoration: underline;
        }

        .back-home {
          position: absolute;
          top: 40px;
          left: 40px;
          padding: 12px 30px;
          background: white;
          color: #8b1538;
          text-decoration: none;
          border-radius: 50px;
          font-size: 1.1rem;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          box-shadow: 0 4px 15px rgba(139, 21, 56, 0.15);
          z-index: 10;
        }

        .back-home:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 21, 56, 0.25);
          background: linear-gradient(135deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          color: white;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .login-form {
            padding: 40px 30px;
          }

          .form-title {
            font-size: 2.2rem;
          }

          .back-home {
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            font-size: 1rem;
          }

          .form-options {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>

      <a href="/" className="back-home">← Back to Home</a>

      <div className="login-split">
        {/* Login Form */}
        <div className="login-form-wrapper">
          <div className="form-header">
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-subtitle">Sign in to your company account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="your@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="form-checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="form-footer">
              Don't have an account?{' '}
              <a href="/signup" className="signup-link">
                Register your company
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
