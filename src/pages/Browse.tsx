import { Link } from "react-router-dom";

function Browse() {
  return (
    <div className="browse-page">
      <div className="browse-intro">
        <div className="browse-design">
          <h1>Explore Project Ideas</h1>
          <Link to="/signup" className="btn btn-primary">
            <h2>Refresh</h2>
          </Link>
        </div>
        <p>
          Browse through hundreds of project ideas from the community. Find
          inspiration, learn new skills, and build your portfolio with projects
          that match your interests and skill level.
        </p>
      </div>
    </div>
  );
}

export default Browse;
