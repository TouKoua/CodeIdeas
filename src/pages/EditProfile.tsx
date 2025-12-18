import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./EditProfile.css";
import type { UserProfile } from "../types/index";
import { addTag, removeTag, handleTagKeyPress } from "../utils/formHelpers";

function EditProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Skills Tag Logic
  const [skills, setSkills] = useState<string[]>(userData?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    addTag(skillInput, skills, setSkills, setSkillInput);
  };

  const removeSkill = (skill: string) => {
    removeTag(skill, skills, setSkills);
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    handleTagKeyPress(e, skillInput, skills, setSkills, setSkillInput);
  };

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
        setSkills(profiledata?.skills || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Handle profile update logic here
    try {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          full_name: userData?.full_name,
          bio: userData?.bio,
          skills: skills,
        })
        .eq("id", user?.id);
      if (updateError) {
        throw updateError;
      }
      navigate("/profile");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <h1>Edit Profile</h1>
        {userData?.full_name && (
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={userData.full_name}
              onChange={(e) =>
                setUserData({ ...userData, full_name: e.target.value })
              }
              disabled={loading}
            />

            {/* Bio Field */}
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={userData.bio || ""}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              placeholder="Tell us about yourself"
              disabled={loading}
            />

            {/* Skills Field (Using reusable tag logic) */}
            <label htmlFor="skills">Skills</label>
            <div className="skills-container">
              <div className="skills-input-wrapper">
                <input
                  id="skills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyPress}
                  placeholder="Add a skill and press Enter"
                  disabled={loading}
                />
                <button type="button" onClick={addSkill} disabled={loading}>
                  Add Skill
                </button>
              </div>
              <div className="skills-tags">
                {skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      disabled={loading}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Avatar URL Field */}
            <label htmlFor="avatarUrl">Avatar URL</label>
            <input
              id="avatarUrl"
              type="text"
              value={userData?.avatar_url || ""}
              onChange={(e) =>
                setUserData({ ...userData, avatar_url: e.target.value })
              }
              placeholder="Enter your avatar URL"
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {error && <div className="error-message">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
