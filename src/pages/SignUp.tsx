import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SignUp.css";

function SignUp() {
  // State for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth(); // Get signUp function from context
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newUser = await signUp(email, password, firstName, lastName);
      console.log("New user created:", newUser);
      navigate("/dashboard"); // Redirect to home on successful signup
    } catch (err: any) {
      console.log("Error during sign up:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create Account</h1>
        <p className="signup-subtitle">
          Join CodeIdeas and start sharing your project ideas
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account? <a href="/login">Log In</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
