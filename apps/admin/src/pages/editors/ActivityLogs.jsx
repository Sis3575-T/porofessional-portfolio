import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Activity, RefreshCw } from "lucide-react";

const actionColors = {
  CREATE: "text-green-400 bg-green-500/10",
  UPDATE: "text-blue-400 bg-blue-500/10",
  DELETE: "text-red-400 bg-red-500/10",
  LOGIN: "text-cyan-400 bg-cyan-500/10",
  LOGOUT: "text-slate-400 bg-slate-500/10",
};

export default function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities");
      setActivities(res.data.data || []);
    } catch {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
        <button onClick={fetch} className="p-2 text-slate-400 hover:text-cyan-400 transition">
          <RefreshCw size={18} />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-16">
          <Activity size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-500">No activity recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${actionColors[a.action] || "text-slate-400 bg-slate-800"}`}>
                {a.action}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  {a.action === "LOGIN" ? "User logged in" :
                   a.action === "LOGOUT" ? "User logged out" :
                   `${a.action}d ${a.entity?.toLowerCase()}`}
                </p>
                {a.user?.email && (
                  <p className="text-xs text-slate-500">{a.user.email}</p>
                )}
              </div>
              <span className="text-xs text-slate-500 shrink-0">
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
