import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { heroAPI } from '../../services/api';
import { Save, Loader2, Image as ImageIcon, X } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const inputClass = "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm";
const labelClass = "block text-sm text-slate-400 mb-1.5";

export default function HeroEditor() {
  const [form, setForm] = useState({
    greeting: '', name: '', title: '', description: '',
    primaryCTA: '', secondaryCTA: '', profileImage: '', backgroundImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerField, setPickerField] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await heroAPI.get();
        if (res.data.data) setForm(res.data.data);
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
      await heroAPI.update(form);
      toast.success('Hero section updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const pickImage = (field) => setPickerField(field);
  const handleImageSelected = (url) => {
    setForm((prev) => ({ ...prev, [pickerField]: url }));
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

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
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition flex items-center gap-1.5 shrink-0"
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
        <div className="mt-2 relative group w-28 h-20 rounded-lg overflow-hidden border border-slate-700">
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
      <h2 className="text-2xl font-bold text-white mb-8">Hero Section</h2>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
        <ImageField field="profileImage" label="Profile Image" />
        <ImageField field="backgroundImage" label="Background Image" />
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
