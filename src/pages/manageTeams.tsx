import { useAuth } from "../context/AuthContext.tsx";
import { useState, useEffect } from "react";
import "./manageTeams.css";
import type { Team, TeamMember, UserProfile } from "../types/index.ts";
import { useParams } from "react-router-dom";
import supabase from "../services/supabaseClient.ts";

function ManageTeams() {
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const [team, setTeam] = useState<Team[] | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const projectTeam = await supabase
        .from("teams")
        .select(
          "*, team_members(id, user_id, role, user_profiles(first_name, last_name, avatar_url))",
        )
        .eq("idea_id", id);
      if (projectTeam.data) {
        const members =
          projectTeam.data[0].team_members?.map((m: any) => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            name: `${m.user_profiles.first_name} ${m.user_profiles.last_name}`,
            avatar: m.user_profiles.avatar_url,
          })) || [];
        setMembers(members);
      }

      setTeam(projectTeam.data);
    };
    fetchTeam();
  }, [id, user]);

  return (
    <div className="manage-teams-page">
      <h1>Manage Team</h1>
      {team ? (
        <div className="team-members">
          {members.map((member: TeamMember) => (
            <div key={member.id} className="team-member">
              <img src={member.avatar} alt="avatar" />
              <p>{member.first_name}</p>
              <span>{member.role}</span>
              <button>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No team members found.</p>
      )}
    </div>
  );
}

export default ManageTeams;
