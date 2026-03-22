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
    <div className="my-ideas-page">
      <h1>My Ideas</h1>
      <p>Welcome, {userProfile?.first_name}! Here are your submitted ideas.</p>
      {ideas && ideas.length > 0 ? (
        <div className="ProjectCard-container">
          {ideas.map((idea) => (
            <div key={idea.id} className="ProjectCard">
              <Link to={`/project/${idea.id}`} className="project-link">
                <ProjectCard project={idea} />
              </Link>
              <button onClick={() => handleDeleteIdea(idea.id)}>Delete</button>
              <Link to={`/edit-idea/${idea.id}`}>
                <button>Edit</button>
              </Link>
              <Link to={`/manageTeams/${idea.id}`}>
                <button>Manage Team</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No ideas found.</p>
      )}
    </div>
  );
}

export default MyIdeas;
