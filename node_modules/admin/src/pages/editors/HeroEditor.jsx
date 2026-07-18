import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { heroAPI } from '../../services/api';
import { Save, Loader2 } from 'lucide-react';

export default function HeroEditor() {
  const [form, setForm] = useState({
    greeting: '', name: '', title: '', description: '',
    primaryCTA: '', secondaryCTA: '', profileImage: '', backgroundImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await heroAPI.get();
        if (res.data.data) setForm(res.data.data);
      } catch (err) {
        toast.error('Failed to load hero data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await heroAPI.update(form);
      toast.success('Hero section updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Hero Section</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Greeting</label>
            <input value={form.greeting} onChange={(e) => setForm({...form, greeting: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Name</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Title</label>
          <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Primary CTA</label>
            <input value={form.primaryCTA} onChange={(e) => setForm({...form, primaryCTA: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Secondary CTA</label>
            <input value={form.secondaryCTA} onChange={(e) => setForm({...form, secondaryCTA: e.target.value})} className="w-full" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Profile Image URL</label>
            <input value={form.profileImage || ''} onChange={(e) => setForm({...form, profileImage: e.target.value})} className="w-full" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Background Image URL</label>
            <input value={form.backgroundImage || ''} onChange={(e) => setForm({...form, backgroundImage: e.target.value})} className="w-full" placeholder="https://..." />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
