import { useAuth } from "../context/AuthContext.tsx";
import { fetchUserIdeas } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./myIdeas.css";
import type { Idea } from "../types/index.ts";
import { Link } from "react-router-dom";
import supabase from "../services/supabaseClient.ts";

function MyIdeas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        const userIdeas = await fetchUserIdeas(user);
        setIdeas(userIdeas);
      } catch (err: any) {
        console.error("Error fetching ideas:", err);
        setError("Failed to load your ideas. Please try again.");
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const handleDeleteIdea = async (ideaId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this idea? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error: deleteError } = await supabase.rpc("deleteidea", {
        ideaid: ideaId,
      });

      if (deleteError) {
        throw deleteError;
      }

      // Refetch ideas after successful deletion
      const userIdeas = await fetchUserIdeas(user);
      setIdeas(userIdeas);
    } catch (err: any) {
      console.error("Error deleting idea:", err);
      setError("Failed to delete idea. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="my-ideas-page">
            <h1>My Project Ideas</h1>
            <p>Loading your ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="my-ideas-page">
          <h1>My Project Ideas</h1>
          <p>Create, edit, and manage your project ideas here.</p>

          {error && <div className="error">{error}</div>}

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
                    <Link to={"manage-team/" + idea.id} className="manage-btn">
                      👥 Manage Team
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
