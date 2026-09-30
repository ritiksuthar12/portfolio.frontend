import { defaultProjects, defaultSkills } from '../data/defaultPortfolioData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ritik_portfolio_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Helper for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 2500) => {
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
  // Projects
  async getProjects() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          localStorage.setItem('ritik_cached_projects', JSON.stringify(data.data));
          return data.data;
        }
      }
    } catch {
      // Backend not running or timeout -> graceful offline fallback
    }

    const cached = localStorage.getItem('ritik_cached_projects');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // invalid cache, fallback to defaults
      }
    }
    return defaultProjects;
  },

  async createProject(projectData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (res.ok) {
        return data.data;
      }
    } catch {
      // Offline fallback
    }

    const newProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const current = await this.getProjects();
    const updated = [newProject, ...current];
    localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
    return newProject;
  },

  async updateProject(id, projectData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (res.ok) {
        return data.data;
      }
    } catch {
      // Offline fallback
    }

    const current = await this.getProjects();
    const updated = current.map((p) => ((p.id || p._id) === id ? { ...p, ...projectData } : p));
    localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
    return { ...projectData, id };
  },

  async deleteProject(id) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }

    const current = await this.getProjects();
    const updated = current.filter((p) => (p.id || p._id) !== id);
    localStorage.setItem('ritik_cached_projects', JSON.stringify(updated));
    return { success: true };
  },

  // Skills
  async getSkills() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/skills`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
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
        // invalid cache, fallback to defaults
      }
    }
    return defaultSkills;
  },

  async createSkill(skillData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      const data = await res.json();
      if (res.ok) {
        return data.data;
      }
    } catch {
      // Offline fallback
    }

    const newSkill = {
      ...skillData,
      id: `skill-${Date.now()}`
    };
    const current = await this.getSkills();
    const updated = [...current, newSkill];
    localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
    return newSkill;
  },

  async updateSkill(id, skillData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/skills/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData)
      });
      const data = await res.json();
      if (res.ok) {
        return data.data;
      }
    } catch {
      // Offline fallback
    }

    const current = await this.getSkills();
    const updated = current.map((s) => ((s.id || s._id) === id ? { ...s, ...skillData } : s));
    localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
    return { ...skillData, id };
  },

  async deleteSkill(id) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }

    const current = await this.getSkills();
    const updated = current.filter((s) => (s.id || s._id) !== id);
    localStorage.setItem('ritik_cached_skills', JSON.stringify(updated));
    return { success: true };
  },

  // Contact
  async sendMessage(messageData) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/contact`, {
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
      const res = await fetchWithTimeout(`${API_BASE}/contact`, {
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
      const res = await fetchWithTimeout(`${API_BASE}/contact/${id}`, {
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
      const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
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
      // Check fallback credentials for offline demo
      const user = (credentials.username || '').toLowerCase().trim();
      const pass = credentials.password || '';
      if ((user === '@ritik25' || user === 'ritik25' || user === 'ritik') && (pass === '@github25' || pass === 'admin123')) {
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
      const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
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

  logout() {
    localStorage.removeItem('ritik_portfolio_token');
    localStorage.removeItem('ritik_portfolio_user');
  }
};
