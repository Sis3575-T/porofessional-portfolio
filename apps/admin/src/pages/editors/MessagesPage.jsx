import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../services/api';
import { Mail, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    try { const res = await messagesAPI.getAll({ limit: 100 }); setMessages(res.data.data || []); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const toggleRead = async (msg) => {
    try { await messagesAPI.update(msg.id, { isRead: !msg.isRead }); toast.success(msg.isRead ? 'Marked unread' : 'Marked read'); fetch(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await messagesAPI.delete(id); toast.success('Deleted'); setSelected(null); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Messages ({messages.length})</h2>
        <button onClick={fetch} className="p-2 text-slate-500 hover:text-cyan-400 transition"><RefreshCw size={18} /></button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {messages.map(msg => (
            <div key={msg.id}
              onClick={() => setSelected(msg)}
              className={`cursor-pointer bg-slate-50 border rounded-xl p-4 transition hover:border-cyan-500/30 ${selected?.id === msg.id ? 'border-cyan-500/50' : 'border-slate-200'} ${!msg.isRead ? 'border-l-cyan-500 border-l-4' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-slate-900 text-sm">{msg.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${msg.isRead ? 'text-slate-400' : 'text-cyan-400 bg-cyan-500/10'}`}>
                  {msg.isRead ? 'Read' : 'New'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{msg.subject}</p>
              <p className="text-xs text-slate-400 truncate">{msg.message}</p>
              <p className="text-xs text-slate-600 mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-slate-400 text-center py-8">No messages yet</p>}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                  <p className="text-sm text-slate-500">{selected.email}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-slate-600 font-medium">Subject: {selected.subject}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => toggleRead(selected)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 hover:text-slate-900 transition">
                  {selected.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                  {selected.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Mail size={48} className="mb-4 text-slate-700" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
