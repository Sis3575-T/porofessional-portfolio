import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '../../services/api';
import { Plus, Save, Trash2, Pencil, Star, Image as ImageIcon } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

export default function TestimonialsEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', position: '', company: '', avatar: '', rating: 5, review: '' });
  const [pickerField, setPickerField] = useState(null);

  const fetch = async () => {
    try { const res = await testimonialsAPI.getAll(); setItems(res.data.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await testimonialsAPI.update(editing, form); toast.success('Updated'); }
      else { await testimonialsAPI.create(form); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm({ name: '', position: '', company: '', avatar: '', rating: 5, review: '' }); fetch();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, position: item.position, company: item.company, avatar: item.avatar || '', rating: item.rating, review: item.review });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await testimonialsAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Testimonial</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <h3 className="font-semibold text-slate-900">{editing ? 'Edit' : 'New'} Testimonial</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full" placeholder="Name" required />
            <input value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full" placeholder="Position" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full" placeholder="Company" />
            <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({...form, rating: parseInt(e.target.value)})} className="w-full" />
          </div>
          <textarea value={form.review} onChange={(e) => setForm({...form, review: e.target.value})} rows={4} className="w-full" placeholder="Review" required />
          <div>
            <label className="block text-sm text-slate-400 mb-1">Avatar</label>
            <div className="flex gap-2">
              <input value={form.avatar} onChange={(e) => setForm({...form, avatar: e.target.value})} className="w-full" placeholder="https://..." />
              <button type="button" onClick={() => setPickerField('avatar')} className="px-3 py-2 bg-slate-200 hover:bg-slate-200 text-slate-600 rounded-lg transition shrink-0">
                <ImageIcon size={16} />
              </button>
            </div>
            {form.avatar && (
              <div className="mt-2 w-14 h-14 rounded-full overflow-hidden border border-slate-200">
                <img src={form.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> {editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-slate-900">{item.name}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-400">{item.position} at {item.company}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-slate-400">No testimonials added yet</p>}

      <ImagePicker
        open={!!pickerField}
        onSelect={(url) => { setForm({...form, [pickerField]: url}); setPickerField(null); }}
        onClose={() => setPickerField(null)}
      />
    </div>
  );
}
