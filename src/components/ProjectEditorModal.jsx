import React, { useState, useEffect } from 'react';
import { X, Globe, Tag, Folder } from 'lucide-react';
import { GithubIcon } from './TechIcons';

export default function ProjectEditorModal({
  isOpen,
  onClose,
  project,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deployedUrl: '',
    githubUrl: '',
    tags: '',
    category: 'Full Stack',
    featured: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        deployedUrl: project.deployedUrl || '',
        githubUrl: project.githubUrl || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
        category: project.category || 'Full Stack',
        featured: project.featured !== false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deployedUrl: '',
        githubUrl: '',
        tags: '',
        category: 'Full Stack',
        featured: true
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.deployedUrl.trim()) {
      setError('Deployed Link is required');
      return;
    }

    setLoading(true);
    setError('');

    const formattedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      await onSave({
        ...formData,
        tags: formattedTags
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. E-Commerce Store"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                rows={3}
                placeholder="Short description of features, tech used, and problem solved..."
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={14} /> Deployed Live Link *
                </span>
              </label>
              <input
                type="url"
                placeholder="https://my-app.vercel.app"
                className="form-input"
                value={formData.deployedUrl}
                onChange={(e) => setFormData({ ...formData, deployedUrl: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <GithubIcon size={14} color="currentColor" /> GitHub Repository URL (Optional)
                </span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/ritiksuthar/my-repo"
                className="form-input"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="editor-form-row">
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Folder size={14} /> Category
                  </span>
                </label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="System">System / Architecture</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} /> Tech Tags (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  className="form-input"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="featuredCheck"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-btn-bg)', cursor: 'pointer' }}
              />
              <label htmlFor="featuredCheck" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }}>
                Show on Featured Projects ribbon (Home page)
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
            >
              {loading ? 'Saving...' : (project ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
