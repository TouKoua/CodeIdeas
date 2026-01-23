import "./Search.css";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import SearchFilter from "../components/SearchFilter";
import useFetchProjectList from "../context/ProjectGetter";
import { useState } from "react";

function Search() {
  const projectList = useFetchProjectList();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(
    projectList.projects,
  );
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    languages: [] as string[],
    technologies: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    let filtered = projectList.projects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase()),
    );
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter((project) =>
        filters.difficulty.includes(project.difficulty),
      );
    }
    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter((project) =>
        project.languages?.some((lang) => filters.languages.includes(lang)),
      );
    }

    if (filters.technologies && filters.technologies.length > 0) {
      filtered = filtered.filter((project) =>
        project.technologies?.some((tech) =>
          filters.technologies.includes(tech),
        ),
      );
    }
    setFilteredProjects(filtered);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
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
      <div className="search-flex-layout">
        <div className="search-filter-layout">
          <SearchFilter onApplyFilters={handleApplyFilters} />
        </div>
        <div className="search-grid-layout">
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
              <p className="search-no-results">No projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
