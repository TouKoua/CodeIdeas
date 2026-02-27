import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";
import type { UserProfile } from "../types/index";

function ProfilePage({ user_id }: { user_id: string | null }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileUserId = user_id || user?.id; // Create a new variable
  const isOwnProfile = !user_id || user_id === user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profileUserId) return; // Safety check

      try {
        const { data: profiledata, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", profileUserId)
          .single();
        if (profileError) {
          throw profileError;
        }
        setUserData(profiledata);

        const { data: ideasData, error: ideasError } = await supabase
          .from("ideas")
          .select("*")
          .eq("creator_id", profileUserId);
        if (ideasError) {
          throw ideasError;
        }
        setIdeas(ideasData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileUserId]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="profile-page">
      {userData?.first_name && (
        <div>
          <div className="profile-header">
            <h1>
              {userData?.first_name} {userData?.last_name}
            </h1>

            <img
              src={userData?.avatar_url || "/default-avatar.png"}
              alt={`${userData?.first_name} ${userData?.last_name}'s avatar`}
              className="profile-avatar"
            />

            <p>{userData?.bio}</p>
          </div>
          <div className="profile-skills">
            <h2>Skills</h2>
            {(userData?.skills || []).map((skill: string) => (
              <span key={skill} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>

          <div className="profile-ideas">
            <h2>Project Ideas</h2>
            {ideas.length > 0 ? (
              <ul className="ideas-list">
                {ideas.map((idea) => (
                  <li key={idea.id} className="idea-item">
                    <Link to={`/ideas/${idea.id}`} className="idea-link">
                      <h3>{idea.title}</h3>
                      <p>{idea.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>This user has not shared any project ideas yet.</p>
            )}
          </div>
          {isOwnProfile && (
            <div className="edit-profile-link">
              <Link to="/edit-profile" className="btn btn-secondary">
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ProfilePage;
