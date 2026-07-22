import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { experienceAPI } from '../../services/api';
import { Plus, Save, Loader2, Trash2, Pencil, Image as ImageIcon, GripVertical, X } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const emptyForm = {
  company: '', position: '', description: '', startDate: '', endDate: '',
  isCurrent: false, employmentType: '', location: '', companyUrl: '',
  technologies: '', responsibilities: '', achievements: '', logo: '', galleryImages: [],
};

export default function ExperienceEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [pickerField, setPickerField] = useState(null);
  const [galleryInput, setGalleryInput] = useState('');

  const fetchItems = async () => {
    try { const res = await experienceAPI.getAll(); setItems(res.data.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        technologies: form.technologies ? JSON.stringify(form.technologies.split(',').map(t => t.trim()).filter(Boolean)) : null,
        responsibilities: form.responsibilities ? JSON.stringify(form.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)) : null,
        achievements: form.achievements ? JSON.stringify(form.achievements.split('\n').map(a => a.trim()).filter(Boolean)) : null,
        galleryImages: form.galleryImages.length > 0 ? JSON.stringify(form.galleryImages) : null,
      };
      if (editing) { await experienceAPI.update(editing, data); toast.success('Updated'); }
      else { await experienceAPI.create(data); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchItems();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    const techs = item.technologies ? JSON.parse(item.technologies).join(', ') : '';
    const resp = item.responsibilities ? JSON.parse(item.responsibilities).join('\n') : '';
    const ach = item.achievements ? JSON.parse(item.achievements).join('\n') : '';
    const gal = item.galleryImages ? JSON.parse(item.galleryImages) : [];
    setForm({
      company: item.company || '', position: item.position || '', description: item.description || '',
      startDate: item.startDate?.split('T')[0] || '', endDate: item.endDate?.split('T')[0] || '',
      isCurrent: item.isCurrent || false, employmentType: item.employmentType || '',
      location: item.location || '', companyUrl: item.companyUrl || '',
      technologies: techs, responsibilities: resp, achievements: ach,
      logo: item.logo || '', galleryImages: gal,
    });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    try { await experienceAPI.delete(id); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Failed to delete'); }
  };

  const addGalleryImage = () => {
    if (galleryInput.trim()) {
      setForm({ ...form, galleryImages: [...form.galleryImages, galleryInput.trim()] });
      setGalleryInput('');
    }
  };

  const removeGalleryImage = (i) => {
    setForm({ ...form, galleryImages: form.galleryImages.filter((_, idx) => idx !== i) });
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Experience</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-3xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit' : 'New'} Experience</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Company *</label>
              <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full" placeholder="Company name" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Position *</label>
              <input value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full" placeholder="Job title" required />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full" placeholder="Role description" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Start Date *</label>
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

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Employment Type</label>
              <select value={form.employmentType} onChange={(e) => setForm({...form, employmentType: e.target.value})} className="w-full">
                <option value="">Select...</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="w-full" placeholder="City, Country or Remote" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Company URL</label>
              <input value={form.companyUrl} onChange={(e) => setForm({...form, companyUrl: e.target.value})} className="w-full" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Technologies (comma separated)</label>
            <input value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})} className="w-full" placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Responsibilities (one per line)</label>
              <textarea value={form.responsibilities} onChange={(e) => setForm({...form, responsibilities: e.target.value})} rows={4} className="w-full" placeholder="Led team of 5 developers\nBuilt REST APIs\nOptimized database queries" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Achievements (one per line)</label>
              <textarea value={form.achievements} onChange={(e) => setForm({...form, achievements: e.target.value})} rows={4} className="w-full" placeholder="Reduced load time by 40%\nDelivered 10+ projects" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Company Logo</label>
            <div className="flex gap-2">
              <input value={form.logo} onChange={(e) => setForm({...form, logo: e.target.value})} className="w-full" placeholder="https://..." />
              <button type="button" onClick={() => setPickerField('logo')} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition shrink-0">
                <ImageIcon size={16} />
              </button>
            </div>
            {form.logo && <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-slate-700"><img src={form.logo} alt="" className="w-full h-full object-contain" /></div>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Gallery Images</label>
            <div className="flex gap-2">
              <input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} className="w-full" placeholder="Image URL" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())} />
              <button type="button" onClick={addGalleryImage} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition shrink-0 text-sm">Add</button>
            </div>
            {form.galleryImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.galleryImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-700" />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
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
              <div className="flex items-center gap-3">
                {item.logo ? (
                  <img src={item.logo} alt="" className="w-10 h-10 rounded-lg object-contain bg-white/5 border border-slate-700" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                    {(item.company || 'C')[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-white">{item.position}</h4>
                  <p className="text-sm text-cyan-400">{item.company}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.startDate?.split('T')[0]} – {item.isCurrent ? 'Present' : item.endDate?.split('T')[0]}
                    {item.employmentType && ` · ${item.employmentType}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-slate-500">No experiences added yet</p>}

      <ImagePicker
        open={!!pickerField}
        onSelect={(url) => { setForm({...form, [pickerField]: url}); setPickerField(null); }}
        onClose={() => setPickerField(null)}
      />
    </div>
  );
}
