import { Link } from "react-router-dom";
import React from "react";
import type { ProjectIdeas } from "../types";
import "./ProjectCard.css";
import "../ui/Badge.css";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";

interface ProjectCardProps {
  project: ProjectIdeas;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="card-design">
      <div className="card-padding">
        <div className="card-title-section">
          <h3 className="card-title">{project.title}</h3>
          <p>
            <span className={getDifficultyColor(project.difficulty)}>
              {project.difficulty}
            </span>
            <span className={getStatusColor(project.status)}>
              {project.status}
            </span>
          </p>
          <div className="card-spacing"></div>
        </div>
        <p className="card-description">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
