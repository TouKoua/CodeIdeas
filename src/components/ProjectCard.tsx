import { Link } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  /*const { saveProject } = useProjects();*/

  return (
    <div className="card-properties">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.id}
          </h3>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
