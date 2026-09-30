import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Key,
  FolderGit2,
  Cpu,
  Mail,
  Trash2,
  Edit,
  Plus,
  ExternalLink,
  ShieldCheck,
  Database,
  Eye,
  EyeOff,
  User,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminModal({
  isOpen,
  onClose,
  isAdmin,
  onLoginSuccess,
  onLogout,
  projects = [],
  skills = [],
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  onOpenAddSkill,
  onEditSkill,
  onDeleteSkill,
  notify
}) {
  const [activeTab, setActiveTab] = useState('projects');

  // Login credentials - completely blank by default, never shown on UI
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Change password state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (isAdmin && activeTab === 'messages') {
      loadMessages();
    }
  }, [isAdmin, activeTab]);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setLoginError('');
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const data = await api.getMessages();
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter(m => (m.id || m._id) !== id));
      notify('Message deleted', 'success');
    } catch (err) {
      notify('Failed to delete message', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setLoginError('Please enter both username and password');
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.login({ username: username.trim(), password });
      onLoginSuccess(res.user);
      notify('Welcome back, Ritik! Admin access granted.', 'success');
      setUsername('');
      setPassword('');
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Access denied.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ritik_portfolio_token')}`
        },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setPassMsg({ text: 'Password updated successfully!', type: 'success' });
      setCurrPass('');
      setNewPass('');
      notify('Password updated!', 'success');
    } catch (err) {
      setPassMsg({ text: err.message, type: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: isAdmin ? '850px' : '450px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#111827',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isAdmin ? <ShieldCheck size={20} color="#34d399" /> : <Lock size={18} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827' }}>
                {isAdmin ? "Ritik's Admin Control Panel" : 'Admin Authentication'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                {isAdmin
                  ? 'Manage your dynamic projects, skills, and client inquiries'
                  : 'Enter your credentials to access the portfolio dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {!isAdmin ? (
          /* Secure Password Login Form */
          <form onSubmit={handleLogin}>
            <div className="modal-body">
              {loginError && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  {loginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={14} color="#6b7280" /> Admin Username
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Key size={14} color="#6b7280" /> Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingRight: '2.5rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
                disabled={loginLoading}
                className="btn-primary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {loginLoading ? 'Authenticating...' : (
                  <>
                    Sign In <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Authenticated Admin Dashboard */
          <div>
            {/* Tabs */}
            <div className="admin-tabs-nav">
              <button
                onClick={() => setActiveTab('projects')}
                className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              >
                <FolderGit2 size={16} /> Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              >
                <Cpu size={16} /> Skills ({skills.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              >
                <Mail size={16} /> Inbox
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Key size={16} /> Security
              </button>
            </div>

            <div className="modal-body" style={{ minHeight: '350px' }}>
              {/* TAB 1: Projects */}
              {activeTab === 'projects' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Add, update, or remove projects. Changes immediately reflect in real time.
                    </p>
                    <button
                      onClick={onOpenAddProject}
                      className="btn-primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {projects.map((proj) => {
                      const id = proj.id || proj._id;
                      return (
                        <div
                          key={id}
                          className="admin-list-item"
                        >
                          <div className="admin-list-item-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827' }}>
                                {proj.title}
                              </h4>
                              {proj.featured && (
                                <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                  FEATURED
                                </span>
                              )}
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>• {proj.category}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {proj.description}
                            </p>
                            <a
                              href={proj.deployedUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: '0.75rem', color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', marginTop: '2px', wordBreak: 'break-all' }}
                            >
                              {proj.deployedUrl} <ExternalLink size={11} />
                            </a>
                          </div>

                          <div className="admin-list-item-actions">
                            <button
                              onClick={() => onEditProject(proj)}
                              className="action-btn-sm edit"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <Edit size={13} /> Edit
                            </button>
                            <button
                              onClick={() => onDeleteProject(id, proj.title)}
                              className="action-btn-sm delete"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Skills */}
              {activeTab === 'skills' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Add or adjust skills, icons, and proficiency levels.
                    </p>
                    <button
                      onClick={onOpenAddSkill}
                      className="btn-primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {skills.map((skill) => {
                      const id = skill.id || skill._id;
                      return (
                        <div
                          key={id}
                          style={{
                            border: '1px solid var(--border-light)',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827' }}>
                              {skill.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {skill.category} • {skill.proficiency || 85}%
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => onEditSkill(skill)}
                              className="action-btn-sm edit"
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => onDeleteSkill(id, skill.name)}
                              className="action-btn-sm delete"
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Messages */}
              {activeTab === 'messages' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Inquiries Received</h3>
                    <button onClick={loadMessages} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                      Refresh
                    </button>
                  </div>

                  {messagesLoading ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                      No messages received yet. Messages sent via the Contact form will appear here.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {messages.map((m) => {
                        const id = m.id || m._id;
                        return (
                          <div
                            key={id}
                            style={{
                              border: '1px solid var(--border-light)',
                              borderRadius: '0.75rem',
                              padding: '1rem',
                              backgroundColor: '#ffffff'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <div>
                                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#111827' }}>{m.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '0.5rem' }}>&lt;{m.email}&gt;</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                                </span>
                                <button
                                  onClick={() => handleDeleteMessage(id)}
                                  className="action-btn-sm delete"
                                  style={{ padding: '0.25rem 0.45rem' }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                              {m.subject || 'Portfolio Message'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                              {m.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Security & Password Management */}
              {activeTab === 'settings' && (
                <div style={{ maxWidth: '480px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Change Admin Password</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                    Keep your portfolio protected by updating your secret password anytime.
                  </p>

                  {passMsg.text && (
                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', backgroundColor: passMsg.type === 'success' ? '#d1fae5' : '#fee2e2', color: passMsg.type === 'success' ? '#065f46' : '#991b1b' }}>
                      {passMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={currPass}
                        onChange={(e) => setCurrPass(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
                      Update Password
                    </button>
                  </form>

                  <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Database size={16} color="#059669" />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>Storage Engine Status</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: '1.4' }}>
                      Running on dual-engine: Mongoose / MongoDB with resilient persistent JSON store fallback. Real-time updates persist across all sessions!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer admin-modal-footer">
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Logged in as <strong>Ritik Suthar (@ritik25)</strong>
              </div>
              <div className="admin-modal-footer-btns">
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  Logout Admin
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
