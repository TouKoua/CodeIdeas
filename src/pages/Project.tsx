import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useFetchSimilarProjects,
  useFetchSingleProject,
} from "../context/ProjectGetter";
import "./Project.css";
import "../ui/Badge.css";
import ProjectCard from "../components/ProjectCard";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";
import type { Idea } from "../types"; // adjust import path as needed

function ProjectContent({ project }: { project: Idea }) {
  const navigate = useNavigate();
  const projectList = useFetchSimilarProjects(project.id, project.technologies);

  const displayDate = project.updated_at || project.created_at;
  const isUpdated = !!project.updated_at;
  const formattedDate = new Date(displayDate || "").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="project-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <div className="grid-layout">
        <div className="project-column">
          <div className="project-section">
            <div className="project-padding">
              <div className="project-title-spacing">
                <h1 className="project-title">{project.title}</h1>
                <div className="badge-spacing">
                  <p>
                    <span className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </span>
                    <span className={getStatusColor(project.status || "")}>
                      {project.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="project-update">
                <span>
                  {isUpdated ? "Updated" : "Posted"} on {formattedDate}
                  {isUpdated && (
                    <span className="project-old-date">
                      (Originally posted{" "}
                      {new Date(project.created_at || "").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                      )
                    </span>
                  )}
                </span>
              </div>
              <div className="project-description-spacing">
                <p className="project-description">{project.description}</p>
              </div>
              <div className="project-duration-label">
                {project.duration && (
                  <div className="project-duration-text">
                    <span>
                      Estimated time to complete:{" "}
                      <strong>{project.duration}</strong>
                    </span>
                  </div>
                )}
                {project.team_size !== undefined && (
                  <div className="project-contributor-label">
                    <span>
                      Looking for{" "}
                      <strong>
                        {project.team_size === 0
                          ? "unlimited contributors"
                          : `${project.team_size} contributor${
                              project.team_size !== 1 ? "s" : ""
                            }`}
                      </strong>
                      {project.team_size > 0 && (
                        <span className="project-contributor-text">
                          (peep joined/{project.team_size} joined)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="project-language-section">
                <div className="project-language-spacing-1">
                  <span className="project-language-label">
                    Programming Languages:
                  </span>
                </div>
                <div className="project-language-spacing-2">
                  {project.technologies?.map((language) => (
                    <Link
                      key={language}
                      to={`/search?language=${language}`}
                      className="project-language-badge"
                    >
                      {language}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="other-column">
          <div className="profile-section"></div>
          {projectList.similarProjects.length > 0 && (
            <div>
              <h3 className="similar-project-title">Similar Projects</h3>
              <div className="similar-project-spacing">
                {projectList.similarProjects.map((similarProject) => (
                  <Link
                    to={`/project/${similarProject.id}`}
                    state={{ from: "project" }}
                    key={similarProject.id}
                    className="block"
                  >
                    <ProjectCard project={similarProject} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Project() {
  const { id } = useParams<{ id: string }>();
  const singleProject = useFetchSingleProject(id || "");

  if (singleProject.loading) {
    return <div>Loading...</div>;
  }

  if (!singleProject.project) {
    return <div>Project not found</div>;
  }

  return <ProjectContent project={singleProject.project} />;
}

export default Project;
