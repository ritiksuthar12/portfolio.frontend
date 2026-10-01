import React from 'react';
import { ArrowRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { renderTechIcon } from './TechIcons';

export default function TechStack({
  skills = [],
  isAdmin,
  onViewAll,
  onAddSkill,
  onEditSkill,
  onDeleteSkill
}) {
  const featuredSkills = skills.filter(s => s.featured !== false).slice(0, 9);
  const displaySkills = featuredSkills.length > 0 ? featuredSkills : skills.slice(0, 9);

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Tech Stack</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAdmin && (
            <button
              onClick={onAddSkill}
              className="action-btn-sm"
              style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)', borderColor: 'var(--primary-btn-bg)' }}
              title="Add New Skill"
            >
              <Plus size={14} /> Add
            </button>
          )}
          <button onClick={onViewAll} className="view-all-link" aria-label="View all technical skills">
            View All <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="tech-badges-grid">
        {displaySkills.map((skill) => {
          const id = skill.id || skill._id;
          return (
            <div key={id} className="tech-badge-card" style={{ position: 'relative' }}>
              <div className="tech-icon-wrap" aria-hidden="true">
                {renderTechIcon(skill.icon || skill.name)}
              </div>
              <div style={{ overflow: 'hidden', flexGrow: 1 }}>
                <div className="tech-badge-name" title={skill.name}>
                  {skill.name}
                </div>
              </div>

              {/* Admin controls for skill */}
              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                  <button
                    onClick={() => onEditSkill(skill)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '2px'
                    }}
                    title="Edit skill"
                    aria-label={`Edit skill ${skill.name}`}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteSkill(id, skill.name)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      padding: '2px'
                    }}
                    title="Delete skill"
                    aria-label={`Delete skill ${skill.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
