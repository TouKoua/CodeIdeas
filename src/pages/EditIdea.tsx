import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addTag, removeTag, handleTagKeyPress } from "../utils/formHelpers.ts";
import supabase from "../services/supabaseClient.ts";
import "./EditIdea.css";

function EditIdea() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [difficulty_level, setDifficulty] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [durationValue, setDurationValue] = useState<number | "">("");
  const [durationUnit, setDurationUnit] = useState("days");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null); // State to hold the fetched project data
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("ideas")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          throw error;
        }
        if (data) {
          // Update the state with the fetched project data
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setTechStack(data.technologies || []);
          setDifficulty(data.difficulty);
          setGithubLink(data.github_link);
          const [value, unit] = data.duration?.split(" ") || ["", "days"];
          setDurationValue(value ? parseInt(value) : "");
          setDurationUnit(unit || "days");
          setProject(data); // Set the fetched project data
        } else {
          throw new Error("Project not found");
        }
      } catch (err) {
        navigate("/dashboard");
      }
    };
    fetchProject();
  }, [id]);

  if (project && project.creator_id !== user?.id) {
    return (
      <div className="error-message">
        <h1>You do not have permission to edit this idea.</h1>
        <p>Please contact the owner of this idea for more information.</p>
        <button onClick={() => navigate("/dashboard")}>
          Go Back to Dashboard
        </button>
      </div>
    );
  }
  const addTechStack = () => {
    addTag(techInput, techStack, setTechStack, setTechInput);
  };

  const removeTechStack = (tech: string) => {
    removeTag(tech, techStack, setTechStack);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagKeyPress(e, techInput, techStack, setTechStack, setTechInput);
    }
  };

  {
    /* Handle Submission of form */
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const duration = durationValue
        ? `${durationValue} ${durationUnit}`
        : null;
      const { error } = await supabase
        .from("ideas")
        .update({
          title,
          description,
          category,
          technologies: techStack,
          difficulty: difficulty_level,
          github_link: githubLink,
          duration,
        })
        .eq("id", project.id);
      if (error) {
        throw "Idea Update Failure: " + error.message;
      }

      navigate(`/project/${project.id}`); // Redirect to the updated idea's page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-idea-page">
      <div className="edit-idea-container">
        <h1>Edit Idea</h1>
        <p>Update your project idea details</p>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
            disabled={loading}
            required
          />
          {/* Description Field */}
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the description"
            disabled={loading}
            required
          />
          {/* Category Field */}
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile">Mobile</option>
            <option value="Desktop Application">Desktop Application</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Game Development">Game Development</option>
            <option value="Other">Other</option>
          </select>
          {/* Tech Stack Field */}
          <label htmlFor="techStack">Tech Stack</label>
          {/* Tags/Pills code */}
          <div className="tech-stack-container">
            <div className="tech-input-wrapper">
              <input
                id="techStack"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter tech (e.g., React, Node.js) and press Enter"
                disabled={loading}
              />
              <button type="button" onClick={addTechStack} disabled={loading}>
                Add
              </button>
            </div>
            <div className="tech-stack-tags">
              {techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechStack(tech)}
                    disabled={loading}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Difficulty Field */}
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty_level}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          {/* GitHub Link Field */}
          <label htmlFor="githubLink">GitHub Link</label>
          <input
            id="githubLink"
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="Enter the GitHub link"
            disabled={loading}
          />
          {/* Duration Field */}
          <label htmlFor="durationValue">Project Duration</label>
          <div className="duration-input-wrapper">
            <input
              id="durationValue"
              type="number"
              value={durationValue}
              onChange={(e) =>
                setDurationValue(e.target.value ? parseInt(e.target.value) : "")
              }
              placeholder="Enter duration"
              disabled={loading}
              min="1"
            />
            <select
              id="durationUnit"
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value)}
              disabled={loading}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Idea"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default EditIdea;
