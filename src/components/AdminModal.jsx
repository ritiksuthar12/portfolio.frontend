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
  ArrowRight,
  FileText,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  File,
  RefreshCw
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

  // Resume state
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [customResumeUrl, setCustomResumeUrl] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'messages') {
        loadMessages();
      } else if (activeTab === 'resume') {
        loadResume();
      }
    }
  }, [isAdmin, activeTab]);

  const loadResume = async () => {
    setResumeLoading(true);
    try {
      const data = await api.getResume();
      setResumeData(data);
      if (data?.customUrl) {
        setCustomResumeUrl(data.customUrl);
      }
    } catch (err) {
      console.error('Error loading resume:', err);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      notify('Please select a valid PDF, DOC, or DOCX file', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      notify('File is too large. Maximum size is 15MB', 'error');
      return;
    }

    setUploadingResume(true);
    try {
      const res = await api.uploadResume(file);
      setResumeData(res.data);
      notify('Latest resume uploaded successfully! Visitors can now download it.', 'success');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      notify(err.message || 'Failed to upload resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSaveCustomUrl = async (e) => {
    e.preventDefault();
    if (!customResumeUrl.trim()) {
      notify('Please enter a valid URL', 'error');
      return;
    }
    setSavingUrl(true);
    try {
      const res = await api.updateResumeUrl(customResumeUrl.trim(), 'Ritik_Suthar_Resume.pdf');
      setResumeData(res.data);
      notify('External resume link updated successfully!', 'success');
    } catch (err) {
      notify(err.message || 'Failed to save external link', 'error');
    } finally {
      setSavingUrl(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove the current resume?')) return;
    try {
      await api.deleteResume();
      setResumeData(null);
      setCustomResumeUrl('');
      notify('Resume removed successfully', 'success');
    } catch (err) {
      notify('Failed to delete resume', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAdmin ? "Ritik's Admin Control Panel" : 'Admin Authentication'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAdmin
                  ? 'Manage your dynamic projects, skills, and client inquiries'
                  : 'Enter your credentials to access the portfolio dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
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
                onClick={() => setActiveTab('resume')}
                className={`admin-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
              >
                <FileText size={16} /> Resume
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
                              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {proj.title}
                              </h4>
                              {proj.featured && (
                                <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                  FEATURED
                                </span>
                              )}
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {proj.category}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
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
                            backgroundColor: 'var(--bg-card)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              {skill.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                              backgroundColor: 'var(--bg-card)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <div>
                                <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{m.name}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>&lt;{m.email}&gt;</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              {m.subject || 'Portfolio Message'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                              {m.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Resume Management */}
              {activeTab === 'resume' && (
                <div style={{ maxWidth: '640px' }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Resume Management
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Upload your latest resume so recruiters and visitors can instantly download it in 1-click.
                    </p>
                  </div>

                  {resumeLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 0.75rem auto' }} />
                      <p>Loading resume details...</p>
                    </div>
                  ) : (
                    <>
                      {/* Current Active Resume Card */}
                      {resumeData && resumeData.hasResume && (
                        <div
                          style={{
                            padding: '1.25rem',
                            border: '1px solid var(--border-light)',
                            borderRadius: '0.875rem',
                            backgroundColor: 'var(--bg-card)',
                            boxShadow: 'var(--shadow-card)',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                              <div
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '0.625rem',
                                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                  color: 'var(--accent-blue)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                              >
                                <FileText size={24} />
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                                    {resumeData.fileName || 'Ritik_Suthar_Resume.pdf'}
                                  </h4>
                                  <span
                                    style={{
                                      fontSize: '0.65rem',
                                      fontWeight: '700',
                                      padding: '2px 8px',
                                      borderRadius: '9999px',
                                      backgroundColor: '#d1fae5',
                                      color: '#065f46',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <CheckCircle2 size={11} /> LIVE &amp; ACTIVE
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                  {resumeData.fileSize > 0 && (
                                    <span>Size: <strong>{formatBytes(resumeData.fileSize)}</strong></span>
                                  )}
                                  {resumeData.uploadedAt && (
                                    <span>Updated: {new Date(resumeData.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleDeleteResume}
                              className="btn-outline"
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: '#dc2626', borderColor: '#fca5a5' }}
                              title="Delete this resume"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>

                          {/* Quick Action Preview & Test Download Buttons */}
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                            <a
                              href={api.getResumeViewUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline"
                              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                            >
                              <Eye size={14} /> Preview in Browser
                            </a>
                            <a
                              href={api.getResumeDownloadUrl()}
                              download={resumeData.fileName || 'Ritik_Suthar_Resume.pdf'}
                              className="btn-primary"
                              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                            >
                              <Download size={14} /> Test Download
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Dropzone Upload Box */}
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{
                          border: `2px dashed ${dragActive ? 'var(--accent-blue)' : 'var(--border-light)'}`,
                          borderRadius: '1rem',
                          padding: '2.5rem 1.5rem',
                          textAlign: 'center',
                          backgroundColor: dragActive ? 'rgba(37, 99, 235, 0.04)' : 'var(--bg-card)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          marginBottom: '1.5rem'
                        }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                        />

                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--accent-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto'
                          }}
                        >
                          {uploadingResume ? (
                            <RefreshCw className="animate-spin" size={26} />
                          ) : (
                            <UploadCloud size={28} />
                          )}
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          {uploadingResume
                            ? 'Uploading and processing resume...'
                            : resumeData?.hasResume
                            ? 'Click or drag to replace with new resume'
                            : 'Upload your resume'}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                          Drag and drop your file here, or click to browse from your device
                        </p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                          <File size={12} /> Supports PDF, DOC, DOCX up to 15MB
                        </div>
                      </div>

                      {/* Optional External Link Alternative */}
                      <div
                        style={{
                          padding: '1.25rem',
                          border: '1px solid var(--border-light)',
                          borderRadius: '0.875rem',
                          backgroundColor: 'var(--bg-card)'
                        }}
                      >
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                          Or Provide an External Link (Google Drive / Cloud)
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                          If your resume is hosted on Google Drive, Dropbox, or OneDrive, you can provide the direct sharing link.
                        </p>
                        <form onSubmit={handleSaveCustomUrl} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <input
                            type="url"
                            className="form-input"
                            value={customResumeUrl}
                            onChange={(e) => setCustomResumeUrl(e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                            style={{ flex: 1, minWidth: '220px' }}
                          />
                          <button
                            type="submit"
                            disabled={savingUrl}
                            className="btn-primary"
                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem', flexShrink: 0 }}
                          >
                            {savingUrl ? 'Saving...' : 'Save Link'}
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 5: Security & Password Management */}
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

                  <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Database size={16} color="#059669" />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Storage Engine Status</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
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
