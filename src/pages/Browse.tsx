import { Link } from "react-router-dom";
import "./Browse.css";
import ProjectCard from "../components/ProjectCard";
import { useState, useEffect } from "react";
import type { ProjectIdeas } from "../types";
import supabase from "../services/supabaseClient";

function Browse() {
  const [projects, setProjects] = useState<ProjectIdeas[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("ideas").select("*");
      if (error) {
        setError(error.message);
        setProjects([]);
      } else {
        setProjects(data);
        setError(null);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="browse-page">
      <div className="browse-intro">
        <div className="browse-design">
          <h1>Explore Project Ideas</h1>
          <Link to="/signup" className="btn btn-primary">
            <h2>Refresh</h2>
          </Link>
        </div>
        <p>
          Browse through hundreds of project ideas from the community. Find
          inspiration, learn new skills, and build your portfolio with projects
          that match your interests and skill level.
        </p>
      </div>
      {projects.length > 0 ? (
        <div className="browse-cards">
          {projects.map((project) => (
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
