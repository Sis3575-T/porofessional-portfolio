import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsAPI } from "../../services/api";
import {
  Users, UserCheck, Eye, Globe, Clock, TrendingUp,
  Monitor, Smartphone, Tablet, Chrome, ArrowRight,
  Download, Mail, ChevronRight, RefreshCw,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color = "cyan" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-50`}>
          <Icon size={18} className={`text-${color}-600`} />
        </div>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function BarItem({ label, count, max }) {
  const width = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-slate-600 w-32 truncate shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
        <div className="h-full bg-cyan-500 rounded-md transition-all" style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm font-medium text-slate-700 w-10 text-right">{count}</span>
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, visitorsRes] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getVisitors({ page, limit: 10, search }),
      ]);
      setStats(statsRes.data.data);
      setVisitors(visitorsRes.data.data);
      setPagination(visitorsRes.data.pagination);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [page, search]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Unique Visitors" value={stats.totalVisitors} />
            <StatCard icon={UserCheck} label="Returning Visitors" value={stats.returningVisitors} />
            <StatCard icon={Eye} label="Total Visits" value={stats.totalVisits} />
            <StatCard icon={Globe} label="Online Now" value={stats.onlineNow} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Clock} label="Avg. Duration" value={formatDuration(stats.avgDuration)} />
            <StatCard icon={Download} label="Resume Downloads" value={stats.totalResumeDownloads} />
            <StatCard icon={Mail} label="Contact Submissions" value={stats.totalContactSubmissions} />
            <StatCard icon={TrendingUp} label="New Visitors" value={stats.newVisitors} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Top Countries</h3>
              {stats.topCountries?.length > 0 ? (
                stats.topCountries.map((c) => (
                  <BarItem key={c.name} label={c.name || "Unknown"} count={c.count} max={stats.topCountries[0]?.count} />
                ))
              ) : <p className="text-sm text-slate-400">No data yet</p>}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Top Cities</h3>
              {stats.topCities?.length > 0 ? (
                stats.topCities.map((c) => (
                  <BarItem key={c.name} label={c.name || "Unknown"} count={c.count} max={stats.topCities[0]?.count} />
                ))
              ) : <p className="text-sm text-slate-400">No data yet</p>}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Most Viewed Pages</h3>
              {stats.topPages?.length > 0 ? (
                stats.topPages.map((p) => (
                  <BarItem key={p.name} label={p.name} count={p.count} max={stats.topPages[0]?.count} />
                ))
              ) : <p className="text-sm text-slate-400">No data yet</p>}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Popular Projects</h3>
              {stats.topProjects?.length > 0 ? (
                stats.topProjects.map((p) => (
                  <BarItem key={p.name} label={p.name} count={p.count} max={stats.topProjects[0]?.count} />
                ))
              ) : <p className="text-sm text-slate-400">No data yet</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Browsers</h3>
              {stats.browsers?.map((b) => (
                <BarItem key={b.name} label={b.name} count={b.count} max={stats.browsers[0]?.count} />
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Operating Systems</h3>
              {stats.osList?.map((o) => (
                <BarItem key={o.name} label={o.name} count={o.count} max={stats.osList[0]?.count} />
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Devices</h3>
              {stats.devices?.map((d) => (
                <BarItem key={d.name} label={d.name} count={d.count} max={stats.devices[0]?.count} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Visitors</h3>
          <input
            type="text"
            placeholder="Search visitors..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Visitor ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Browser</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Device</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Visits</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Last Visit</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => navigate(`/admin/analytics/${v.visitorId}`)}>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-700">{v.visitorId.slice(0, 12)}...</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {[v.city, v.country].filter(Boolean).join(", ") || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.browser || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                      {v.deviceType === "mobile" ? <Smartphone size={12} /> : v.deviceType === "tablet" ? <Tablet size={12} /> : <Monitor size={12} />}
                      {v.deviceType || "desktop"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{v.totalVisits}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(v.lastVisitAt)}</td>
                  <td className="px-6 py-4">
                    <ChevronRight size={16} className="text-slate-400" />
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No visitors tracked yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} visitors)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
