import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateIdea.css";

function CreateIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter the description"
        disabled={loading}
        required
      />
      <label htmlFor="category">Category</label>
      <select
        id="category"
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
      <label htmlFor="techStack">Tech Stack</label>
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Idea"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}

export default CreateIdea;
