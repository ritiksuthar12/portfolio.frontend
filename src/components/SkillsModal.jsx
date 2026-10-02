import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { renderTechIcon } from './TechIcons';

export default function SkillsModal({
  isOpen,
  onClose,
  skills = [],
  isAdmin,
  onAddSkill,
  onEditSkill,
  onDeleteSkill
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Language', 'Core', 'Tools'];

  const filtered = skills.filter((s) => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '750px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              All Skills & Technologies ({skills.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Technologies, frameworks, and programming tools I work with.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdmin && (
              <button
                onClick={onAddSkill}
                className="btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Skill
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="modal-filter-bar">
          <div className="modal-category-group">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '9999px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary-btn-bg)' : 'var(--border-light)',
                  backgroundColor: selectedCategory === cat ? 'var(--primary-btn-bg)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? 'var(--primary-btn-text)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="modal-body">
          <div className="modal-skills-grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No skills found matching this criteria.
            </div>
          ) : (
            filtered.map((skill) => {
              const id = skill.id || skill._id;
              return (
                <div
                  key={id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div className="tech-icon-wrap" style={{ width: '28px', height: '28px' }}>
                        {renderTechIcon(skill.icon || skill.name)}
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {skill.name}
                      </span>
                    </div>

                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => onEditSkill(skill)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteSkill(id, skill.name)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{skill.category}</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{skill.proficiency || 85}%</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${skill.proficiency || 85}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary-btn-bg)',
                        borderRadius: '9999px',
                        transition: 'width 0.8s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
