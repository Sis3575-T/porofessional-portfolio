import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/editors/HeroEditor';
import AboutEditor from './pages/editors/AboutEditor';
import SkillsEditor from './pages/editors/SkillsEditor';
import ProjectsEditor from './pages/editors/ProjectsEditor';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/admin" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/admin"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/hero"
            element={isAuthenticated ? <HeroEditor /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/about"
            element={isAuthenticated ? <AboutEditor /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/skills"
            element={isAuthenticated ? <SkillsEditor /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/projects"
            element={isAuthenticated ? <ProjectsEditor /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}
