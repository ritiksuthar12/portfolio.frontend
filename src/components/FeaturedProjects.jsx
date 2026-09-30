import React from 'react';
import { ArrowRight, ArrowUpRight, Edit3, Trash2, Plus } from 'lucide-react';
import { GithubIcon } from './TechIcons';

export default function FeaturedProjects({
  projects = [],
  isAdmin,
  onViewAll,
  onEditProject,
  onDeleteProject,
  onAddProject
}) {
  const featuredList = projects.filter(p => p.featured !== false).slice(0, 3);
  const displayList = featuredList.length > 0 ? featuredList : projects.slice(0, 3);

  return (
    <div>
      <div className="section-head-row">
        <h2 className="section-title">Featured Projects</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAdmin && (
            <button
              onClick={onAddProject}
              className="action-btn-sm"
              style={{ backgroundColor: '#111827', color: '#fff', borderColor: '#111827' }}
              title="Add New Project"
            >
              <Plus size={14} /> Add
            </button>
          )}
          <button onClick={onViewAll} className="view-all-link" aria-label="View all portfolio projects">
            View All <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="projects-mini-row">
        {displayList.map((project) => {
          const id = project.id || project._id;
          return (
            <div
              key={id}
              className="project-card"
            >
              <div>
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.title}</h3>
                  <a
                    href={project.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-arrow-btn"
                    title={`Open deployed ${project.title}`}
                    aria-label={`Open deployed demo of ${project.title} (opens in a new tab)`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>

                <p className="project-card-desc">{project.description}</p>
              </div>

              <div>
                <div className="tags-row">
                  {(project.tags || []).map((tag, idx) => (
                    <span key={idx} className="tag-badge">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="admin-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project);
                      }}
                      className="action-btn-sm edit"
                      title="Edit project"
                      aria-label={`Edit project ${project.title}`}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(id, project.title);
                      }}
                      className="action-btn-sm delete"
                      title="Delete project"
                      aria-label={`Delete project ${project.title}`}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn-sm"
                        style={{ marginLeft: 'auto' }}
                        title="GitHub Repo"
                        aria-label={`View ${project.title} source code on GitHub (opens in a new tab)`}
                      >
                        <GithubIcon size={12} color="#111827" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
