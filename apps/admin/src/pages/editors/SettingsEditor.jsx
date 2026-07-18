import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/api';
import { Save, Loader2 } from 'lucide-react';

export default function SettingsEditor() {
  const [form, setForm] = useState({
    siteTitle: '', siteDescription: '', siteUrl: '', contactEmail: '', contactPhone: '',
    address: '', metaKeywords: '', metaDescription: '', socialLinks: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await settingsAPI.get();
        if (res.data.data) {
          const s = res.data.data;
          setForm({
            siteTitle: s.siteTitle || '', siteDescription: s.siteDescription || '', siteUrl: s.siteUrl || '',
            contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '', address: s.address || '',
            metaKeywords: s.metaKeywords || '', metaDescription: s.metaDescription || '',
            socialLinks: s.socialLinks ? JSON.stringify(JSON.parse(s.socialLinks), null, 2) : '{}',
          });
        }
      } catch { toast.error('Failed to load settings'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let socialLinks = {};
      try { socialLinks = JSON.parse(form.socialLinks); }
      catch { toast.error('Invalid JSON in social links'); setSaving(false); return; }
      await settingsAPI.update({ ...form, socialLinks: JSON.stringify(socialLinks) });
      toast.success('Settings updated');
    } catch (err) { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Site Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Site Title</label>
            <input value={form.siteTitle} onChange={(e) => setForm({...form, siteTitle: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Site URL</label>
            <input value={form.siteUrl} onChange={(e) => setForm({...form, siteUrl: e.target.value})} className="w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Site Description</label>
          <textarea value={form.siteDescription} onChange={(e) => setForm({...form, siteDescription: e.target.value})} rows={2} className="w-full" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contact Email</label>
            <input type="email" value={form.contactEmail} onChange={(e) => setForm({...form, contactEmail: e.target.value})} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Contact Phone</label>
            <input value={form.contactPhone} onChange={(e) => setForm({...form, contactPhone: e.target.value})} className="w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Address</label>
          <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Meta Keywords</label>
          <input value={form.metaKeywords} onChange={(e) => setForm({...form, metaKeywords: e.target.value})} className="w-full" placeholder="developer, portfolio, react" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Meta Description</label>
          <textarea value={form.metaDescription} onChange={(e) => setForm({...form, metaDescription: e.target.value})} rows={2} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Social Links (JSON)</label>
          <textarea value={form.socialLinks} onChange={(e) => setForm({...form, socialLinks: e.target.value})} rows={5} className="w-full font-mono text-xs" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
