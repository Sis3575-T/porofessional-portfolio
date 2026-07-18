import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { skillsAPI } from '../../services/api';
import { Plus, Save, Loader2, Trash2, Pencil } from 'lucide-react';

const CATEGORIES = ['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TOOLS', 'LANGUAGES', 'SOFT_SKILLS', 'OTHER'];

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' });

  const fetch = async () => {
    try { const res = await skillsAPI.getAll(); setSkills(res.data.data); }
    catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await skillsAPI.update(editing, form);
        toast.success('Skill updated');
      } else {
        await skillsAPI.create(form);
        toast.success('Skill created');
      }
      setShowForm(false); setEditing(null); setForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, icon: skill.icon || '', description: skill.description || '' });
    setEditing(skill.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await skillsAPI.delete(id); toast.success('Skill deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' }); }}
          className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <h3 className="font-semibold text-white">{editing ? 'Edit Skill' : 'New Skill'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Proficiency (0-100)</label>
              <input type="number" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({...form, proficiency: parseInt(e.target.value)})} className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Icon URL</label>
              <input value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm flex items-center gap-2"><Save size={16} /> {editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between group">
            <div>
              <h4 className="font-medium text-white">{skill.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-500">{skill.category}</span>
                <span className="text-xs text-cyan-400 font-medium">{skill.proficiency}%</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => handleEdit(skill)} className="p-2 text-slate-400 hover:text-cyan-400"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {skills.length === 0 && <p className="text-slate-500">No skills added yet</p>}
    </div>
  );
}
