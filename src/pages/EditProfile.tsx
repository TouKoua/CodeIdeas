import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

interface UserProfile {
  id: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
}

function EditProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: profiledata, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user?.id)
          .single();
        if (profileError) {
          throw profileError;
        }
        setUserData(profiledata);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Handle profile update logic here
  };
  return (
    <div className="edit-profile-page">
      {userData?.full_name && (
        <div>
          <div className="edit-profile-header">
            <h1>{userData?.full_name}</h1>

            <img
              src={userData?.avatar_url || "/default-avatar.png"}
              alt={`${userData?.full_name}'s avatar`}
              className="edit-profile-avatar"
            />

            <p>{userData?.bio}</p>
          </div>
          <div className="edit-profile-skills">
            {(userData?.skills || []).map((skill: string) => (
              <span key={skill} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {error && <div className="edit-profile-error-message">{error}</div>}
    </div>
  );
}

export default EditProfile;
