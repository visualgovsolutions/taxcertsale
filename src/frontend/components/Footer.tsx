import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Tax Certificate Sale Platform</p>
        <div className="footer-links">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;