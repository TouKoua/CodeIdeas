import React from "react";
import type { ProjectIdeas } from "../types";
import "./ProjectCard.css";

interface ProjectCardProps {
  project: ProjectIdeas;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="card-design">
      <div className="card-padding">
        <div className="card-title-section">
          <h3 className="card-title">{project.title}</h3>
          <div className="card-top-icons"></div>
          <div className="card-spacing"></div>
        </div>
        <p className="card-description">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
