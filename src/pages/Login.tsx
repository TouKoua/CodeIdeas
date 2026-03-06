import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUpWithGithub, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };*/

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signUpWithGithub();
      // Note: With OAuth, the user is redirected to GitHub and then back to your app.
      // The session is handled by Supabase, so we don't need to do anything else here.
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Stop loading if there's an error
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signUpWithGoogle();
      // Note: With OAuth, the user is redirected to Google and then back to your app.
      // The session is handled by Supabase, so we don't need to do anything else here.
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false); // Stop loading if there's an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to your CodeIdeas account</p>

        <button
          className="google-button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Sign In with Google"}
        </button>

        <div className="divider">OR</div>

        <button
          className="github-button"
          onClick={handleGithubSignIn}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Sign In with GitHub"}
        </button>

        <div className="login-footer">
          Forgot password? <a href="/reset-password">Reset it</a>
        </div>
        <div className="login-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Login;
