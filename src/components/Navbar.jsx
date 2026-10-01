import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Lock, LogOut, Plus, Shield, Menu, X, ChevronRight, Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { api } from '../services/api';

export default function Navbar({ onOpenAdmin, isAdmin, onLogout, onOpenAddProject, onOpenAddSkill }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
          className="brand-logo"
          aria-label="Ritik Suthar Portfolio - Home"
        >
          <span className="brand-logo-text">RS</span>
          {isAdmin && (
            <span className="admin-status-badge">
              ADMIN
            </span>
          )}
        </a>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('skills');
                }}
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('projects');
                }}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href={api.getResumeDownloadUrl()}
                download="Ritik_Suthar_Resume.pdf"
                className="nav-link nav-resume-link"
                title="Download Ritik's Resume (PDF)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Action Buttons */}
        <div className="nav-right-actions">
          {isAdmin ? (
            <div className="admin-quick-buttons">
              <button
                onClick={onOpenAddProject}
                className="btn-outline btn-compact"
                title="Add New Project"
                aria-label="Add New Project"
              >
                <Plus size={14} /> <span className="btn-label-text">Project</span>
              </button>
              <button
                onClick={onOpenAddSkill}
                className="btn-outline btn-compact"
                title="Add New Skill"
                aria-label="Add New Skill"
              >
                <Plus size={14} /> <span className="btn-label-text">Skill</span>
              </button>
              <button
                onClick={onOpenAdmin}
                className="btn-primary btn-compact"
                style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                title="Admin Dashboard"
                aria-label="Open Admin Dashboard"
              >
                <Shield size={14} /> <span className="btn-label-text">Dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="btn-outline btn-compact btn-icon-only"
                title="Logout Admin"
                aria-label="Logout Admin"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="social-btn admin-lock-btn"
              title="Admin Login (Only Ritik can edit)"
              aria-label="Admin Login Portal"
            >
              <Lock size={15} />
            </button>
          )}

          {/* Dark / Light Mode Switcher */}
          <ThemeToggle />

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            className="btn-primary nav-cta-btn"
            aria-label="Get in touch with Ritik Suthar"
          >
            <span>Get In Touch</span> <ArrowUpRight size={16} />
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div id="mobile-nav-panel" className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="brand-logo-text" style={{ fontSize: '1.4rem' }}>RS</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-close-btn"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Mobile Navigation">
              <a
                href="#home"
                className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('home');
                }}
              >
                <span>Home</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#about"
                className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('about');
                }}
              >
                <span>About</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#skills"
                className={`mobile-nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('skills');
                }}
              >
                <span>Skills</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#projects"
                className={`mobile-nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('projects');
                }}
              >
                <span>Projects</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#contact"
                className={`mobile-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
              >
                <span>Contact</span>
                <ChevronRight size={16} />
              </a>
              <a
                href={api.getResumeDownloadUrl()}
                download="Ritik_Suthar_Resume.pdf"
                className="mobile-nav-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={16} /> Download Resume
                </span>
                <ChevronRight size={16} />
              </a>
            </nav>

            {/* Mobile Drawer Theme Switcher */}
            <ThemeToggle variant="drawer" />

            <div className="mobile-drawer-footer">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get In Touch <ArrowUpRight size={17} />
              </a>

              {isAdmin ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.5rem' }}
                  >
                    <Shield size={14} /> Admin
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.82rem', padding: '0.5rem', color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.85rem' }}
                >
                  <Lock size={14} /> Admin Access
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
