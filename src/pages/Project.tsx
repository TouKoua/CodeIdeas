import { Link, useParams } from "react-router-dom";
import {
  useFetchSimilarProjects,
  useFetchSingleProject,
} from "../context/ProjectGetter";
import "./Project.css";
import "../ui/Badge.css";
import ProjectCard from "../components/ProjectCard";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";

function Project() {
  const { id } = useParams<{ id: string }>();
  const singleProject = useFetchSingleProject(id!);
  const projectList = useFetchSimilarProjects(singleProject.project);

  return (
    <div className="project-page">
      <button onClick={() => history.back()} className="back-button">
        Back
      </button>
      <div className="grid-layout">
        <div className="project-column">
          <div className="project-section">
            <div className="project-padding">
              <div className="project-spacing">
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
                <div className="project-description-spacing">
                  <p className="project-description">
                    {singleProject.project.description}
                  </p>
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

export default Project;
