import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useFetchSimilarProjects,
  useFetchSingleProject,
} from "../context/ProjectGetter";
import "./Project.css";
import "../ui/Badge.css";
import ProjectCard from "../components/ProjectCard";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";
import type { Idea } from "../types"; // adjust import path as needed
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../services/supabaseClient";

function ProjectContent({ project }: { project: Idea }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const projectList = useFetchSimilarProjects(project.id, project.technologies);
  const [isTeamMember, setIsTeamMember] = useState(false);
  //const teamCount = useFetchTeamCount(singleProject.project);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const checkMembership = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .eq("user_id", user?.id)
        .single();

      setIsTeamMember(!!data);
    };

    if (user?.id && teamId) checkMembership();
  }, [user, teamId]);

  const handleJoinRequest = async (projectID: string) => {
    // Implement join request logic here, e.g., open a modal or send a request to the backend
    if (!user) {
      alert("Please log in to send a join request.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // fetch the team information
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("idea_id", projectID)
        .single();
      if (teamError) throw teamError;

      // check if an existing request for this user to this team already exists
      const { data: existingRequest, error: existingRequestError } =
        await supabase
          .from("join_requests")
          .select("*")
          .eq("team_id", team.id)
          .eq("user_id", user.id)
          .single();
      if (existingRequestError) {
        throw existingRequestError;
      }

      if (existingRequest) {
        alert("You have already sent a join request for this project.");
        setLoading(false);
        return;
      }

      // Create the join request
      const { error: requestError } = await supabase
        .from("join_requests")
        .insert({
          team_id: team.id,
          user_id: user.id,
          status: "pending",
          request_message: "",
          requested_at: new Date(),
        });
      if (requestError) throw requestError;
      // IF join request is successful, show confirmation message and reset state after a delay
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
      alert("Join request sent!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <div className="grid-layout">
        <div className="project-column">
          <div className="project-section">
            <div className="project-padding">
              <div className="project-title-spacing">
                <h1 className="project-title">{project.title}</h1>
                <div className="badge-spacing">
                  <p>
                    <span className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </span>
                    <span className={getStatusColor(project.status || "")}>
                      {project.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="project-update">
                <span>
                  {project.updated_at ? "Updated" : "Posted"} on {formattedDate}
                  {project.updated_at && (
                    <span className="project-old-date">
                      (Originally posted{" "}
                      {new Date(project.created_at || "").toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                      )
                    </span>
                  )}
                </span>
              </div>
              <div className="project-description-spacing">
                <p className="project-description">{project.description}</p>
              </div>
              <div className="project-duration-label">
                {project.duration && (
                  <div className="project-duration-text">
                    <span>
                      Estimated time to complete:{" "}
                      <strong>{project.duration}</strong>
                    </span>
                  </div>
                )}
              </div>
              <div className="project-language-section">
                <div className="project-language-spacing-1">
                  <span className="project-language-label">
                    Programming Languages:
                  </span>
                </div>
                <div className="project-language-spacing-2">
                  {project.technologies?.map((language) => (
                    <Link
                      key={language}
                      to={`/search?language=${language}`}
                      className="project-language-badge"
                    >
                      {language}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="join-button-section">
                <button
                  onClick={() => handleJoinRequest(project.id)}
                  disabled={loading || requestSent}
                >
                  {requestSent ? "Request Sent" : "Join Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="other-column">
          <div className="profile-section"></div>
          {projectList.similarProjects.length > 0 && (
            <div>
              <h3 className="similar-project-title">Similar Projects</h3>
              <div className="similar-project-spacing">
                {projectList.similarProjects.map((similarProject) => (
                  <Link
                    to={`/project/${similarProject.id}`}
                    state={{ from: "project" }}
                    key={similarProject.id}
                    className="block"
                  >
                    <ProjectCard project={similarProject} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Project() {
  const { id } = useParams<{ id: string }>();
  const singleProject = useFetchSingleProject(id || "");

  if (singleProject.loading) {
    return <div>Loading...</div>;
  }

  if (!singleProject.project) {
    return <div>Project not found</div>;
  }

  return <ProjectContent project={singleProject.project} />;
}

export default Project;
