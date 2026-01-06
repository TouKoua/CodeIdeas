import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useFetchSingleProject } from "../context/ProjectGetter.tsx";
import "./ViewIdeas.css";

function ViewIdeas() {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const { project, loading, error } = useFetchSingleProject(projectID || "");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  return (
    <div className="view-ideas-page">
      <div className="idea-header">
        <h1 className="idea-main-title">{project?.title}</h1>
        <div className="idea-badges">
          <span className="badge category-badge">{project?.category}</span>
          <span className="badge difficulty-badge">{project?.difficulty}</span>
          <span className="badge status-badge">{project?.status}</span>
        </div>
      </div>

      <div className="idea-content">
        {/* Description Section */}
        <div className="idea-description-section">
          <div className="section-card">
            <h2>About</h2>
            <p className="description-text">{project?.description}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="idea-details-grid">
          {/* Tech Stack */}
          <div className="detail-card">
            <h3>Tech Stack</h3>
            <div className="tech-stack-display">
              {project?.tech_stack && project.tech_stack.length > 0 ? (
                project.tech_stack.map((tech) => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))
              ) : (
                <p className="empty-text">No tech stack specified</p>
              )}
            </div>
          </div>

          {/* Team Size */}
          <div className="detail-card">
            <h3>Team Size</h3>
            <p className="detail-value">
              {project?.team_size || "Not specified"}
            </p>
          </div>

          {/* Duration */}
          <div className="detail-card">
            <h3>Duration</h3>
            <p className="detail-value">
              {project?.duration || "Not specified"}
            </p>
          </div>

          {/* GitHub Link */}
          <div className="detail-card">
            <h3>GitHub</h3>
            {project?.github_link ? (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                View Repository →
              </a>
            ) : (
              <p className="empty-text">No GitHub link provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="idea-actions">
        {user && user.id === project?.creator_id && (
          <div className="owner-actions">
            <button
              onClick={() => navigate(`/edit-idea/${projectID}`)}
              className="btn btn-primary"
            >
              ✏️ Edit Idea
            </button>
            {/* TODO: Add delete button here */}
          </div>
        )}
        {user && user.id !== project?.creator_id && (
          <button className="btn btn-collaborate">👥 Join Collaboration</button>
        )}
      </div>
    </div>
  );
}

export default ViewIdeas;
