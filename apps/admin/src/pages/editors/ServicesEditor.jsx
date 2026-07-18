import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../services/api';
import { Plus, Save, Loader2, Trash2, Pencil } from 'lucide-react';

export default function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '', features: '' });

  const fetch = async () => {
    try { const res = await servicesAPI.getAll(); setServices(res.data.data); }
    catch { toast.error('Failed to load services'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, features: JSON.stringify(form.features.split('\n').filter(f => f.trim())) };
      if (editing) { await servicesAPI.update(editing, data); toast.success('Service updated'); }
      else { await servicesAPI.create(data); toast.success('Service created'); }
      setShowForm(false); setEditing(null); setForm({ title: '', description: '', icon: '', features: '' }); fetch();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (s) => {
    const features = s.features ? JSON.parse(s.features).join('\n') : '';
    setForm({ title: s.title, description: s.description, icon: s.icon || '', features });
    setEditing(s.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await servicesAPI.delete(id); toast.success('Service deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', icon: '', features: '' }); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Service</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit Service' : 'New Service'}</h3>
          <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full" placeholder="Service title" required />
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full" placeholder="Description" />
          <input value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="w-full" placeholder="Icon URL" />
          <div>
            <label className="block text-sm text-slate-400 mb-1">Features (one per line)</label>
            <textarea value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} rows={4} className="w-full" placeholder="Feature 1\nFeature 2\nFeature 3" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> {editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 group">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-white">{s.title}</h4>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(s)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2">{s.description}</p>
          </div>
        ))}
      </div>
      {services.length === 0 && <p className="text-slate-500">No services added yet</p>}
    </div>
  );
}
