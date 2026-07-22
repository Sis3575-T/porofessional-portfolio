import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/editors/HeroEditor';
import AboutEditor from './pages/editors/AboutEditor';
import SkillsEditor from './pages/editors/SkillsEditor';
import ServicesEditor from './pages/editors/ServicesEditor';
import ExperienceEditor from './pages/editors/ExperienceEditor';
import EducationEditor from './pages/editors/EducationEditor';
import ProjectsEditor from './pages/editors/ProjectsEditor';
import TestimonialsEditor from './pages/editors/TestimonialsEditor';
import MessagesPage from './pages/editors/MessagesPage';
import SettingsEditor from './pages/editors/SettingsEditor';
import AvatarEditor from './pages/editors/AvatarEditor';
import MediaManager from './pages/editors/MediaManager';
import ActivityLogs from './pages/editors/ActivityLogs';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const wrap = (element) => <Dashboard>{element}</Dashboard>;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' },
      }} />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/admin" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/hero" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<HeroEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/about" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<AboutEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/skills" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<SkillsEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<ServicesEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/experience" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<ExperienceEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/education" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<EducationEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<ProjectsEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/testimonials" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<TestimonialsEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<MessagesPage />)}</ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<SettingsEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/avatar" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<AvatarEditor />)}</ProtectedRoute>
        } />
        <Route path="/admin/media" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<MediaManager />)}</ProtectedRoute>
        } />
        <Route path="/admin/activity" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<ActivityLogs />)}</ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
