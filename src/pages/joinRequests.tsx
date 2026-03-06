import { useAuth } from "../context/AuthContext.tsx";
import { useFetchUserPendingRequests } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./joinRequests.css";
import type { JoinRequest } from "../types/index.ts";

function JoinRequests() {
  const { user, userProfile } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user's join requests from Supabase
    const fetchJoinRequests = async () => {
      const {pendingRequests, error} = useFetchUserPendingRequests(user?.id || "");
      if (pendingRequests) {
        setRequests(pendingRequests);
      } else {
        setError(error || "Failed to fetch join requests.");
        setRequests([]);
      }
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
              <div className="request-info">
                <p>Project: {request.team_id}</p>
                <p>Status: {request.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>No join requests found.</p>
      )}
    </div>
  );
}

export default JoinRequests;
