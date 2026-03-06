import { useAuth } from "../context/AuthContext.tsx";
import { useFetchUserPendingRequests } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./joinRequests.css";
import type { JoinRequest } from "../types/index.ts";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";

function JoinRequests() {
  const { user, userProfile } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[] | null>(null);

  useEffect(() => {
    // Fetch user's join requests from Supabase
    const fetchJoinRequests = async () => {
      const userJoinRequests = useFetchUserPendingRequests(user?.id || "");
      setRequests(userJoinRequests);
    };
    fetchJoinRequests();
  }, [user]);

  return (
    <div className="join-requests-page">
      <h1>Join Requests</h1>
      <p>Welcome, {userProfile?.first_name}! Here are your join requests.</p>
      {requests && requests.length > 0 ? (
        <div className="ProjectCard-container">
          {requests.map((request) => (
            <div key={request.id} className="ProjectCard">
              <Link to={`/project/${request.id}`} className="project-link">
                <ProjectCard project={request} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No join requests found.</p>
      )}
    </div>
  );
}

export default JoinRequests;
