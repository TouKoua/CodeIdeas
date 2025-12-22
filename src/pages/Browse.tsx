import { Link } from "react-router-dom";
import "./Browse.css";
import ProjectCard from "../components/ProjectCard";
import { useState } from "react";
import useFetchProjectList from "../context/ProjectGetter";

function Browse() {
  const projectList = useFetchProjectList();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "recent", name: "Recent" },
    { id: "beginner", name: "Beginner Friendly" },
  ];

  const latestProjects = [...projectList.projects]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 12);

  const beginnerProjects = projectList.projects
    .filter((project) => project.difficulty === "beginner")
    .slice(0, 12);

  const getProjectsToDisplay = () => {
    switch (selectedCategory) {
      case "recent":
        return latestProjects;
      case "beginner":
        return beginnerProjects;
      default:
        return projectList.projects.slice(0, 12); // Show first 12 projects for "All" category
    }
  };

  const projectsToDisplay = getProjectsToDisplay();

  return (
    <div className="browse-page">
      <div className="browse-top">
        <div className="browse-top-design">
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
      <div className="quick-actions">
        <Link to="/new-project">
          <button>Post New Idea</button>
        </Link>
        <Link to="/search">
          <button>Advanced Search</button>
        </Link>
      </div>
      <div className="card-display">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`category-selects ${
              selectedCategory === category.id
                ? "selected-category"
                : "not-selected-category"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {projectsToDisplay.length > 0 ? (
        <div className="browse-cards">
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
