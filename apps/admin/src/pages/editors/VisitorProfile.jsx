import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { analyticsAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  ArrowLeft, Globe, MapPin, Monitor, Smartphone, Tablet,
  Clock, Calendar, Eye, Download, Mail, Trash2, Languages,
  RefreshCw,
} from "lucide-react";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={16} className="text-slate-400 shrink-0" />
      <span className="text-sm text-slate-500 w-32 shrink-0">{label}</span>
      <span className="text-sm text-slate-900 font-medium">{value || "Unknown"}</span>
    </div>
  );
}

function parseJSON(str, fallback) {
  try { return typeof str === "string" ? JSON.parse(str) : (str || fallback); }
  catch { return fallback; }
}

function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const actionLabels = {
  contact_submit: "Submitted Contact Form",
  resume_download: "Downloaded Resume",
  project_view: "Viewed Project",
};

export default function VisitorProfile() {
  const { visitorId } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVisitor = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getVisitor(visitorId);
      setVisitor(res.data.data);
    } catch (err) {
      toast.error("Failed to load visitor");
      navigate("/admin/analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisitor(); }, [visitorId]);

  const handleDelete = async () => {
    if (!confirm("Delete this visitor?")) return;
    try {
      await analyticsAPI.deleteVisitor(visitorId);
      toast.success("Visitor deleted");
      navigate("/admin/analytics");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!visitor) return null;

  const pages = parseJSON(visitor.pagesVisited, []);
  const projects = parseJSON(visitor.projectsViewed, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/analytics")} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Visitor Profile</h2>
            <p className="text-sm text-slate-500 font-mono">{visitor.visitorId}</p>
          </div>
        </div>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Visitor Info</h3>
          <div className="space-y-1">
            <InfoRow icon={Globe} label="Country" value={visitor.country} />
            <InfoRow icon={MapPin} label="City" value={visitor.city} />
            <InfoRow icon={Globe} label="Region" value={visitor.region} />
            <InfoRow icon={Languages} label="Language" value={visitor.language} />
            <InfoRow icon={Clock} label="Timezone" value={visitor.timezone} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Device</h3>
          <div className="space-y-1">
            <InfoRow icon={Monitor} label="Browser" value={visitor.browser} />
            <InfoRow icon={Smartphone} label="OS" value={visitor.os} />
            <InfoRow icon={Tablet} label="Device" value={visitor.deviceType} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Activity</h3>
          <div className="space-y-1">
            <InfoRow icon={Calendar} label="First Visit" value={formatDate(visitor.firstVisitAt)} />
            <InfoRow icon={Calendar} label="Last Visit" value={formatDate(visitor.lastVisitAt)} />
            <InfoRow icon={Eye} label="Total Visits" value={visitor.totalVisits} />
            <InfoRow icon={Clock} label="Avg. Duration" value={formatDuration(Math.round(visitor.totalTimeSpent / Math.max(visitor.totalVisits, 1)))} />
            <InfoRow icon={Clock} label="Total Time" value={formatDuration(visitor.totalTimeSpent)} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Pages Visited</h3>
          {pages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pages.map((p) => (
                <span key={p} className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">{p}</span>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400">No pages tracked</p>}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Projects Viewed</h3>
          {projects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <span key={p} className="px-3 py-1 text-xs bg-cyan-50 text-cyan-700 rounded-full">{p}</span>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400">No projects viewed</p>}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Interactions</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Skills Section</span>
              <span className={`text-sm font-medium ${visitor.skillsViewed ? "text-green-600" : "text-slate-400"}`}>
                {visitor.skillsViewed ? "Viewed" : "Not viewed"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Services Section</span>
              <span className={`text-sm font-medium ${visitor.servicesViewed ? "text-green-600" : "text-slate-400"}`}>
                {visitor.servicesViewed ? "Viewed" : "Not viewed"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Experience Section</span>
              <span className={`text-sm font-medium ${visitor.experienceViewed ? "text-green-600" : "text-slate-400"}`}>
                {visitor.experienceViewed ? "Viewed" : "Not viewed"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Education Section</span>
              <span className={`text-sm font-medium ${visitor.educationViewed ? "text-green-600" : "text-slate-400"}`}>
                {visitor.educationViewed ? "Viewed" : "Not viewed"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Contact Section</span>
              <span className={`text-sm font-medium ${visitor.contactViewed ? "text-green-600" : "text-slate-400"}`}>
                {visitor.contactViewed ? "Viewed" : "Not viewed"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Resume Downloads</span>
              <span className="text-sm font-medium text-slate-700">{visitor.resumeDownloads}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600">Contact Submissions</span>
              <span className="text-sm font-medium text-slate-700">{visitor.contactSubmissions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Visit Timeline</h3>
          {visitor.visits?.length > 0 ? (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {visitor.visits.map((visit) => {
                const vPages = parseJSON(visit.pagesViewed, []);
                const vActions = parseJSON(visit.actions, []);
                return (
                  <div key={visit.id} className="border-l-2 border-cyan-400 pl-4 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">Visit #{visit.visitNumber}</span>
                      <span className="text-xs text-slate-400">{formatDateTime(visit.startedAt)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Duration: {formatDuration(visit.duration)}</p>
                    {vPages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {vPages.map((p) => (
                          <span key={p} className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded">{p}</span>
                        ))}
                      </div>
                    )}
                    {vActions.length > 0 && (
                      <div className="space-y-1">
                        {vActions.map((a, i) => (
                          <p key={i} className="text-xs text-slate-500">
                            {actionLabels[a.event] || a.event} at {a.page}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-slate-400">No visit history</p>}
        </div>
      </div>
    </div>
  );
}
