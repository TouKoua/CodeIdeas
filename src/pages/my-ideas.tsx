import { useAuth } from "../context/AuthContext.tsx";
import { fetchUserIdeas } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./myIdeas.css";
import type { Idea } from "../types/index.ts";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import supabase from "../services/supabaseClient.ts";

function MyIdeas() {
  const { user, userProfile } = useAuth();
  const [ideas, setIdeas] = useState<Idea[] | null>(null);

  useEffect(() => {
    // Fetch user's ideas from Supabase
    const fetchIdeas = async () => {
      const userIdeas = await fetchUserIdeas(user);
      setIdeas(userIdeas);
    };
    fetchIdeas();
  }, [user]);

  const handleDeleteIdea = async (ideaId: string) => {
    // Implement idea deletion logic here
    // After deletion, refetch the ideas to update the UI
    if (!window.confirm("Are you sure you want to delete this idea?")) {
      return;
    }
    try {
      const { error } = await supabase.rpc("deleteidea", {
        ideaid: ideaId,
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      alert("Error deleting idea: " + err.message);
      return;
    }

    const userIdeas = await fetchUserIdeas(user);
    setIdeas(userIdeas);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="my-ideas-page">
          <h1>My Project Ideas</h1>
          <p>Create, edit, and manage your project ideas here.</p>

          {ideas && ideas.length > 0 ? (
            <div className="ProjectCard-container">
              {ideas.map((idea) => (
                <div key={idea.id} className="ProjectCard">
                  <div className="ProjectCard-content">
                    <h2 className="ProjectCard-title">{idea.title}</h2>
                    <p className="ProjectCard-description">
                      {idea.description}
                    </p>
                    <p className="ProjectCard-meta">
                      {idea.difficulty} • {idea.duration}
                    </p>
                  </div>
                  <div className="ProjectCard-actions">
                    <Link to={`/edit-idea/${idea.id}`} className="edit-btn">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't created any project ideas yet.</p>
              <Link to="/new-project">Create Your First Idea</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyIdeas;
