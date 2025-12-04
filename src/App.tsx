import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import About from "./pages/About";
import Browse from "./pages/Browse";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </Router>
  );
}

export default App;
