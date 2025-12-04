import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Turn Your Coding Ideas Into Reality</h1>
          <p className="hero-subtitle">
            Share your innovative project ideas, find passionate collaborators,
            and build amazing things together.
          </p>
          <div className="hero-cta">
            <Link to="/browse" className="btn btn-primary">
              Browse Ideas
            </Link>
            <button className="btn btn-secondary">Share Your Idea</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose CodeIdeas?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Share Your Ideas</h3>
            <p>
              Post your coding project ideas and describe your vision to inspire
              others to join your mission.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Find Collaborators</h3>
            <p>
              Connect with developers, designers, and innovators who share your
              passion and skills.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Build Together</h3>
            <p>
              Collaborate with your team, share code, discuss progress, and
              bring your ideas to life.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Community</h3>
            <p>
              Be part of a thriving community of developers working on exciting
              projects from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Next Project?</h2>
          <p>
            Join thousands of developers collaborating on innovative coding
            ideas.
          </p>
          <button className="btn btn-primary btn-large">Get Started Now</button>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
