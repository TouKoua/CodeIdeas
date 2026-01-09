import "./Search.css";
import ProjectCard from "../components/ProjectCard";
import {} from "../context/ProjectGetter";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import useFetchProjectList from "../context/ProjectGetter";
import { useEffect, useState } from "react";

function Search() {
  const projectList = useFetchProjectList();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(
    projectList.projects
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const filtered = projectList.projects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className="search-page">
      <h1 className="search-title">Search Project Ideas</h1>

      <div className="search-bar-position">
        /*
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
        */
        <input
          type="text"
          placeholder="Search by title, description, or tags..."
          value={searchQuery}
          onChange={handleChange}
          className="search-input"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="search-results-layout">
          {filteredProjects.length > 0 ? (
            <div>
              <p className="search-results-count">
                Found {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? "result" : "results"}
              </p>

              <div className="search-card-spacing">
                {filteredProjects.map((project) => (
                  <Link
                    to={`/project/${project.id}`}
                    state={{ from: "search" }}
                    key={project.id}
                    className="block"
                  >
                    <ProjectCard project={project} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
