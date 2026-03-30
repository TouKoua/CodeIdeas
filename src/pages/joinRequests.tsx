import { useAuth } from "../context/AuthContext.tsx";
import { useFetchUserPendingRequests } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "../styles/global.css";
import "./joinRequests.css";
import type { JoinRequest } from "../types/index.ts";
import supabase from "../services/supabaseClient.ts";

function JoinRequests() {
  const { user, userProfile } = useAuth();
  const [teamRequests, setTeamRequests] = useState<JoinRequest[]>([]);
  const { pendingRequests, error: pendingRequestsError } =
    useFetchUserPendingRequests(user?.id || "");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

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
          "*, user: user_profiles(id, first_name, last_name), team: team_id(id, name, description, team_size)",
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
    try {
      setIsProcessing(request.id);
      // Remove the request from UI immediately (optimistic update)
      setTeamRequests((prev) => prev.filter((req) => req.id !== request.id));

      const { error } = await supabase.rpc("approve_join_request", {
        v_request_id: request.id,
        v_team_id: request.team.id,
        v_user_id: request.user.id,
      });

      if (error) {
        console.error("Error approving request:", error);
        setError(error.message);
        // Re-fetch if error to restore the request
        fetchOwnProjectJoinRequests();
        return;
      }

      alert(
        "Request approved! The requester will be notified and added to the team if they are not already a member.",
      );
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
      // Re-fetch if error to restore the request
      fetchOwnProjectJoinRequests();
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setIsProcessing(requestId);
    try {
      // Remove from UI immediately (optimistic update)
      setTeamRequests((prev) => prev.filter((req) => req.id !== requestId));

      const { error } = await supabase.rpc("reject_join_request", {
        requestid: requestId,
      });

      if (error) {
        console.error("Error rejecting request:", error);
        setError(error.message);
        // Re-fetch if error to restore the request
        fetchOwnProjectJoinRequests();
        return;
      }

      alert("Request rejected!");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
      // Re-fetch if error to restore the request
      fetchOwnProjectJoinRequests();
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="join-requests-page">
          <h1>Join Requests</h1>
          <p>
            Welcome, {userProfile?.first_name}! Here are your join requests.
          </p>

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
                      Message:{" "}
                      {request.request_message || "No message provided."}
                    </p>
                    <p>
                      Requested At:{" "}
                      {new Date(request.requested_at).toLocaleString()}
                    </p>
                    <p>Requester: {request.user?.first_name}</p>
                    <p>Status: {request.status}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={isProcessing === request.id}
                    >
                      {isProcessing === request.id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={isProcessing === request.id}
                    >
                      {isProcessing === request.id ? "Rejecting..." : "Reject"}
                    </button>
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
      </div>
    </div>
  );
}

export default JoinRequests;
