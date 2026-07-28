import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { messagesAPI } from '../../services/api';
import {
  Mail, Trash2, Eye, EyeOff, RefreshCw, Send, Reply, CheckCircle,
  Search, Archive, ArchiveRestore, ChevronLeft, ChevronRight,
  Clock, X, User, MessageSquare,
} from 'lucide-react';

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "UNREAD", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [unreadCount, setUnreadCount] = useState(0);
  const searchTimeout = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = useCallback(async (pageNum = page, filter = statusFilter, searchTerm = search) => {
    try {
      const params = { page: pageNum, limit: 20 };
      if (filter !== 'all') params.status = filter;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const res = await messagesAPI.getAll(params);
      setMessages(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 });
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await messagesAPI.unreadCount();
      setUnreadCount(res.data.data?.count || 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchMessages(1);
    fetchUnreadCount();
    pollRef.current = setInterval(() => { fetchMessages(); fetchUnreadCount(); }, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setPage(1); fetchMessages(1, statusFilter, search); }, 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search]);

  useEffect(() => { setPage(1); fetchMessages(1, statusFilter, search); }, [statusFilter]);

  const handleSelect = async (msg) => {
    try {
      const res = await messagesAPI.getById(msg.id);
      setSelected(res.data.data);
      if (!msg.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
      }
    } catch {
      toast.error('Failed to load message');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error('Type a reply first');
    setSending(true);
    try {
      const res = await messagesAPI.reply(selected.id, replyText.trim());
      toast.success(res.data.message);
      setReplyText('');
      setSelected({ ...selected, reply: replyText.trim(), repliedAt: new Date().toISOString() });
      fetchMessages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const toggleRead = async (msg) => {
    try {
      await messagesAPI.markRead(msg.id);
      toast.success(msg.isRead ? 'Marked unread' : 'Marked read');
      fetchMessages();
      fetchUnreadCount();
    } catch { toast.error('Failed to update'); }
  };

  const handleArchive = async (msg) => {
    try {
      await messagesAPI.archive(msg.id);
      toast.success(msg.isArchived ? 'Restored' : 'Archived');
      setSelected(null);
      fetchMessages();
      fetchUnreadCount();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await messagesAPI.delete(id);
      toast.success('Deleted');
      setSelected(null);
      fetchMessages();
      fetchUnreadCount();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-100 rounded w-48 animate-pulse" />
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  const getStatus = (msg) => {
    if (msg.repliedAt) return { label: 'Replied', color: 'bg-green-50 text-green-700 border-green-200' };
    if (msg.isRead) return { label: 'Read', color: 'bg-slate-50 text-slate-500 border-slate-200' };
    return { label: 'New', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{unreadCount} new</span>
          )}
        </div>
        <button onClick={() => { fetchMessages(); fetchUnreadCount(); }} className="p-2 text-slate-500 hover:text-cyan-400 transition">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${statusFilter === f.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message list */}
        <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
          {messages.map((msg) => {
            const status = getStatus(msg);
            return (
              <div key={msg.id} onClick={() => handleSelect(msg)}
                className={`cursor-pointer bg-white border rounded-xl p-4 transition hover:border-cyan-500/30 ${selected?.id === msg.id ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-slate-200'} ${!msg.isRead && !msg.isArchived ? 'border-l-4 border-l-cyan-500' : ''}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={14} /></div>
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm">{msg.fullName || 'Anonymous'}</h4>
                      <p className="text-xs text-slate-400">{msg.email || 'No email'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${status.color}`}>{status.label}</span>
                </div>
                {msg.subject && <p className="text-xs text-slate-500 ml-10">{msg.subject}</p>}
                <p className="text-xs text-slate-400 truncate ml-10">{msg.message}</p>
                <div className="flex items-center gap-2 mt-2 ml-10 text-xs text-slate-400">
                  <Clock size={10} />
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  {msg.repliedAt && <span className="text-green-600">✓ Replied</span>}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare size={40} className="mx-auto mb-3 text-slate-700" />
              <p>No messages</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selected.fullName || 'Anonymous'}</h3>
                  <p className="text-sm text-slate-500">{selected.email || 'No email provided'}</p>
                  {selected.phone && <p className="text-sm text-slate-400">{selected.phone}</p>}
                </div>
                <span className="text-xs text-slate-400">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>

              {selected.subject && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900">{selected.subject}</p>
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>

              {selected.reply && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply size={14} className="text-green-600" />
                    <p className="text-xs font-medium text-green-700">
                      Your reply {selected.repliedAt && `· ${new Date(selected.repliedAt).toLocaleString()}`}
                    </p>
                  </div>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{selected.reply}</p>
                </div>
              )}

              {!selected.reply && (
                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Reply size={14} className="inline mr-1" />
                    Reply to {selected.fullName || 'visitor'}
                  </label>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                    placeholder={selected.email ? `Reply will be emailed to ${selected.email}` : 'Visitor provided no email — reply saved here only'} />
                  {selected.email && <p className="text-xs text-slate-400 mt-1">Reply will be emailed to: {selected.email}</p>}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!selected.reply && (
                  <button onClick={handleReply} disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                    {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    {sending ? 'Sending...' : 'Send Reply'}
                  </button>
                )}
                <button onClick={() => toggleRead(selected)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600 hover:text-slate-900 transition">
                  {selected.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                  {selected.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button onClick={() => handleArchive(selected)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600 hover:text-slate-900 transition">
                  {selected.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                  {selected.isArchived ? 'Restore' : 'Archive'}
                </button>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition">
                  <Trash2 size={14} /> Delete
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

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchMessages(Math.max(1, page - 1), statusFilter, search); }} disabled={page <= 1} className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const p = Math.max(1, page - 2) + i;
              if (p > pagination.totalPages) return null;
              return <button key={p} onClick={() => { setPage(p); fetchMessages(p, statusFilter, search); }} className={`w-8 h-8 text-xs rounded-lg transition ${page === p ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>;
            })}
            <button onClick={() => { setPage(p => Math.min(pagination.totalPages, p + 1)); fetchMessages(Math.min(pagination.totalPages, page + 1), statusFilter, search); }} disabled={page >= pagination.totalPages} className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
