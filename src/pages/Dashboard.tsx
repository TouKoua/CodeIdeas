import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.email}</h1>
          <p>Manage your ideas and collaborations</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>My Ideas</h2>
            <p>View and manage all the project ideas you've created.</p>
            <a href="/my-ideas" className="dashboard-card-action">
              View Ideas
            </a>
          </div>

          <div className="dashboard-card">
            <h2>Collaborations</h2>
            <p>See all the projects you're currently collaborating on.</p>
            <a href="/joinRequests" className="dashboard-card-action">
              View Collaborations
            </a>
          </div>

          <div className="dashboard-card">
            <h2>Create New Idea</h2>
            <p>Share your next great project idea with the community.</p>
            <a href="/create-idea" className="dashboard-card-action">
              Create Idea
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
