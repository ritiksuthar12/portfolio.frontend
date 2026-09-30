import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsRibbon from './components/StatsRibbon';
import FeaturedProjects from './components/FeaturedProjects';
import TechStack from './components/TechStack';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { useSEO } from './components/SEO';
import { api } from './services/api';
import { defaultProjects, defaultSkills } from './data/defaultPortfolioData';
import { ShieldCheck, Plus, LogOut } from 'lucide-react';

// Code-split heavy modals to minimize initial JS bundle size and maximize Core Web Vitals (LCP/TBT)
const ProjectsModal = lazy(() => import('./components/ProjectsModal'));
const SkillsModal = lazy(() => import('./components/SkillsModal'));
const AdminModal = lazy(() => import('./components/AdminModal'));
const ProjectEditorModal = lazy(() => import('./components/ProjectEditorModal'));
const SkillEditorModal = lazy(() => import('./components/SkillEditorModal'));

export default function App() {
  // Pre-seed with default portfolio data for instant first-paint crawlability and zero-CLS
  const [projects, setProjects] = useState(defaultProjects);
  const [skills, setSkills] = useState(defaultSkills);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Modals
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [projectEditorOpen, setProjectEditorOpen] = useState(false);
  const [skillEditorOpen, setSkillEditorOpen] = useState(false);

  // Editing Items
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Synchronize dynamic head metadata based on modal navigation state
  let modalTitle = null;
  if (projectsModalOpen) modalTitle = 'All Projects';
  else if (skillsModalOpen) modalTitle = 'Technical Skills';
  else if (adminModalOpen) modalTitle = 'Admin Portal';

  useSEO({
    title: modalTitle,
    description: modalTitle
      ? `${modalTitle} - Ritik Suthar Full Stack MERN Developer Portfolio`
      : 'Portfolio of Ritik Suthar, a Full Stack Developer specializing in React, Node.js, Express, and MongoDB. Explore featured web applications and technical skills.'
  });

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load latest data from API or offline cache
  const loadData = useCallback(async () => {
    try {
      const [projData, skillData] = await Promise.all([
        api.getProjects(),
        api.getSkills()
      ]);
      if (projData && Array.isArray(projData) && projData.length > 0) {
        setProjects(projData);
      }
      if (skillData && Array.isArray(skillData) && skillData.length > 0) {
        setSkills(skillData);
      }
    } catch (err) {
      console.warn('Portfolio data loaded via default snapshot fallback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Check if admin is logged in
    const checkUser = async () => {
      const user = await api.checkAuth();
      if (user) {
        setIsAdmin(true);
        setCurrentUser(user);
      }
    };
    checkUser();
  }, [loadData]);

  // Project Handlers
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectEditorOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    setProjectEditorOpen(true);
  };

  const handleSaveProject = async (projectData) => {
    if (editingProject) {
      const id = editingProject.id || editingProject._id;
      const updated = await api.updateProject(id, projectData);
      setProjects((prev) =>
        prev.map((p) => ((p.id || p._id) === id ? updated : p))
      );
      notify(`Project "${updated.title}" updated successfully!`, 'success');
    } else {
      const created = await api.createProject(projectData);
      setProjects((prev) => [created, ...prev]);
      notify(`Project "${created.title}" added to your portfolio!`, 'success');
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => (p.id || p._id) !== id));
      notify(`Project "${title}" deleted successfully`, 'success');
    } catch (err) {
      notify(err.message || 'Failed to delete project', 'error');
    }
  };

  // Skill Handlers
  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillEditorOpen(true);
  };

  const handleOpenEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillEditorOpen(true);
  };

  const handleSaveSkill = async (skillData) => {
    if (editingSkill) {
      const id = editingSkill.id || editingSkill._id;
      const updated = await api.updateSkill(id, skillData);
      setSkills((prev) =>
        prev.map((s) => ((s.id || s._id) === id ? updated : s))
      );
      notify(`Skill "${updated.name}" updated!`, 'success');
    } else {
      const created = await api.createSkill(skillData);
      setSkills((prev) => [...prev, created]);
      notify(`Skill "${created.name}" added to Tech Stack!`, 'success');
    }
  };

  const handleDeleteSkill = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from skills?`)) {
      return;
    }
    try {
      await api.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => (s.id || s._id) !== id));
      notify(`Skill "${name}" removed`, 'success');
    } catch (err) {
      notify(err.message || 'Failed to delete skill', 'error');
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setIsAdmin(true);
    setCurrentUser(user);
    setAdminModalOpen(false);
  };

  const handleLogout = () => {
    api.logout();
    setIsAdmin(false);
    setCurrentUser(null);
    setAdminModalOpen(false);
    notify('Logged out from Admin portal', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Notice Bar if logged in */}
      {isAdmin && (
        <aside aria-label="Admin Control Bar" className="admin-bar-ribbon">
          <div className="admin-bar-info">
            <ShieldCheck size={16} color="#34d399" />
            <span>
              <strong>Admin Mode:</strong> Logged in as <strong>{currentUser?.username || 'Ritik'}</strong>. Full portfolio editing rights enabled.
            </span>
          </div>
          <div className="admin-bar-actions">
            <button
              onClick={handleOpenAddProject}
              className="action-btn-sm"
              style={{ backgroundColor: '#27272a', color: '#fff', borderColor: '#3f3f46' }}
              aria-label="Add new project"
            >
              <Plus size={13} /> Project
            </button>
            <button
              onClick={handleOpenAddSkill}
              className="action-btn-sm"
              style={{ backgroundColor: '#27272a', color: '#fff', borderColor: '#3f3f46' }}
              aria-label="Add new skill"
            >
              <Plus size={13} /> Skill
            </button>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="action-btn-sm"
              style={{ backgroundColor: '#2563eb', color: '#fff', borderColor: '#2563eb' }}
              aria-label="Open Admin Dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="action-btn-sm"
              style={{ backgroundColor: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
              title="Logout Admin"
              aria-label="Logout Admin"
            >
              <LogOut size={13} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenAdmin={() => setAdminModalOpen(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenAddProject={handleOpenAddProject}
        onOpenAddSkill={handleOpenAddSkill}
      />

      <main id="main-content" tabIndex="-1" style={{ flexGrow: 1, outline: 'none' }}>
        {/* Hero Section */}
        <Hero onExploreProjects={() => setProjectsModalOpen(true)} />

        {/* Stats Ribbon */}
        <StatsRibbon projectsCount={projects.length} />

        {/* Two-Column Section: Featured Projects + Tech Stack */}
        <section id="projects" className="featured-tech-grid" aria-label="Projects and Skills showcase">
          {/* Column 1: Featured Projects */}
          <FeaturedProjects
            projects={projects}
            isAdmin={isAdmin}
            onViewAll={() => setProjectsModalOpen(true)}
            onEditProject={handleOpenEditProject}
            onDeleteProject={handleDeleteProject}
            onAddProject={handleOpenAddProject}
          />

          {/* Column 2: Tech Stack */}
          <div id="skills">
            <TechStack
              skills={skills}
              isAdmin={isAdmin}
              onViewAll={() => setSkillsModalOpen(true)}
              onAddSkill={handleOpenAddSkill}
              onEditSkill={handleOpenEditSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>
        </section>

        {/* About Me Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection notify={notify} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminModalOpen(true)} isAdmin={isAdmin} />

      {/* LAZY LOADED MODALS (Code-split to reduce main thread JS parse time) */}
      <Suspense fallback={null}>
        {projectsModalOpen && (
          <ProjectsModal
            isOpen={projectsModalOpen}
            onClose={() => setProjectsModalOpen(false)}
            projects={projects}
            isAdmin={isAdmin}
            onAddProject={handleOpenAddProject}
            onEditProject={handleOpenEditProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {skillsModalOpen && (
          <SkillsModal
            isOpen={skillsModalOpen}
            onClose={() => setSkillsModalOpen(false)}
            skills={skills}
            isAdmin={isAdmin}
            onAddSkill={handleOpenAddSkill}
            onEditSkill={handleOpenEditSkill}
            onDeleteSkill={handleDeleteSkill}
          />
        )}

        {adminModalOpen && (
          <AdminModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            isAdmin={isAdmin}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            projects={projects}
            skills={skills}
            onOpenAddProject={handleOpenAddProject}
            onEditProject={handleOpenEditProject}
            onDeleteProject={handleDeleteProject}
            onOpenAddSkill={handleOpenAddSkill}
            onEditSkill={handleOpenEditSkill}
            onDeleteSkill={handleDeleteSkill}
            notify={notify}
          />
        )}

        {projectEditorOpen && (
          <ProjectEditorModal
            isOpen={projectEditorOpen}
            onClose={() => setProjectEditorOpen(false)}
            project={editingProject}
            onSave={handleSaveProject}
          />
        )}

        {skillEditorOpen && (
          <SkillEditorModal
            isOpen={skillEditorOpen}
            onClose={() => setSkillEditorOpen(false)}
            skill={editingSkill}
            onSave={handleSaveSkill}
          />
        )}
      </Suspense>

      {/* Floating Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
