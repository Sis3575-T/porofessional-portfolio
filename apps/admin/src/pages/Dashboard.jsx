import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, Code2, Briefcase, GraduationCap,
  FolderKanban, MessageSquare, Settings, LogOut, Menu, X,
  Star, Wrench, FileText, Image, Activity, Box, PanelLeftClose, PanelLeftOpen,
  BarChart3,
} from "lucide-react";
import { dashboardAPI, settingsAPI, aboutAPI } from "../services/api";

let _profileCache = null;
let _profilePromise = null;

const sidebarItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Hero", path: "/admin/hero", icon: FileText },
  { label: "About", path: "/admin/about", icon: User },
  { label: "Skills", path: "/admin/skills", icon: Code2 },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Services", path: "/admin/services", icon: Wrench },
  { label: "Experience", path: "/admin/experience", icon: Briefcase },
  { label: "Education", path: "/admin/education", icon: GraduationCap },
  { label: "Testimonials", path: "/admin/testimonials", icon: Star },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Media", path: "/admin/media", icon: Image },
  { label: "3D Avatar", path: "/admin/avatar", icon: Box },
  { label: "Activity", path: "/admin/activity", icon: Activity },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Dashboard({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(_profileCache || { name: "", email: "", initials: "??" });

  const fetchProfile = useCallback(async () => {
    if (_profilePromise) return _profilePromise;
    _profilePromise = (async () => {
      try {
        const [settingsRes, aboutRes] = await Promise.allSettled([
          settingsAPI.get(),
          aboutAPI.get(),
        ]);
        const settings = settingsRes.status === "fulfilled" ? settingsRes.value.data.data : null;
        const about = aboutRes.status === "fulfilled" ? aboutRes.value.data.data : null;
        const name = about?.name || settings?.siteTitle || "";
        const email = about?.email || settings?.contactEmail || "";
        const parts = name.trim().split(/\s+/);
        const initials = parts.length >= 2
          ? (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
          : parts[0]?.charAt(0)?.toUpperCase() || "??";
        _profileCache = { name, email, initials };
        setProfile(_profileCache);
      } catch {}
      _profilePromise = null;
    })();
    return _profilePromise;
  }, []);

  useEffect(() => {
    fetchProfile();
    const handler = () => { _profileCache = null; fetchProfile(); };
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, [fetchProfile]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardAPI.get();
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    if (location.pathname === "/admin") fetchStats();
    else setLoading(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div className={`fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-700 transform transition-all duration-300 lg:static lg:inset-auto ${
        sidebarCollapsed ? "w-[68px]" : "w-64"
      } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b border-slate-700 flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-cyan-400">Portfolio Pro</h1>
                <p className="text-xs text-slate-400 mt-0.5">Admin Dashboard</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full sidebar-link ${isActive ? "active" : ""} ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div className={`p-3 border-t border-slate-700 space-y-2 ${sidebarCollapsed ? "px-2" : ""}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {profile.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{profile.name || profile.email || "Admin"}</p>
                  <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  {profile.initials}
                </div>
              </div>
            )}
            <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition ${sidebarCollapsed ? "justify-center" : ""}`}>
              <LogOut size={16} /> {!sidebarCollapsed && "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-900">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {location.pathname === "/admin" ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h2>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
                      <div className="h-8 bg-slate-100 rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Projects", value: stats.projects },
                      { label: "Skills", value: stats.skills },
                      { label: "Messages", value: stats.messages },
                      { label: "Total Views", value: stats.visitors?.toLocaleString() },
                    ].map((stat) => (
                      <div key={stat.label} className="card">
                        <p className="text-slate-500 text-sm mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="font-semibold text-slate-900 mb-4">Recent Messages</h3>
                      {stats.recentMessages?.length > 0 ? (
                        <div className="space-y-3">
                          {stats.recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="text-sm text-slate-900">{msg.name}</p>
                                <p className="text-xs text-slate-400">{msg.subject}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${msg.isRead ? "bg-slate-100 text-slate-500" : "bg-cyan-50 text-cyan-600"}`}>
                                {msg.isRead ? "Read" : "New"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No messages yet</p>
                      )}
                    </div>

                    <div className="card">
                      <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {sidebarItems.slice(1).map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                            >
                              <Icon size={16} className="text-cyan-600" />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">Failed to load dashboard data</p>
              )}
            </>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
