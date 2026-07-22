import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { experienceAPI } from '../../services/api';
import { Plus, Save, Loader2, Trash2, Pencil, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

export default function ExperienceEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    company: '', position: '', description: '', startDate: '', endDate: '',
    isCurrent: false, technologies: '', logo: '',
  });
  const [pickerField, setPickerField] = useState(null);

  const fetch = async () => {
    try { const res = await experienceAPI.getAll(); setItems(res.data.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, technologies: JSON.stringify(form.technologies.split(',').map(t => t.trim()).filter(Boolean)) };
      if (editing) { await experienceAPI.update(editing, data); toast.success('Updated'); }
      else { await experienceAPI.create(data); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm({ company: '', position: '', description: '', startDate: '', endDate: '', isCurrent: false, technologies: '', logo: '' }); fetch();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    const techs = item.technologies ? JSON.parse(item.technologies).join(', ') : '';
    setForm({
      company: item.company, position: item.position, description: item.description,
      startDate: item.startDate?.split('T')[0] || '', endDate: item.endDate?.split('T')[0] || '',
      isCurrent: item.isCurrent, technologies: techs, logo: item.logo || '',
    });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await experienceAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Experience</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit' : 'New'} Experience</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full" placeholder="Company" required />
            <input value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full" placeholder="Position" required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full" placeholder="Description" />
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full" disabled={form.isCurrent} />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm({...form, isCurrent: e.target.checked})} className="w-4 h-4" />
                Current Position
              </label>
            </div>
          </div>
          <input value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})} className="w-full" placeholder="Technologies (comma separated)" />
          <div>
            <label className="block text-sm text-slate-400 mb-1">Company Logo</label>
            <div className="flex gap-2">
              <input value={form.logo} onChange={(e) => setForm({...form, logo: e.target.value})} className="w-full" placeholder="https://..." />
              <button type="button" onClick={() => setPickerField('logo')} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition shrink-0">
                <ImageIcon size={16} />
              </button>
            </div>
            {form.logo && (
              <div className="mt-2 w-20 h-14 rounded-lg overflow-hidden border border-slate-700">
                <img src={form.logo} alt="" className="w-full h-full object-contain" />
              </div>
            )}
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
                <h4 className="font-medium text-white">{item.position}</h4>
                <p className="text-sm text-cyan-400">{item.company}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-slate-500">No experience added yet</p>}

      <ImagePicker
        open={!!pickerField}
        onSelect={(url) => { setForm({...form, [pickerField]: url}); setPickerField(null); }}
        onClose={() => setPickerField(null)}
      />
    </div>
  );
}
