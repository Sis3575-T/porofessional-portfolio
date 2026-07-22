import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, Code2, Briefcase, GraduationCap,
  FolderKanban, MessageSquare, Settings, LogOut, Menu, X,
  Star, Wrench, FileText, Image, Activity, Box
} from "lucide-react";
import { dashboardAPI } from "../services/api";

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
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Dashboard({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-cyan-400">
              Portfolio Pro
            </h1>
            <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full sidebar-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role?.toLowerCase()}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-[60] bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {location.pathname === "/admin" ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h2>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-24 mb-4" />
                      <div className="h-8 bg-slate-800 rounded w-16" />
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
                        <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="font-semibold text-white mb-4">Recent Messages</h3>
                      {stats.recentMessages?.length > 0 ? (
                        <div className="space-y-3">
                          {stats.recentMessages.map((msg) => (
                            <div key={msg.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                              <div>
                                <p className="text-sm text-white">{msg.name}</p>
                                <p className="text-xs text-slate-500">{msg.subject}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${msg.isRead ? "bg-slate-700 text-slate-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                                {msg.isRead ? "Read" : "New"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No messages yet</p>
                      )}
                    </div>

                    <div className="card">
                      <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {sidebarItems.slice(1).map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                            >
                              <Icon size={16} className="text-cyan-400" />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">Failed to load dashboard data</p>
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
