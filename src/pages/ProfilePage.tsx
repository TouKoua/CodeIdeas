import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "./ProfilePage.css";
import type { UserProfile } from "../types/index";

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { user_id: incoming_id } = useParams<{ user_id: string }>();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileUserId = incoming_id || user?.id; // Create a new variable
  const isOwnProfile = incoming_id === user?.id;

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

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      // Get the current session to access the JWT token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId: user?.id }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }

      alert("Account deleted successfully");
      await supabase.auth.signOut();
      navigate("/");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="profile-page">
          {userData?.first_name && (
            <div>
              {isOwnProfile && (
                <div className="edit-profile-link">
                  <Link to="/edit-profile" className="btn btn-secondary">
                    Edit Profile
                  </Link>
                </div>
              )}

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
                        <Link to={`/project/${idea.id}`} className="idea-link">
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
                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>
                    Permanently delete your account and all associated data.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-danger"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
