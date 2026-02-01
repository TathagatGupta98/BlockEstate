import React, { useState } from 'react';

export default function CompanyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Dashboard', href: '/' },
    { id: 'proposals', label: 'Browse Proposals', href: '/proposals' },
    { id: 'bids', label: 'My Bids', href: '/bids' },
    { id: 'projects', label: 'Active Projects', href: '/projects' },
    { id: 'profile', label: 'Company Profile', href: '/profile' }
  
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oranienbaum&display=swap');

        .company-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.98) 100%);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 21, 56, 0.1);
          font-family: 'Oranienbaum', serif;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .navbar-logo {
          font-size: 1.8rem;
          font-weight: 400;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          cursor: pointer;
          transition: transform 0.3s ease;
          position: relative;
        }

        .navbar-logo::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b1538, #4a0a1c);
          transition: width 0.4s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.05);
        }

        .navbar-logo:hover::after {
          width: 100%;
        }

        .navbar-links {
          display: flex;
          gap: 15px;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-link {
          position: relative;
          padding: 12px 24px;
          font-size: 1.1rem;
          color: #2c2c2c;
          text-decoration: none;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          border-radius: 8px;
          cursor: pointer;
        }

        .navbar-link::before {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b1538, #4a0a1c);
          transition: width 0.3s ease;
        }

        .navbar-link:hover {
          color: #8b1538;
        }

        .navbar-link:hover::before {
          width: 60%;
        }

        .navbar-link.active {
          background: linear-gradient(135deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 21, 56, 0.3);
        }

        .navbar-link.active::before {
          display: none;
        }

        .navbar-cta {
          padding: 12px 30px;
          background: linear-gradient(135deg, #8b1538 0%, #6b0f2a 50%, #4a0a1c 100%);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-size: 1.1rem;
          letter-spacing: 1px;
          transition: all 0.4s ease;
          box-shadow: 0 4px 15px rgba(139, 21, 56, 0.3);
          position: relative;
          overflow: hidden;
        }

        .navbar-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .navbar-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(139, 21, 56, 0.4);
        }

        .navbar-cta:hover::before {
          left: 100%;
        }

        .hamburger-menu {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 10px;
        }

        .hamburger-line {
          width: 28px;
          height: 3px;
          background: linear-gradient(90deg, #8b1538, #4a0a1c);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-menu.open .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translateY(8px);
        }

        .hamburger-menu.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger-menu.open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translateY(-8px);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.98) 100%);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 30px rgba(139, 21, 56, 0.15);
          padding: 30px 40px;
          animation: slideDown 0.4s ease;
        }

        .mobile-menu.open {
          display: block;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 968px) {
          .navbar-links {
            display: none;
          }

          .hamburger-menu {
            display: flex;
          }

          .navbar-container {
            padding: 0 20px;
          }

          .navbar-logo {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .navbar-logo {
            font-size: 1.2rem;
            letter-spacing: 2px;
          }

          .navbar-container {
            height: 70px;
          }

          .mobile-menu {
            top: 70px;
            padding: 20px;
          }
        }
      `}</style>

      <nav className="company-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => window.location.href = '/'}>
            COMPANIES
          </div>

          {/* Desktop Navigation */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`navbar-link ${activeLink === link.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.id);
                    // Add your navigation logic here
                  }}
                >
                  {link.label}
                </a>
                
              </li>

            ))}
            <li>
              <a href="/logout" className="navbar-cta">
                Sign Out
              </a>
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <div
            className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`navbar-link ${activeLink === link.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.id);
                    setIsMenuOpen(false);
                    // Add your navigation logic here
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/logout" className="navbar-cta">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
