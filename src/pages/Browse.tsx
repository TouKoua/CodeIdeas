import { Link } from "react-router-dom";
import "./Browse.css";
import ProjectCard from "../components/ProjectCard";
import { fetchAllProjects } from "../context/ProjectFetch";

async function Browse() {
  const projects = (await fetchAllProjects()) || [];
  const getProjectsToDisplay = () => {
    return projects.slice(0, 1);
  };

  const projectsToDisplay = getProjectsToDisplay();

  return (
    <div className="browse-page">
      <div className="browse-intro">
        <div className="browse-design">
          <h1>
            Explore Project Ideas
            <Link to="/signup" className="btn btn-primary">
              Refresh
            </Link>
          </h1>
        </div>
        <p>
          Browse through hundreds of project ideas from the community. Find
          inspiration, learn new skills, and build your portfolio with projects
          that match your interests and skill level.
        </p>
      </div>
      {projectsToDisplay.length > 0 ? (
        <div className="browse-projects">
          {projectsToDisplay.map((project) => (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="block"
            >
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      ) : (
        <p>No projects available at the moment. Please check back later.</p>
      )}
      {/* {error && <p className="error-message">{error}</p>} */}
    </div>
  );
}

export default Browse;
