import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import { projectsAPI } from "../services/api";

const categoryLabels = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  MOBILE: "Mobile",
  UIUX: "UI/UX",
  AI: "AI",
  OTHER: "Other",
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await projectsAPI.getBySlug(slug);
        setProject(res.data.data);
      } catch (err) {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to="/" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Back Home
          </Link>
        </div>
      </div>
    );
  }

  const techs = project.technologies ? JSON.parse(project.technologies) : [];
  const features = project.features ? JSON.parse(project.features) : [];
  const images = project.images ? JSON.parse(project.images) : [];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition mb-8">
          <ArrowLeft size={18} /> Back to Portfolio
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="h-64 sm:h-80 bg-slate-800/50 flex items-center justify-center">
            {project.thumbnail ? (
              <img src={project.thumbnail} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">🚀</div>
                <p className="text-slate-500">{categoryLabels[project.category]}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                  {categoryLabels[project.category]}
                </span>
                {project.featured && (
                  <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{project.title}</h1>
            </div>
            <div className="flex gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold text-sm transition flex items-center gap-2">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg font-semibold text-sm hover:border-cyan-500 hover:text-cyan-400 transition flex items-center gap-2">
                  <Github size={16} /> Source Code
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(project.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Eye size={16} /> {project.viewCount || 0} views</span>
          </div>

          <p className="text-lg text-slate-300 leading-relaxed">{project.description}</p>

          {techs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {techs.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Challenge</h2>
              <p className="text-slate-400 leading-relaxed">{project.challenge}</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Solution</h2>
              <p className="text-slate-400 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.lessonsLearned && (
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Lessons Learned</h2>
              <p className="text-slate-400 leading-relaxed">{project.lessonsLearned}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
