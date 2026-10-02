import React from 'react';
import { Code2, GraduationCap, Zap, Target } from 'lucide-react';

export default function StatsRibbon({ projectsCount = 10 }) {
  return (
    <section className="stats-ribbon">
      <div className="stats-card">
        {/* Item 1 */}
        <div className="stat-item">
          <div className="stat-icon-wrap">
            <Code2 size={24} />
          </div>
          <div>
            <div className="stat-title">{projectsCount >= 10 ? `${projectsCount}+` : `${projectsCount}`}</div>
            <div className="stat-desc">Projects Built</div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="stat-item">
          <div className="stat-icon-wrap">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="stat-title">BCA</div>
            <div className="stat-desc">Currently Pursuing</div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="stat-item">
          <div className="stat-icon-wrap">
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-title">MERN</div>
            <div className="stat-desc">Tech Stack</div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="stat-item">
          <div className="stat-icon-wrap">
            <Target size={24} />
          </div>
          <div>
            <div className="stat-title">Always</div>
            <div className="stat-desc">Learning New Things</div>
          </div>
        </div>
      </div>
    </section>
  );
}
