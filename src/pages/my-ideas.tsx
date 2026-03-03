import { useAuth } from "../context/AuthContext.tsx";
//import { useNavigate } from "react-router-dom";
import { fetchUserIdeas } from "../context/ProjectGetter.tsx";
import { useState, useEffect } from "react";
import "./myIdeas.css";
import type { Idea } from "../types/index.ts";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";

function MyIdeas() {
  const { user, userProfile } = useAuth();
  //const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[] | null>(null);

  useEffect(() => {
    // Fetch user's ideas from Supabase
    const fetchIdeas = async () => {
      const userIdeas = await fetchUserIdeas(user);
      setIdeas(userIdeas);
    };
    fetchIdeas();
  }, [user]);

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
