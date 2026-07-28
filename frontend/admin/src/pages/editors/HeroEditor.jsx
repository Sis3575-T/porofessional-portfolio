import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { heroAPI } from '../../services/api';
import { Save, Loader2, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm";
const labelClass = "block text-sm text-slate-500 mb-1.5";

const defaultSocial = { platform: 'github', url: '', enabled: true };
const defaultStat = { label: '', value: 0, enabled: true };

export default function HeroEditor() {
  const [form, setForm] = useState({
    greeting: '', name: '', title: '', description: '',
    primaryCTA: '', secondaryCTA: '', profileImage: '', backgroundImage: '',
    buttonConfig: JSON.stringify({ borderRadius: 12, shadowIntensity: 25, hoverEffect: 'lift' }, null, 2),
    socialLinks: JSON.stringify([defaultSocial], null, 2),
    stats: JSON.stringify([defaultStat], null, 2),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerField, setPickerField] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await heroAPI.get();
        if (res.data.data) {
          const data = res.data.data;
          setForm({
            greeting: data.greeting || '',
            name: data.name || '',
            title: data.title || '',
            description: data.description || '',
            primaryCTA: data.primaryCTA || '',
            secondaryCTA: data.secondaryCTA || '',
            profileImage: data.profileImage || '',
            backgroundImage: data.backgroundImage || '',
            buttonConfig: data.buttonConfig || JSON.stringify({ borderRadius: 12, shadowIntensity: 25, hoverEffect: 'lift' }, null, 2),
            socialLinks: data.socialLinks || JSON.stringify([defaultSocial], null, 2),
            stats: data.stats || JSON.stringify([defaultStat], null, 2),
          });
        }
      } catch {
        toast.error('Failed to load hero data');
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let socialLinks = form.socialLinks;
      let stats = form.stats;
      let buttonConfig = form.buttonConfig;
      try { JSON.parse(socialLinks); } catch { toast.error('Invalid JSON in Social Links'); setSaving(false); return; }
      try { JSON.parse(stats); } catch { toast.error('Invalid JSON in Stats'); setSaving(false); return; }
      try { JSON.parse(buttonConfig); } catch { toast.error('Invalid JSON in Button Config'); setSaving(false); return; }
      await heroAPI.update({ ...form, socialLinks, stats, buttonConfig });
      toast.success('Hero section updated successfully');
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const pickImage = (field) => setPickerField(field);
  const handleImageSelected = (url) => {
    setForm((prev) => ({ ...prev, [pickerField]: url }));
  };

  if (loading) return <div className="animate-pulse text-slate-400">Loading...</div>;

  const ImageField = ({ field, label }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          value={form[field] || ''}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
        <button
          type="button"
          onClick={() => pickImage(field)}
          className="px-3 py-2 bg-slate-200 hover:bg-slate-200 text-slate-600 rounded-lg transition flex items-center gap-1.5 shrink-0"
          title="Browse media library"
        >
          <ImageIcon size={16} />
          Browse
        </button>
        {form[field] && (
          <button
            type="button"
            onClick={() => setForm({ ...form, [field]: '' })}
            className="px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition"
            title="Clear image"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {form[field] && (
        <div className="mt-2 relative group w-28 h-20 rounded-lg overflow-hidden border border-slate-200">
          <img
            src={form[field]}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Hero Section</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Content</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Greeting</label>
              <input value={form.greeting} onChange={(e) => setForm({...form, greeting: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Primary CTA</label>
              <input value={form.primaryCTA} onChange={(e) => setForm({...form, primaryCTA: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Secondary CTA</label>
              <input value={form.secondaryCTA} onChange={(e) => setForm({...form, secondaryCTA: e.target.value})} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Images</h3>
          <ImageField field="profileImage" label="Profile Image" />
          <ImageField field="backgroundImage" label="Background Image" />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Button Configuration</h3>
          <p className="text-xs text-slate-400">JSON config for button styling (borderRadius, shadowIntensity, hoverEffect)</p>
          <textarea
            value={form.buttonConfig}
            onChange={(e) => setForm({...form, buttonConfig: e.target.value})}
            rows={4}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Social Links (JSON)</h3>
          <p className="text-xs text-slate-400">Array of {`{ platform, url, enabled }`}</p>
          <textarea
            value={form.socialLinks}
            onChange={(e) => setForm({...form, socialLinks: e.target.value})}
            rows={5}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Stats (JSON)</h3>
          <p className="text-xs text-slate-400">Array of {`{ label, value, enabled }`}</p>
          <textarea
            value={form.stats}
            onChange={(e) => setForm({...form, stats: e.target.value})}
            rows={5}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <ImagePicker
        open={!!pickerField}
        onSelect={handleImageSelected}
        onClose={() => setPickerField(null)}
      />
    </div>
  );
}
