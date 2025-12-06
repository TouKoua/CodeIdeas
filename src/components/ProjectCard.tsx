import { Link } from 'react-router-dom';

return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getDifficultyColor(project.difficulty)}
              size="sm"
            >
              {project.difficulty}
            </Badge>
            {project.status && project.showStatus !== false && (
              <Badge 
                variant={getStatusColor(project.status)}
                size="sm"
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {getStatusLabel(project.status)}
                </span>
              </Badge>
            )}
            {isUpdated && (
              <Badge variant="primary" size="sm">
                Updated
              </Badge>
            )}
            {isContributorLimitReached && shouldShowContributorInfo && (
              <Badge variant="danger" size="sm">
                Full
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        


        {/* Programming Skills */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <CpuIcon size={14} className="text-gray-500 mr-1" />
            <span className="text-xs font-medium text-gray-700">Skills:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.programmingSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} size="sm" variant="secondary">
                {skill}
              </Badge>
            ))}
            {project.programmingSkills.length > 3 && (
              <Badge size="sm" variant="default">
                +{project.programmingSkills.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Project Info */}
        <div className="space-y-2 mb-4">
          {project.estimatedTime && (
            <div className="flex items-center text-gray-500 text-sm">
              <ClockIcon size={16} className="mr-1" />
              <span>Est. time: {project.estimatedTime}</span>
            </div>
          )}
          
          {project.maxContributors && shouldShowContributorInfo && (
            <div className="flex items-center text-gray-500 text-sm">
              <UsersIcon size={16} className="mr-1" />
              <span>
                Looking for {project.maxContributors === 0 ? 'unlimited' : project.maxContributors} contributor{project.maxContributors !== 1 ? 's' : ''}
                {project.currentContributors !== undefined && project.maxContributors > 0 && (
                  <span className="ml-1">
                    ({project.currentContributors}/{project.maxContributors} joined)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Link 
              to={getProfileLink()}
              onClick={handleUserClick}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={project.createdBy.avatar} 
                alt={project.createdBy.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                {project.createdBy.name}
              </span>
            </Link>
            <span className="text-sm text-gray-600 mx-1">•</span>
            <span className="text-sm text-gray-600">
              {isUpdated ? 'Updated' : 'Posted'} {formattedDate}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex items-center text-gray-500">
              <EyeIcon size={18} className="mr-1" />
              <span>{project.views}</span>
            </div>
            
            <button 
              className={`flex items-center transition-colors ${
                project.saved ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
              } ${!currentUser && 'opacity-50 cursor-not-allowed'}`}
              onClick={(e) => handleButtonClick(e, () => saveProject(project.id))}
              title={currentUser ? undefined : "Sign in to save projects"}
            >
              <BookmarkIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;