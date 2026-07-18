import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { educationAPI } from '../../services/api';
import { Plus, Save, Trash2, Pencil } from 'lucide-react';

export default function EducationEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    institution: '', degree: '', field: '', description: '',
    startDate: '', endDate: '', gpa: '',
  });

  const fetch = async () => {
    try { const res = await educationAPI.getAll(); setItems(res.data.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await educationAPI.update(editing, form); toast.success('Updated'); }
      else { await educationAPI.create(form); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm({ institution: '', degree: '', field: '', description: '', startDate: '', endDate: '', gpa: '' }); fetch();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    setForm({
      institution: item.institution, degree: item.degree, field: item.field || '',
      description: item.description || '', startDate: item.startDate?.split('T')[0] || '',
      endDate: item.endDate?.split('T')[0] || '', gpa: item.gpa || '',
    });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await educationAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Education</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Education</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit' : 'New'} Education</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} className="w-full" placeholder="Institution" required />
            <input value={form.degree} onChange={(e) => setForm({...form, degree: e.target.value})} className="w-full" placeholder="Degree" required />
          </div>
          <input value={form.field} onChange={(e) => setForm({...form, field: e.target.value})} className="w-full" placeholder="Field of study" />
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full" placeholder="Description" />
          <div className="grid sm:grid-cols-3 gap-4">
            <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full" required />
            <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full" required />
            <input value={form.gpa} onChange={(e) => setForm({...form, gpa: e.target.value})} className="w-full" placeholder="GPA (optional)" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> {editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-white">{item.degree}</h4>
                <p className="text-sm text-purple-400">{item.institution}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-slate-500">No education added yet</p>}
    </div>
  );
}
