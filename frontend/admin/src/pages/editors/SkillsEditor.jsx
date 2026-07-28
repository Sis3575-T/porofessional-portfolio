import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { skillsAPI } from '../../services/api';
import { Plus, Save, Loader2, Trash2, Pencil, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, X } from 'lucide-react';

const CATEGORIES = ['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TOOLS', 'LANGUAGES', 'SOFT_SKILLS', 'OTHER'];

const LEVELS = [
  { value: 'Beginner', min: 0, max: 49 },
  { value: 'Intermediate', min: 50, max: 74 },
  { value: 'Advanced', min: 75, max: 89 },
  { value: 'Expert', min: 90, max: 100 },
];

function getLevel(p) {
  if (p >= 90) return 'Expert';
  if (p >= 75) return 'Advanced';
  if (p >= 50) return 'Intermediate';
  return 'Beginner';
}

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    try { const res = await skillsAPI.getAll(); setSkills(res.data.data); }
    catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await skillsAPI.update(editing, form);
        toast.success('Skill updated');
      } else {
        await skillsAPI.create(form);
        toast.success('Skill created');
      }
      setShowForm(false); setEditing(null); setForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' });
      fetchSkills();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, icon: skill.icon || '', description: skill.description || '' });
    setEditing(skill.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await skillsAPI.delete(id); toast.success('Skill deleted'); fetchSkills(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id, enabled) => {
    try {
      await skillsAPI.update(id, { enabled: !enabled });
      toast.success(enabled ? 'Skill hidden' : 'Skill visible');
      fetchSkills();
    } catch { toast.error('Failed to update'); }
  };

  const handleMove = async (id, dir) => {
    const idx = skills.findIndex(s => s.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= skills.length) return;
    const arr = [...skills];
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    setSkills(arr);
    try {
      await skillsAPI.reorder(arr.map(s => s.id));
    } catch { toast.error('Failed to reorder'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-slate-500" size={28} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
          <p className="text-sm text-slate-500 mt-1">{skills.length} skills total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', description: '' }); }}
          className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{editing ? 'Edit Skill' : 'New Skill'}</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-slate-500 hover:text-slate-900">
              <X size={18} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full" required />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Proficiency (0-100)</label>
              <input type="number" min="0" max="100" value={form.proficiency} onChange={(e) => setForm({...form, proficiency: parseInt(e.target.value)})} className="w-full" />
              <p className="text-xs text-slate-400 mt-1">Level: {getLevel(form.proficiency)}</p>
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Icon URL (optional)</label>
              <input value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="w-full" placeholder="Leave empty for auto-generated" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full" placeholder="Brief description of this skill" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div key={skill.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 group">
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => handleMove(skill.id, 'up')} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20"><ArrowUp size={14} /></button>
              <button onClick={() => handleMove(skill.id, 'down')} disabled={i === skills.length - 1} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20"><ArrowDown size={14} /></button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-slate-900">{skill.name}</h4>
                {!skill.enabled && <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Hidden</span>}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-400">{skill.category}</span>
                <span className="text-xs text-cyan-400 font-medium">{skill.proficiency}%</span>
                <span className="text-xs text-slate-400">{getLevel(skill.proficiency)}</span>
              </div>
              {skill.description && (
                <p className="text-xs text-slate-400 mt-1 truncate">{skill.description}</p>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => handleToggle(skill.id, skill.enabled)} className="p-2 text-slate-500 hover:text-amber-400" title={skill.enabled ? 'Hide' : 'Show'}>
                {skill.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleEdit(skill)} className="p-2 text-slate-500 hover:text-cyan-400"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {skills.length === 0 && <p className="text-slate-400">No skills added yet</p>}
    </div>
  );
}
