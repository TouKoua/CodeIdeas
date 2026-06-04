import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useFetchSimilarProjects,
  useFetchSingleProject,
  useFetchUser,
} from "../context/ProjectGetter";
import "./Project.css";
import "../ui/Badge.css";
import ProjectCard from "../components/ProjectCard";
import { getDifficultyColor, getStatusColor } from "../ui/Badge";
import type { Idea, Team, UpdatePost } from "../types"; // adjust import path as needed
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../services/supabaseClient";

function ProjectContent({ project }: { project: Idea }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Project Fetch variables
  const projectList = useFetchSimilarProjects(project.id, project.technologies);
  const projectUser = useFetchUser(project.creator_id);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Join Request Variables
  const [teamInfo, setTeamInfo] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isTeamFull, setIsTeamFull] = useState(false);
  const [updatePosts, setUpdatePosts] = useState<UpdatePost[]>([]);

  // Update Post Variables
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateDescription, setNewUpdateDescription] = useState("");

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("idea_id", project.id)
          .single();
        if (teamError) throw teamError;
        setTeamInfo(team);

        const { data: allTeamMembers, error: teamMembersListError } =
          await supabase
            .from("team_members")
            .select("*")
            .eq("team_id", team.id);
        if (teamMembersListError) throw teamMembersListError;
        setTeamMembers(allTeamMembers || []);

        const userIsMember = allTeamMembers?.some(
          (member) => member.user_id === user?.id,
        );
        if (userIsMember) {
          setIsTeamMember(true);
          setLoading(false);
          return;
        }

        if (allTeamMembers && allTeamMembers.length >= team.team_size) {
          setIsTeamFull(true);
          setLoading(false);
          return;
        }

        const { data: existingRequest, error: existingRequestError } =
          await supabase
            .from("join_requests")
            .select("*")
            .eq("team_id", team.id)
            .eq("user_id", user?.id);

        if (existingRequestError) throw existingRequestError;

        if (existingRequest && existingRequest.length > 0) {
          setHasPendingRequest(true);
        }
      } catch (error: any) {
        alert("Error checking team status: " + error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, [project.id, user?.id]);

  // Fetch update posts for the project
  const fetchUpdatePosts = async () => {
    const { data, error } = await supabase
      .from("update_posts")
      .select("*")
      .eq("idea_id", project.id)
      .order("updated_at", { ascending: false });
    if (error) {
      alert("Error fetching updates");
    } else {
      setUpdatePosts(data || []);
    }
  };

  // Mount update posts on page load
  useEffect(() => {
    fetchUpdatePosts();
  }, [project.id]);

  const handleJoinRequest = async () => {
    if (!user) {
      alert("Please log in to send a join request.");
      navigate("/login");
      return;
    }
    try {
      const { error: requestError } = await supabase
        .from("join_requests")
        .insert({
          team_id: teamInfo?.id,
          user_id: user.id,
          status: "pending",
          request_message: "",
          requested_at: new Date(),
        });
      if (requestError) throw requestError;
      setHasPendingRequest(true);
      alert("Join request sent!");
    } catch (error) {
      alert("Failed to send join request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("update_posts").insert({
        idea_id: project.id,
        title: newUpdateTitle,
        description: newUpdateDescription,
        updated_at: new Date(),
      });
      if (error) throw error;
      alert("Update post created!");
      setNewUpdateTitle("");
      setNewUpdateDescription("");

      // Refresh the update posts list after creating a new post
      await fetchUpdatePosts();
    } catch (error) {
      alert("Failed to create update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="project-container">
        <div className="project-main">
          <h1 className="project-title">{project.title}</h1>

          <div className="project-meta">
            <span className={getDifficultyColor(project.difficulty)}>
              {project.difficulty}
            </span>
            <span className={getStatusColor(project.status || "")}>
              {project.status}
            </span>
          </div>

          <div className="project-date">
            {project.updated_at ? "Updated" : "Posted"} on {formattedDate}
            {project.updated_at && (
              <span className="original-date">
                (Originally posted{" "}
                {new Date(project.created_at || "").toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
                )
              </span>
            )}
          </div>

          <p className="project-description">{project.description}</p>

          {project.duration && (
            <div className="project-duration">
              <strong>Estimated time:</strong> {project.duration}
            </div>
          )}

          <div className="project-languages">
            <strong>Technologies:</strong>
            <div className="language-list">
              {project.technologies?.map((language) => (
                <Link
                  key={language}
                  to={`/search?language=${language}`}
                  className="language-badge"
                >
                  {language}
                </Link>
              ))}
            </div>
          </div>

          <div className="team-info">
            <p>
              Team Size: {teamMembers.length}/{teamInfo?.team_size}
            </p>

            <div className="join-section">
              {isTeamMember ? (
                <p className="status-text">✓ You're already a member</p>
              ) : hasPendingRequest ? (
                <p className="status-text">⏳ Your request is pending</p>
              ) : isTeamFull ? (
                <p className="status-text">✗ This team is full</p>
              ) : (
                <button
                  onClick={handleJoinRequest}
                  disabled={loading}
                  className="join-button"
                >
                  {loading ? "Sending..." : "Join Project"}
                </button>
              )}
            </div>
          </div>

          <div className="updates-section">
            <h3>Project Updates</h3>
            {project.creator_id === user?.id && (
              <div className="new-update-form">
                <input
                  type="text"
                  placeholder="Update Title"
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                />
                <textarea
                  placeholder="Update Description"
                  value={newUpdateDescription}
                  onChange={(e) => setNewUpdateDescription(e.target.value)}
                />
                <button
                  onClick={handleUpdatePost}
                  disabled={loading}
                  className="post-update-button"
                >
                  {loading ? "Posting..." : "Post Update"}
                </button>
              </div>
            )}
            {updatePosts.length > 0 ? (
              <div className="updates-list">
                {updatePosts.map((update) => (
                  <div key={update.id} className="update-post">
                    <h4>{update.title}</h4>
                    <p>{update.description}</p>
                    <span className="update-date">
                      {new Date(update.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-updates">No updates available</p>
            )}
          </div>
        </div>

        <aside className="project-sidebar">
          <div className="owner-card">
            <h3>Project Owner</h3>
            <img
              src={projectUser.user?.avatar_url || "/default-avatar.png"}
              alt={`${projectUser.user?.first_name} ${projectUser.user?.last_name}'s avatar`}
              className="owner-avatar"
            />
            <br />
            <Link to={`/profile/${project.creator_id}`}>
              {projectUser.user?.first_name} {projectUser.user?.last_name}
            </Link>
          </div>

          {projectList.similarProjects.length > 0 && (
            <div className="similar-projects">
              <h3>Similar Projects</h3>
              <div className="similar-list">
                {projectList.similarProjects.map((similarProject) => (
                  <Link
                    to={`/project/${similarProject.id}`}
                    key={similarProject.id}
                  >
                    <ProjectCard project={similarProject} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
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
