import React, { useState } from 'react';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './TechIcons';

export default function Hero({ onExploreProjects }) {
  const [isColor, setIsColor] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-wrapper">
      {/* Left Column: Info & Actions */}
      <div className="hero-content-col">
        <p className="hero-greeting">HI, I'M</p>
        <h1 className="hero-name">Ritik Suthar</h1>
        <div className="hero-subtitle">
          <span>Full Stack Developer</span>
          <span className="subtitle-divider">|</span>
          <span>MERN Stack</span>
          <span className="subtitle-divider">|</span>
          <span>JavaScript</span>
          <span className="subtitle-divider">|</span>
          <span>REST APIs</span>
        </div>
        <p className="hero-desc">
          Full Stack Developer specializing in React, Node.js, Express, and MongoDB.
          I engineer modern, performant web applications with clean code architecture and seamless user experiences.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <button
            onClick={onExploreProjects || (() => scrollTo('projects'))}
            className="btn-primary hero-btn"
            aria-label="View Ritik Suthar's featured projects"
          >
            <span>View My Work</span> <ArrowRight size={17} />
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            className="btn-outline hero-btn"
            aria-label="Request Ritik Suthar's resume via contact form"
          >
            <span>Get Resume / Contact</span> <Download size={16} />
          </a>
        </div>

        {/* Social Links */}
        <div className="hero-socials">
          <a
            href="https://github.com/ritiksuthar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            title="GitHub Profile"
            aria-label="Ritik Suthar on GitHub (opens in a new tab)"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://linkedin.com/in/ritiksuthar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            title="LinkedIn Profile"
            aria-label="Ritik Suthar on LinkedIn (opens in a new tab)"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="https://instagram.com/ritiksuthar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            title="Instagram Profile"
            aria-label="Ritik Suthar on Instagram (opens in a new tab)"
          >
            <InstagramIcon size={18} />
          </a>
          <a
            href="mailto:ritiksuthar989@gmail.com"
            className="social-btn"
            title="Email Ritik Suthar"
            aria-label="Send an email to Ritik Suthar"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* Right Column: Portrait with Orbital Loops & Handwritten Note */}
      <div className="hero-portrait-col">
        <div className="hero-portrait-container">
          {/* Artistic Loop/Orbit SVG doodle matching screenshot */}
          <svg
            className="doodle-loop-svg"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            {/* Main elliptical orbital sketch line */}
            <path
              d="M 50 300 C 50 160, 220 70, 410 110 C 470 125, 480 230, 410 270 C 310 320, 110 360, 80 290 C 60 240, 140 170, 260 140 C 370 115, 440 170, 420 250"
              stroke="#111827"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            {/* Subtle accent burst lines top left */}
            <path
              d="M 120 120 L 140 145"
              stroke="#111827"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M 105 135 L 118 152"
              stroke="#111827"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>

          {/* Developer Portrait Image with Interactive Grayscale Transition */}
          <div
            className="portrait-photo-box"
            onClick={() => setIsColor(!isColor)}
            title="Hover or click to toggle color / grayscale effect"
          >
            <img
              src="/ritik.png"
              alt="Ritik Suthar - Full Stack MERN Developer Portrait"
              className={`portrait-img ${isColor ? 'color-active' : ''}`}
              width="360"
              height="388"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                e.target.src = "/ritik.jpg";
              }}
            />
          </div>

          {/* Handwritten text quote matching screenshot: Build Learn Improve Repeat */}
          <div className="handwritten-motto">
            <div>Build</div>
            <div>Learn</div>
            <div>Improve</div>
            <div>Repeat</div>
          </div>
        </div>
      </div>
    </section>
  );
}
