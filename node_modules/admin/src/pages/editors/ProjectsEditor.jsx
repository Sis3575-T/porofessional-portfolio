import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { projectsAPI } from '../../services/api';
import { Plus, Save, Trash2, Pencil, ExternalLink, Github } from 'lucide-react';

const CATEGORIES = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'MOBILE', 'UIUX', 'AI', 'OTHER'];

export default function ProjectsEditor() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', slug: '', description: '', thumbnail: '', category: 'FULLSTACK',
    technologies: '', features: '', challenge: '', solution: '', lessonsLearned: '',
    liveUrl: '', githubUrl: '', featured: false,
  });

  const fetch = async () => {
    try { const res = await projectsAPI.getAll({ limit: 100 }); setProjects(res.data.data || []); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        slug: form.slug || generateSlug(form.title),
        technologies: JSON.stringify(form.technologies.split(',').map(t => t.trim()).filter(Boolean)),
        features: JSON.stringify(form.features.split('\n').filter(f => f.trim())),
      };
      if (editing) { await projectsAPI.update(editing, data); toast.success('Updated'); }
      else { await projectsAPI.create(data); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm({ title: '', slug: '', description: '', thumbnail: '', category: 'FULLSTACK', technologies: '', features: '', challenge: '', solution: '', lessonsLearned: '', liveUrl: '', githubUrl: '', featured: false }); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title, slug: p.slug, description: p.description, thumbnail: p.thumbnail || '', category: p.category,
      technologies: p.technologies ? JSON.parse(p.technologies).join(', ') : '',
      features: p.features ? JSON.parse(p.features).join('\n') : '',
      challenge: p.challenge || '', solution: p.solution || '', lessonsLearned: p.lessonsLearned || '',
      liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '', featured: p.featured,
    });
    setEditing(p.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await projectsAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }}
          className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> Add Project</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-3xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit' : 'New'} Project</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })} className="w-full" placeholder="Title" required />
            <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="w-full" placeholder="slug-url" required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full" placeholder="Description" required />
          <div className="grid sm:grid-cols-2 gap-4">
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.thumbnail} onChange={(e) => setForm({...form, thumbnail: e.target.value})} className="w-full" placeholder="Thumbnail URL" />
          </div>
          <input value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})} className="w-full" placeholder="Technologies (comma separated)" />
          <div>
            <label className="block text-sm text-slate-400 mb-1">Features (one per line)</label>
            <textarea value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} rows={3} className="w-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <textarea value={form.challenge} onChange={(e) => setForm({...form, challenge: e.target.value})} rows={2} className="w-full" placeholder="Challenge" />
            <textarea value={form.solution} onChange={(e) => setForm({...form, solution: e.target.value})} rows={2} className="w-full" placeholder="Solution" />
            <textarea value={form.lessonsLearned} onChange={(e) => setForm({...form, lessonsLearned: e.target.value})} rows={2} className="w-full" placeholder="Lessons Learned" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <input value={form.liveUrl} onChange={(e) => setForm({...form, liveUrl: e.target.value})} className="w-full" placeholder="Live Demo URL" />
            <input value={form.githubUrl} onChange={(e) => setForm({...form, githubUrl: e.target.value})} className="w-full" placeholder="GitHub URL" />
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-slate-300">Featured</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> {editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-white">{p.title}</h4>
                  {p.featured && <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <p className="text-sm text-slate-500 mt-1">{p.category} — {p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-cyan-400"><ExternalLink size={14} /></a>}
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-cyan-400"><Github size={14} /></a>}
                <button onClick={() => handleEdit(p)} className="p-1 text-slate-400 hover:text-cyan-400"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p className="text-slate-500">No projects added yet</p>}
    </div>
  );
}
