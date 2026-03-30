import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import About from "./pages/About";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateIdea from "./pages/CreateIdea";
import ProfilePage from "./pages/ProfilePage";
import Search from "./pages/Search";
import EditProfile from "./pages/EditProfile";
import Project from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import MyIdeas from "./pages/my-ideas";
import JoinRequests from "./pages/joinRequests";
import EditIdea from "./pages/EditIdea";
import ManageTeams from "./pages/manageTeams";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-idea"
          element={
            <ProtectedRoute>
              <CreateIdea />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:user_id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-ideas"
          element={
            <ProtectedRoute>
              <MyIdeas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joinRequests"
          element={
            <ProtectedRoute>
              <JoinRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-idea/:id"
          element={
            <ProtectedRoute>
              <EditIdea />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-team/:ideaid"
          element={
            <ProtectedRoute>
              <ManageTeams />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
