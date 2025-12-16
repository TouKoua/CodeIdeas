import { Link } from "react-router-dom";
import React from "react";
import type { ProjectIdeas } from "../types";
import "./ProjectCard.css";

interface ProjectCardProps {
  project: ProjectIdeas;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "success";
    case "intermediate":
      return "warning";
    case "advance":
      return "danger";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "recruiting":
      return "primary";
    case "working":
      return "warning";
    case "completed":
      return "success";
    default:
      return "default";
  }
};

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
