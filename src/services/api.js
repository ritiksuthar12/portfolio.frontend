export const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // When running in production (e.g. Vercel deployment, custom domain)
    if (!isLocal) {
      // If user explicitly configured an external HTTPS API url (e.g. on Render)
      if (envUrl && envUrl.startsWith('https://')) {
        return envUrl.replace(/\/+$/, '');
      }
      // On Vercel, the backend is serverless on the same domain: relative /api hits Vercel function
      return '/api';
    }
  }
  // Local development: if envUrl set and not empty, use it, else default to /api
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  return '/api';
};

const getBase = () => getApiBase();

const getAuthHeaders = () => {
  const token = localStorage.getItem('ritik_portfolio_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Helper for fetch with timeout (default 8000ms to allow serverless cold starts & Atlas connections)
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const api = {
  // Health & Diagnostic
  async checkDbHealth() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/health`, {}, 5000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline or network error
    }
    return { status: 'offline', database: 'disconnected' };
  },

  // Projects
  async getProjects() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/projects`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          localStorage.setItem('ritik_cached_projects', JSON.stringify(data.data));
          return data.data;
        }
      }
    } catch {
      // Backend not running or timeout -> offline fallback
    }

    const cached = localStorage.getItem('ritik_cached_projects');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache
      }
    }
    return [];
  },

  async createProject(projectData) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const current = await this.getProjects();
        const updated = [data.data, ...current.filter((p) => (p.id || p._id) !== (data.data.id || data.data._id))];
        localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
        return data.data;
      }
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const newProject = {
          ...projectData,
          id: `proj-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        const current = await this.getProjects();
        const updated = [newProject, ...current];
        localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
        return newProject;
      }
      throw err;
    }
  },

  async updateProject(id, projectData) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const current = await this.getProjects();
        const updated = current.map((p) => ((p.id || p._id) === id ? data.data : p));
        localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
        return data.data;
      }
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update project');
      }
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const current = await this.getProjects();
        const updated = current.map((p) => ((p.id || p._id) === id ? { ...p, ...projectData } : p));
        localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
        return { ...projectData, id };
      }
      throw err;
    }
  },

  async deleteProject(id) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        const cached = localStorage.getItem('ritik_cached_projects');
        if (cached) {
          try {
            const list = JSON.parse(cached);
            const updated = list.filter((p) => (p.id || p._id) !== id);
            localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
          } catch {}
        }
        return result;
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to delete project');
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const current = await this.getProjects();
        const updated = current.filter((p) => (p.id || p._id) !== id);
        localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
        return { success: true };
      }
      throw err;
    }
  },

  // Skills
  async getSkills() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/skills`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          localStorage.setItem('ritik_cached_skills', JSON.stringify(data.data));
          return data.data;
        }
      }
    } catch {
      // Backend not running or timeout -> graceful offline fallback
    }

    const cached = localStorage.getItem('ritik_cached_skills');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache
      }
    }
    return [];
  },

  async createSkill(skillData) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const current = await this.getSkills();
        const updated = [...current, data.data];
        localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
        return data.data;
      }
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create skill');
      }
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const newSkill = {
          ...skillData,
          id: `skill-${Date.now()}`
        };
        const current = await this.getSkills();
        const updated = [...current, newSkill];
        localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
        return newSkill;
      }
      throw err;
    }
  },

  async updateSkill(id, skillData) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/skills/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const current = await this.getSkills();
        const updated = current.map((s) => ((s.id || s._id) === id ? data.data : s));
        localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
        return data.data;
      }
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update skill');
      }
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const current = await this.getSkills();
        const updated = current.map((s) => ((s.id || s._id) === id ? { ...s, ...skillData } : s));
        localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
        return { ...skillData, id };
      }
      throw err;
    }
  },

  async deleteSkill(id) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        const cached = localStorage.getItem('ritik_cached_skills');
        if (cached) {
          try {
            const list = JSON.parse(cached);
            const updated = list.filter((s) => (s.id || s._id) !== id);
            localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
          } catch {}
        }
        return result;
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to delete skill');
    } catch (err) {
      const token = localStorage.getItem('ritik_portfolio_token');
      if (token === 'offline-token-demo') {
        const current = await this.getSkills();
        const updated = current.filter((s) => (s.id || s._id) !== id);
        localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
        return { success: true };
      }
      throw err;
    }
  },

  // Contact
  async sendMessage(messageData) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      const data = await res.json();
      if (res.ok) return data;
    } catch {
      // Offline fallback storage
    }

    const msg = {
      ...messageData,
      id: `msg-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('ritik_cached_messages') || '[]');
    localStorage.setItem('ritik_cached_messages', JSON.stringify([msg, ...existing]));
    return { success: true, message: 'Message stored in local inbox' };
  },

  async getMessages() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/contact`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Offline fallback
    }
    return JSON.parse(localStorage.getItem('ritik_cached_messages') || '[]');
  },

  async deleteMessage(id) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
    const existing = JSON.parse(localStorage.getItem('ritik_cached_messages') || '[]');
    const updated = existing.filter((m) => (m.id || m._id) !== id);
    localStorage.setItem('ritik_cached_messages', JSON.stringify(updated));
    return { success: true };
  },

  // Auth
  async login(credentials) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.token) {
        localStorage.setItem('ritik_portfolio_token', data.token);
        localStorage.setItem('ritik_portfolio_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      // Only allow offline demo token when running locally on developer's machine
      const user = (credentials.username || '').toLowerCase().trim();
      const pass = credentials.password || '';
      if (isLocal && (user === '@ritik25' || user === 'ritik25' || user === 'ritik') && (pass === '@github25' || pass === 'admin123')) {
        const fallbackUser = { id: 'admin-fallback', username: '@ritik25', role: 'admin' };
        localStorage.setItem('ritik_portfolio_token', 'offline-token-demo');
        localStorage.setItem('ritik_portfolio_user', JSON.stringify(fallbackUser));
        return { success: true, token: 'offline-token-demo', user: fallbackUser };
      }
      throw err;
    }
  },

  async checkAuth() {
    const token = localStorage.getItem('ritik_portfolio_token');
    if (!token) return null;
    if (token === 'offline-token-demo') {
      return JSON.parse(localStorage.getItem('ritik_portfolio_user') || 'null');
    }
    try {
      const res = await fetchWithTimeout(`${getBase()}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        localStorage.removeItem('ritik_portfolio_token');
        localStorage.removeItem('ritik_portfolio_user');
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return JSON.parse(localStorage.getItem('ritik_portfolio_user') || 'null');
    }
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetchWithTimeout(`${getBase()}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to change password');
    return data;
  },

  logout() {
    localStorage.removeItem('ritik_portfolio_token');
    localStorage.removeItem('ritik_portfolio_user');
  },

  // Cloud Sync: push any locally cached edits into the MongoDB Atlas database
  async syncLocalDataToCloud() {
    let syncedProjects = 0;
    let syncedSkills = 0;
    const errors = [];

    try {
      const cachedProjects = JSON.parse(localStorage.getItem('ritik_cached_projects') || '[]');
      for (const p of cachedProjects) {
        try {
          if (p.id && String(p.id).startsWith('proj-')) {
            await this.createProject({
              title: p.title,
              description: p.description,
              deployedUrl: p.deployedUrl,
              githubUrl: p.githubUrl,
              tags: p.tags,
              category: p.category,
              featured: p.featured,
              order: p.order
            });
            syncedProjects++;
          } else if (p.id || p._id) {
            await this.updateProject(p.id || p._id, {
              title: p.title,
              description: p.description,
              deployedUrl: p.deployedUrl,
              githubUrl: p.githubUrl,
              tags: p.tags,
              category: p.category,
              featured: p.featured,
              order: p.order
            });
            syncedProjects++;
          }
        } catch (e) {
          errors.push(e.message);
        }
      }

      const cachedSkills = JSON.parse(localStorage.getItem('ritik_cached_skills') || '[]');
      for (const s of cachedSkills) {
        try {
          if (s.id && String(s.id).startsWith('skill-')) {
            await this.createSkill({
              name: s.name,
              category: s.category,
              icon: s.icon,
              proficiency: s.proficiency,
              featured: s.featured,
              order: s.order
            });
            syncedSkills++;
          } else if (s.id || s._id) {
            await this.updateSkill(s.id || s._id, {
              name: s.name,
              category: s.category,
              icon: s.icon,
              proficiency: s.proficiency,
              featured: s.featured,
              order: s.order
            });
            syncedSkills++;
          }
        } catch (e) {
          errors.push(e.message);
        }
      }
    } catch (e) {
      errors.push(e.message);
    }

    return {
      success: errors.length === 0,
      syncedProjects,
      syncedSkills,
      errors
    };
  },

  // Resume APIs
  getResumeDownloadUrl() {
    return `${getBase()}/resume/download`;
  },

  getResumeViewUrl() {
    return `${getBase()}/resume/view`;
  },

  async getResume() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/resume`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem('ritik_cached_resume', JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }

    const cached = localStorage.getItem('ritik_cached_resume');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    return {
      fileName: 'Ritik_Suthar_Resume.pdf',
      fileUrl: '/resume.pdf',
      fileSize: 1540,
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      hasResume: true
    };
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('ritik_portfolio_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${getBase()}/resume/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      if (data.data) {
        localStorage.setItem('ritik_cached_resume', JSON.stringify(data.data));
      }
      return data;
    } catch (err) {
      if (token === 'offline-token-demo') {
        const mockResume = {
          fileName: file.name,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file),
          mimeType: file.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
          hasResume: true
        };
        localStorage.setItem('ritik_cached_resume', JSON.stringify(mockResume));
        return { success: true, message: 'Resume uploaded (offline preview)', data: mockResume };
      }
      throw err;
    }
  },

  async updateResumeUrl(customUrl, fileName) {
    try {
      const res = await fetchWithTimeout(`${getBase()}/resume/url`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ customUrl, fileName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update link');
      if (data.data) {
        localStorage.setItem('ritik_cached_resume', JSON.stringify(data.data));
      }
      return data;
    } catch (err) {
      const mockResume = {
        fileName: fileName || 'Ritik_Suthar_Resume.pdf',
        fileUrl: customUrl,
        customUrl,
        fileSize: 0,
        uploadedAt: new Date().toISOString(),
        hasResume: true
      };
      localStorage.setItem('ritik_cached_resume', JSON.stringify(mockResume));
      return { success: true, message: 'Link updated (offline fallback)', data: mockResume };
    }
  },

  async deleteResume() {
    try {
      const res = await fetchWithTimeout(`${getBase()}/resume`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        localStorage.removeItem('ritik_cached_resume');
        return await res.json();
      }
    } catch {}
    localStorage.removeItem('ritik_cached_resume');
    return { success: true };
  }
};
