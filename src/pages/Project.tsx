import { Link, useParams } from "react-router-dom";
import {
  useFetchSimilarProjects,
  useFetchSingleProject,
  useFetchTeamCount,
} from "../context/ProjectGetter";
import { useAuth } from "../context/AuthContext";
import "./Project.css";
import "../ui/Badge.css";
import ProjectCard from "../components/ProjectCard";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";

function Project() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const singleProject = useFetchSingleProject(id!);
  const projectList = useFetchSimilarProjects(singleProject.project);
  //const teamCount = useFetchTeamCount(singleProject.project);
  const isOwner = user && user.id === singleProject.project.creator_id;
  const displayDate =
    singleProject.project.updated_at || singleProject.project.created_at;
  const isUpdated = !!singleProject.project.updated_at;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const shouldShowContributorInfo = true;
  const isEditing = false;

  return (
    <div className="project-page">
      <button onClick={() => history.back()} className="back-button">
        Back
      </button>
      <div className="grid-layout">
        <div className="project-column">
          <div className="project-section">
            <div className="project-padding">
              <div className="project-title-spacing">
                {/*{isEditing ? displayProject : editProject}*/}
                <h1 className="project-title">
                  {singleProject.project?.title}
                </h1>
                <div className="badge-spacing">
                  <p>
                    <span
                      className={getDifficultyColor(
                        singleProject.project.difficulty
                      )}
                    >
                      {singleProject.project.difficulty}
                    </span>
                    <span
                      className={getStatusColor(singleProject.project.status)}
                    >
                      {singleProject.project.status}
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
                      {new Date(
                        singleProject.project.created_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      )
                    </span>
                  )}
                </span>
              </div>
              <div className="project-description-spacing">
                <p className="project-description">
                  {singleProject.project.description}
                </p>
              </div>
              <div className="project-duration-label">
                {singleProject.project.duration && (
                  <div className="project-duration-text">
                    <span>
                      Estimated time to complete:{" "}
                      <strong>{singleProject.project.duration}</strong>
                    </span>
                  </div>
                )}
                {singleProject.project.team_size !== undefined &&
                  shouldShowContributorInfo && (
                    <div className="project-contributor-label">
                      <span>
                        Looking for{" "}
                        <strong>
                          {singleProject.project.team_size === 0
                            ? "unlimited contributors"
                            : `${singleProject.project.team_size} contributor${
                                singleProject.project.team_size !== 1 ? "s" : ""
                              }`}
                        </strong>
                        {singleProject.project.team_size > 0 && (
                          <span className="project-contributor-text">
                            (peeps/
                            {singleProject.project.team_size} joined)
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
                  {singleProject.project.languages?.map((language) => (
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
              <div className="project-buttons">
                <button className="project-edit">
                  {isEditing ? "Save Project" : "Edit Project"}
                </button>
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

export default Project;
