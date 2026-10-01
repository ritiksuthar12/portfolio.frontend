import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ variant = 'button', className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'drawer') {
    return (
      <div className={`theme-drawer-row ${className}`}>
        <div className="theme-drawer-label">
          <span className="theme-drawer-title">Appearance</span>
          <span className="theme-drawer-status">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          className="theme-switch-pill"
        >
          <span className={`theme-pill-track ${isDark ? 'active-dark' : 'active-light'}`}>
            <span className="theme-pill-thumb">
              {isDark ? (
                <Moon size={14} className="theme-pill-icon moon-icon" />
              ) : (
                <Sun size={14} className="theme-pill-icon sun-icon" />
              )}
            </span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      id="theme-switcher-button"
    >
      <div className={`theme-icon-container ${isDark ? 'dark-active' : 'light-active'}`}>
        <Sun
          size={18}
          className="theme-icon sun-icon"
          aria-hidden="true"
        />
        <Moon
          size={17}
          className="theme-icon moon-icon"
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">
        {isDark ? 'Currently in dark mode. Click to switch to light mode.' : 'Currently in light mode. Click to switch to dark mode.'}
      </span>
    </button>
  );
}
