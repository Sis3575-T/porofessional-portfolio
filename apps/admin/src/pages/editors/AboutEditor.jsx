import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';
import { Save, Loader2 } from 'lucide-react';

export default function AboutEditor() {
  const [form, setForm] = useState({
    biography: '', summary: '', profileImage: '', yearsOfExperience: 5,
    downloadCVUrl: '', location: '', email: '', phone: '', nationality: '', languages: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await aboutAPI.get();
        if (res.data.data) setForm(res.data.data);
      } catch { toast.error('Failed to load about data'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aboutAPI.update(form);
      toast.success('About section updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">About Section</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Biography</label>
          <textarea value={form.biography} onChange={(e) => setForm({...form, biography: e.target.value})} rows={4} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Summary</label>
          <textarea value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} rows={3} className="w-full" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Profile Image URL</label>
            <input value={form.profileImage || ''} onChange={(e) => setForm({...form, profileImage: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Years of Experience</label>
            <input type="number" value={form.yearsOfExperience} onChange={(e) => setForm({...form, yearsOfExperience: parseInt(e.target.value)})} className="w-full" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Location</label>
            <input value={form.location || ''} onChange={(e) => setForm({...form, location: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input type="email" value={form.email || ''} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Phone</label>
            <input value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Download CV URL</label>
            <input value={form.downloadCVUrl || ''} onChange={(e) => setForm({...form, downloadCVUrl: e.target.value})} className="w-full" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Nationality</label>
            <input value={form.nationality || ''} onChange={(e) => setForm({...form, nationality: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Languages</label>
            <input value={form.languages || ''} onChange={(e) => setForm({...form, languages: e.target.value})} className="w-full" placeholder="English, Amharic" />
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
