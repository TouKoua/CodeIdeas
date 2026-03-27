import { useAuth } from "../context/AuthContext.tsx";
import { useFetchUserPendingRequests } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./joinRequests.css";
import type { JoinRequest } from "../types/index.ts";
import supabase from "../services/supabaseClient.ts";

function JoinRequests() {
  const { user, userProfile } = useAuth();
  const [teamRequests, setTeamRequests] = useState<JoinRequest[]>([]);
  const { pendingRequests, error: pendingRequestsError } =
    useFetchUserPendingRequests(user?.id || "");
  const [error, setError] = useState<string | null>(null);

  const fetchOwnProjectJoinRequests = async () => {
    try {
      // Step 1: Fetch teams where the user is a creator
      const { data: teams, error: teamsError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user?.id)
        .eq("role", "creator");

      if (teamsError) {
        throw new Error(teamsError.message);
      }

      if (!teams || teams.length === 0) {
        setTeamRequests([]);
        return;
      }

      const teamIds = teams.map((team) => team.team_id);

      const { data: joinRequests, error: requestsError } = await supabase
        .from("join_requests")
        .select(
          "*, user: user_profiles(first_name, last_name), team: team_id(name, description, team_size)",
        )
        .in("team_id", teamIds)
        .eq("status", "pending");
      if (requestsError) {
        throw new Error(requestsError.message);
      }
      const enrichedRequests = joinRequests.map((request) => ({
        ...request,
        user: request.user,
        team: request.team,
      }));
      setTeamRequests(enrichedRequests);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setTeamRequests([]);
      return;
    }
  };
  useEffect(() => {
    // Fetch other's join requests to user's OWN projects from Supabase
    fetchOwnProjectJoinRequests();
  }, [user]);

  const handleApprove = async (request: JoinRequest) => {
    const { error } = await supabase.rpc("approve_join_request", {
      request_id: request.id,
    });

    if (error) {
      setError(error.message);
      return;
    }
    // Refresh data after
    alert(
      "Request approved! The requester will be notified and added to the team if they are not already a member.",
    );
    fetchOwnProjectJoinRequests();
  };

  const handleReject = async (requestId: string) => {
    const { error } = await supabase.rpc("reject_join_request", {
      request_id: requestId,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Refresh data after
    alert("Request rejected! The requester will be notified.");
    fetchOwnProjectJoinRequests();
  };

  return (
    <div className="join-requests-page">
      <h1>Join Requests</h1>
      <p>Welcome, {userProfile?.first_name}! Here are your join requests.</p>

      <h2>Requests to Your Projects</h2>
      {teamRequests && teamRequests.length > 0 ? (
        <div className="ProjectCard-container">
          {teamRequests.map((request) => (
            <div key={request.id} className="ProjectCard">
              <div className="request-info">
                <p>Project: {request.team.name}</p>
                <p>
                  Description:{" "}
                  {request.team.description || "No description provided."}
                </p>
                <p>Team Size: {request.team.team_size || "N/A"}</p>
                <p>
                  Message: {request.request_message || "No message provided."}
                </p>
                <p>
                  Requested At:{" "}
                  {new Date(request.requested_at).toLocaleString()}
                </p>
                <p>Requester: {request.user?.first_name}</p>
                <p>Status: {request.status}</p>
              </div>
              <div className="request-actions">
                <button onClick={() => handleApprove(request)}>Approve</button>
                <button onClick={() => handleReject(request.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>No join requests to your projects found.</p>
      )}

      <h2>Your Join Requests to Other Projects</h2>
      {pendingRequests && pendingRequests.length > 0 ? (
        <div className="ProjectCard-container">
          {pendingRequests.map((request) => (
            <div key={request.id} className="ProjectCard">
              <div className="request-info">
                <p>Project: {request.team.name}</p>
                <p>
                  Description:{" "}
                  {request.team.description || "No description provided."}
                </p>
                <p>Team Size: {request.team.team_size || "N/A"}</p>
                <p>
                  Requested At:{" "}
                  {new Date(request.requested_at).toLocaleString()}
                </p>
                <p>Status: {request.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : pendingRequestsError ? (
        <p>{pendingRequestsError}</p>
      ) : (
        <p>No join requests found.</p>
      )}
    </div>
  );
}

export default JoinRequests;
