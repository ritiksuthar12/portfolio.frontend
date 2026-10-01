import React from 'react';
import { Terminal, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="section-header-center">
        <p className="section-eyebrow">
          ABOUT ME
        </p>
        <h2 className="section-headline">
          Crafting Digital Products with Code & Passion
        </h2>
      </div>

      <div className="about-grid">
        {/* Left card */}
        <div className="about-bio-card">
          <h3 className="about-bio-title">
            Hey there! I'm Ritik Suthar 👋
          </h3>
          <p className="about-bio-text">
            I am a dedicated <strong>Full Stack MERN Developer</strong> currently pursuing my <strong>BCA</strong>.
            I bridge the gap between high-performance backends and delightful user interfaces.
          </p>
          <p className="about-bio-text">
            With a solid grounding in <strong>modern full-stack architecture</strong>, I approach software
            development with an emphasis on optimization, clean architecture, and scalability. Whether it's crafting
            interactive React interfaces or building reliable Express APIs with MongoDB, I bring ideas to life.
          </p>

          <div className="about-skills-check-grid">
            <div className="about-check-item">
              <CheckCircle2 size={18} color="#059669" />
              <span>Clean Code</span>
            </div>
            <div className="about-check-item">
              <CheckCircle2 size={18} color="#059669" />
              <span>Responsive UI</span>
            </div>
            <div className="about-check-item">
              <CheckCircle2 size={18} color="#059669" />
              <span>REST APIs</span>
            </div>
            <div className="about-check-item">
              <CheckCircle2 size={18} color="#059669" />
              <span>Database Design</span>
            </div>
          </div>
        </div>

        {/* Right 3 Feature blocks */}
        <div className="about-features-col">
          <div className="about-feature-card">
            <div className="about-feature-icon">
              <Terminal size={22} color="currentColor" />
            </div>
            <div className="about-feature-content">
              <h4>Full Stack Development</h4>
              <p>
                Engineering end-to-end web apps with React, Node.js, Express, and MongoDB with secure JWT auth and state management.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon">
              <Brain size={22} color="currentColor" />
            </div>
            <div className="about-feature-content">
              <h4>System Performance & Architecture</h4>
              <p>
                Designing efficient, scalable backend architectures and optimized frontends built for performance.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon">
              <Sparkles size={22} color="currentColor" />
            </div>
            <div className="about-feature-content">
              <h4>Continuous Growth & Innovation</h4>
              <p>
                Constantly learning the latest tooling, UI patterns, and cloud deployment pipelines to ship modern software.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
