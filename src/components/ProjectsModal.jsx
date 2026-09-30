import React, { useState } from 'react';
import { X, Search, ExternalLink, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';
import { GithubIcon } from './TechIcons';

export default function ProjectsModal({
  isOpen,
  onClose,
  projects = [],
  isAdmin,
  onAddProject,
  onEditProject,
  onDeleteProject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'Core'];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>
              All Projects ({projects.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Explore my deployed web applications, APIs, and systems.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdmin && (
              <button
                onClick={onAddProject}
                className="btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Project
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

        {/* Filter bar */}
        <div className="modal-filter-bar">
          {/* Categories */}
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
                  borderColor: selectedCategory === cat ? '#111827' : 'var(--border-light)',
                  backgroundColor: selectedCategory === cat ? '#111827' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#4b5563',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="modal-search-wrap">
            <Search size={15} className="modal-search-icon" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modal-search-input"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="modal-body">
          <div className="modal-projects-grid">
            {filtered.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
                No projects found matching your criteria.
              </div>
            ) : (
            filtered.map((proj) => {
              const id = proj.id || proj._id;
              return (
                <div
                  key={id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>
                        {proj.category || 'Web'}
                      </span>
                      {proj.featured && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          <Sparkles size={10} /> FEATURED
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', marginBottom: '0.4rem' }}>
                      {proj.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.45', marginBottom: '1rem' }}>
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {(proj.tags || []).map((t, i) => (
                        <span key={i} className="tag-badge" style={{ fontSize: '0.7rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                      <a
                        href={proj.deployedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', flexGrow: 1 }}
                      >
                        Live Demo <ExternalLink size={13} />
                      </a>

                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline"
                          style={{ padding: '0.4rem 0.65rem' }}
                          title="View Code on GitHub"
                        >
                          <GithubIcon size={15} color="#111827" />
                        </a>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEditProject(proj)}
                            className="action-btn-sm edit"
                            title="Edit project"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => onDeleteProject(id, proj.title)}
                            className="action-btn-sm delete"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
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
