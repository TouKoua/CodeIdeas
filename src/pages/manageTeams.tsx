import { useAuth } from "../context/AuthContext.tsx";
import { useState, useEffect } from "react";
import "../styles/global.css";
import "./manageTeams.css";
import type { Team } from "../types/index.ts";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../services/supabaseClient.ts";

function ManageTeams() {
  const { ideaid } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Verify that the current user is the creator of the team
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .select("*, idea:idea_id(creator_id)")
          .eq("idea_id", ideaid)
          .single();

        if (teamError) throw teamError;

        const teamid = team.id;
        setTeam(team);

        // Check if user is creator
        if (team.idea.creator_id !== user.id) {
          setError("You can only manage teams you created");
          setLoading(false);
          return;
        }

        // Fetch team members and their user profiles
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select("*, user_profiles:user_id(first_name, last_name, avatar_url)")
          .eq("team_id", teamid);
        if (membersError) throw membersError;

        const formattedMembers = membersData.map((member) => ({
          id: member.id,
          name: `${member.user_profiles.first_name} ${member.user_profiles.last_name}`,
          avatar: member.user_profiles.avatar_url,
          role: member.role,
        }));
        setMembers(formattedMembers);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to fetch team data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [ideaid, user.id]);

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) {
      return;
    }
    try {
      const { error } = await supabase.rpc("remove_team_member", {
        member_id: memberId,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("Error removing team member:", err);
      setError("Failed to remove team member.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="manage-teams-page">
          <div className="manage-team-container">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Back
            </button>
            <h1>Manage Team</h1>
            {team ? (
              <div className="team-info">
                <h2>{team.name}</h2>
                {team.description && <p>{team.description}</p>}
                <p>
                  <strong>Max Size:</strong> {team.team_size}
                </p>
                <p>
                  <strong>Current Members:</strong> {members.length} /{" "}
                  {team.team_size}
                </p>
                {members.length === 0 ? (
                  <p>No members yet</p>
                ) : (
                  <div className="members-list">
                    {members.map((member) => (
                      <div key={member.id} className="member-card">
                        <img src={member.avatar} alt="avatar" />
                        <div>
                          <p>{member.name}</p>
                          <span>{member.role}</span>
                        </div>
                        {member.role !== "creator" && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="remove-button"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>No team found for this idea.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTeams;
