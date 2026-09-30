import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { renderTechIcon } from './TechIcons';

export default function SkillEditorModal({
  isOpen,
  onClose,
  skill,
  onSave
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: 'react',
    proficiency: 85,
    featured: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'Frontend',
        icon: skill.icon || 'code',
        proficiency: skill.proficiency || 85,
        featured: skill.featured !== false
      });
    } else {
      setFormData({
        name: '',
        category: 'Frontend',
        icon: 'react',
        proficiency: 85,
        featured: true
      });
    }
    setError('');
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Skill name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave({
        ...formData,
        proficiency: Number(formData.proficiency)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
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
              <label className="form-label">Skill / Technology Name *</label>
              <input
                type="text"
                placeholder="e.g. Next.js, Redux, Docker"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="editor-form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Language">Language</option>
                  <option value="Core">Core CS</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Icon Identifier</label>
                <select
                  className="form-select"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="javascript">JavaScript</option>
                  <option value="tailwind">Tailwind CSS</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="github">GitHub / Git</option>
                  <option value="express">Express</option>
                  <option value="code">Code / Logic</option>
                  <option value="server">API / Server</option>
                  <option value="database">Database</option>
                </select>
              </div>
            </div>

            {/* Icon Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Icon Preview:</span>
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center' }}>
                {renderTechIcon(formData.icon || formData.name)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
                {formData.name || 'Sample Name'}
              </span>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Proficiency Level</label>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>{formData.proficiency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                style={{ width: '100%', accentColor: '#111827', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="skillFeaturedCheck"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }}
              />
              <label htmlFor="skillFeaturedCheck" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827', cursor: 'pointer' }}>
                Pin to Tech Stack main grid (Home page)
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
              {loading ? 'Saving...' : (skill ? 'Save Changes' : 'Add Skill')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
