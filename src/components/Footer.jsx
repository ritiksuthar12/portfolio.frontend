import React from 'react';
import { ArrowUp, Lock, ShieldCheck } from 'lucide-react';

export default function Footer({ onOpenAdmin, isAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-wrap">
            <div className="footer-brand-header">
              <span className="footer-brand-title">
                RS
              </span>
              <span className="footer-brand-sub">
                | Ritik Suthar Portfolio
              </span>
            </div>
            <p className="footer-brand-desc">
              Full Stack Developer • MERN Stack • REST APIs
            </p>
          </div>

          <div className="footer-actions-wrap">
            <button
              onClick={onOpenAdmin}
              aria-label={isAdmin ? 'Admin Authenticated (Dashboard)' : 'Open Admin Login'}
              className={`footer-admin-btn ${isAdmin ? 'auth' : ''}`}
            >
              {isAdmin ? <ShieldCheck size={15} /> : <Lock size={15} />}
              {isAdmin ? 'Admin Authenticated' : 'Admin Login'}
            </button>

            <button
              onClick={scrollToTop}
              className="social-btn"
              style={{ width: '38px', height: '38px' }}
              title="Back to top"
              aria-label="Back to top of page"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div>
            © 2026 Ritik Suthar. All rights reserved.
          </div>
          <div>
            Built with React.js, Node.js, Express &amp; MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
}
