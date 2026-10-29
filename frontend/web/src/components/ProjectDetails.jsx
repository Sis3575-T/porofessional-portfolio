import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Calendar, Eye, Layers } from "lucide-react";
import { projectsAPI } from "../services/api";
import { resolveUrl } from "../utils/resolveUrl";
import { useAnalytics } from "../hooks/useAnalytics";
import SEO from "./SEO";

const categoryLabels = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  MOBILE: "Mobile",
  UIUX: "UI/UX",
  AI: "AI & ML",
  OTHER: "Software Engineering",
};

function safeParse(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const { trackEvent } = useAnalytics();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await projectsAPI.getBySlug(slug);
        setProject(res.data.data);
        trackEvent("project_view", { projectSlug: slug });
      } catch {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug, trackEvent]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-sm text-[#475569] dark:text-[#94A3B8] animate-pulse">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] dark:bg-[#3B82F6]/15 text-[#2563EB] dark:text-[#3B82F6] mx-auto flex items-center justify-center mb-4 border border-[#E2E8F0] dark:border-[#1E293B]">
            <Layers size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">Project Not Found</h2>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mb-6">{error || "The requested project could not be located."}</p>
          <Link
            to="/projects"
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-semibold text-sm inline-flex items-center gap-2 shadow-soft-xs transition"
          >
            <ArrowLeft size={16} /> Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const techs = safeParse(project.technologies);
  const features = safeParse(project.features);

  return (
    <>
      <SEO title={`${project.title} | Projects`} description={project.shortDescription || project.description} />
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#3B82F6] transition mb-8"
          >
            <ArrowLeft size={15} /> Back to Projects
          </Link>

          {/* Thumbnail Banner */}
          <div className="bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl overflow-hidden mb-8 shadow-soft-sm">
            <div className="h-64 sm:h-80 md:h-96 bg-[#F8FAFC] dark:bg-[#0B0F17] flex items-center justify-center overflow-hidden">
              {project.thumbnail ? (
                <img
                  src={resolveUrl(project.thumbnail)}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-[#475569] dark:text-[#94A3B8]">
                  <Layers size={48} className="mx-auto mb-2 text-[#2563EB] opacity-80" />
                  <p className="text-xs uppercase tracking-wider font-semibold">
                    {categoryLabels[project.category] || "Project"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#111827] px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-[#1E293B]">
                    {categoryLabels[project.category] || "Full Stack"}
                  </span>
                  {project.featured && (
                    <span className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] bg-[#EFF6FF] dark:bg-[#3B82F6]/15 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-[#1E293B]">
                      Featured Work
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                  {project.title}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-soft-xs"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#161F30] text-[#1E293B] dark:text-[#F8FAFC] rounded-full font-semibold text-xs sm:text-sm hover:border-[#2563EB]/50 transition flex items-center gap-2 shadow-soft-xs"
                  >
                    <Github size={14} /> Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-xs text-[#475569] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#2563EB] dark:text-[#3B82F6]" /> {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-[#2563EB] dark:text-[#3B82F6]" /> {project.viewCount || 0} views
              </span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              {project.description || project.shortDescription}
            </p>

            {/* Technologies */}
            {techs.length > 0 && (
              <div className="pt-6 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-3">
                  Technologies &amp; Architecture
                </h2>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] rounded-xl text-xs sm:text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                {project.challenge && (
                  <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider mb-2">
                      Technical Challenge
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider mb-2">
                      Architectural Solution
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <div className="pt-6 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-3">
                  Key Features &amp; Functionality
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC]"
                    >
                      <span className="w-1.5 h-1.5 bg-[#2563EB] dark:bg-[#3B82F6] rounded-full mt-2 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
