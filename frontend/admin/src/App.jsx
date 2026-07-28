import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import api from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const HeroEditor = lazy(() => import('./pages/editors/HeroEditor'));
const AboutEditor = lazy(() => import('./pages/editors/AboutEditor'));
const SkillsEditor = lazy(() => import('./pages/editors/SkillsEditor'));
const ServicesEditor = lazy(() => import('./pages/editors/ServicesEditor'));
const ExperienceEditor = lazy(() => import('./pages/editors/ExperienceEditor'));
const EducationEditor = lazy(() => import('./pages/editors/EducationEditor'));
const ProjectsEditor = lazy(() => import('./pages/editors/ProjectsEditor'));
const TestimonialsEditor = lazy(() => import('./pages/editors/TestimonialsEditor'));
const MessagesPage = lazy(() => import('./pages/editors/MessagesPage'));
const SettingsEditor = lazy(() => import('./pages/editors/SettingsEditor'));
const AvatarEditor = lazy(() => import('./pages/editors/AvatarEditor'));
const MediaManager = lazy(() => import('./pages/editors/MediaManager'));
const ActivityLogs = lazy(() => import('./pages/editors/ActivityLogs'));
const AnalyticsDashboard = lazy(() => import('./pages/editors/AnalyticsDashboard'));
const VisitorProfile = lazy(() => import('./pages/editors/VisitorProfile'));

const EditorLoader = () => (
  <div className="flex items-center justify-center p-12">
    <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
  </div>
);

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        if (res.data?.data?.role !== 'ADMIN') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
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
        <Route path="/" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/admin" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/hero" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><HeroEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/about" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><AboutEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/skills" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><SkillsEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/services" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><ServicesEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/experience" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><ExperienceEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/education" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><EducationEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><ProjectsEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/testimonials" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><TestimonialsEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><MessagesPage /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><SettingsEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/avatar" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><AvatarEditor /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/media" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><MediaManager /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/activity" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><ActivityLogs /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><AnalyticsDashboard /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="/admin/analytics/:visitorId" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>{wrap(<Suspense fallback={<EditorLoader />}><VisitorProfile /></Suspense>)}</ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
