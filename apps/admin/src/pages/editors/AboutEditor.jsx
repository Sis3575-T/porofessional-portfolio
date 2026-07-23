import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { aboutAPI } from '../../services/api';
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import ImagePicker from '../../components/ImagePicker';

const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm";
const labelClass = "block text-sm text-slate-500 mb-1.5";
const textareaClass = "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-sm resize-y";

export default function AboutEditor() {
  const [form, setForm] = useState({
    subtitle: 'ABOUT ME',
    heading: 'Crafting Digital Experiences That Make an Impact',
    biography: '',
    summary: '',
    profileImage: '',
    glbModel: '',
    yearsOfExperience: 5,
    downloadCVUrl: '',
    name: '',
    location: '',
    email: '',
    phone: '',
    nationality: '',
    languages: '',
    degree: '',
    availability: 'Available for projects',
    freelance: 'Available',
    statistics: JSON.stringify({ projects: 50, clients: 30, yearsExp: 5, technologies: 20 }, null, 2),
    featureCards: JSON.stringify([
      { icon: 'code', title: 'Clean Code', description: 'Writing maintainable, well-documented code that follows industry best practices.' },
      { icon: 'layers', title: 'Scalable Architecture', description: 'Designing systems that grow seamlessly with your business needs.' },
      { icon: 'lightbulb', title: 'Problem Solving', description: 'Tackling complex challenges with creative, efficient solutions.' },
      { icon: 'palette', title: 'Modern UI/UX', description: 'Crafting beautiful, intuitive interfaces that deliver exceptional user experiences.' },
    ], null, 2),
    techIcons: '{}',
    background: JSON.stringify({ noise: true, grid: true, radialLights: true, blurredCircles: true }, null, 2),
    decoration: JSON.stringify({ grid: true, gridSize: 60, particles: true, geometricShapes: true }, null, 2),
    animationSettings: JSON.stringify({ scrollReveal: true, hoverEffects: true, floatSpeed: 1, parallaxIntensity: 0.3 }, null, 2),
    visibility: 'visible',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerField, setPickerField] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await aboutAPI.get();
        if (res.data.data) {
          const s = res.data.data;
          setForm((prev) => ({
            ...prev,
            ...s,
            statistics: s.statistics ? JSON.stringify(JSON.parse(s.statistics), null, 2) : prev.statistics,
            featureCards: s.featureCards ? JSON.stringify(JSON.parse(s.featureCards), null, 2) : prev.featureCards,
            techIcons: s.techIcons ? JSON.stringify(JSON.parse(s.techIcons), null, 2) : prev.techIcons,
            background: s.background ? JSON.stringify(JSON.parse(s.background), null, 2) : prev.background,
            decoration: s.decoration ? JSON.stringify(JSON.parse(s.decoration), null, 2) : prev.decoration,
            animationSettings: s.animationSettings ? JSON.stringify(JSON.parse(s.animationSettings), null, 2) : prev.animationSettings,
          }));
        }
      } catch { toast.error('Failed to load about data'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      for (const field of ['statistics', 'featureCards', 'techIcons', 'background', 'decoration', 'animationSettings']) {
        try {
          JSON.parse(payload[field]);
        } catch {
          toast.error(`Invalid JSON in ${field}`);
          setSaving(false);
          return;
        }
      }
      await aboutAPI.update(payload);
      toast.success('About section updated');
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">About Section</h2>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Header</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Subtitle</label>
              <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input value={form.heading} onChange={(e) => set('heading', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Biography</h3>
          <div>
            <label className={labelClass}>Full Biography</label>
            <textarea value={form.biography} onChange={(e) => set('biography', e.target.value)} rows={6} className={textareaClass} />
          </div>
          <div>
            <label className={labelClass}>Short Summary</label>
            <textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} rows={3} className={textareaClass} />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Media</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Profile Image</label>
              <div className="flex gap-2">
                <input value={form.profileImage || ''} onChange={(e) => set('profileImage', e.target.value)} className={inputClass} placeholder="https://..." />
                <button type="button" onClick={() => setPickerField('profileImage')} className="px-3 py-2 bg-slate-200 hover:bg-slate-600 text-slate-600 rounded-lg transition shrink-0">
                  <ImageIcon size={16} />
                </button>
                {form.profileImage && (
                  <button type="button" onClick={() => set('profileImage', '')} className="px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg transition">
                    <X size={16} />
                  </button>
                )}
              </div>
              {form.profileImage && (
                <div className="mt-2 w-24 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <img src={form.profileImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>3D Avatar (GLB URL)</label>
              <input value={form.glbModel || ''} onChange={(e) => set('glbModel', e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input value={form.location || ''} onChange={(e) => set('location', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nationality</label>
              <input value={form.nationality || ''} onChange={(e) => set('nationality', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Languages</label>
              <input value={form.languages || ''} onChange={(e) => set('languages', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Degree</label>
              <input value={form.degree || ''} onChange={(e) => set('degree', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Years of Experience</label>
              <input type="number" value={form.yearsOfExperience} onChange={(e) => set('yearsOfExperience', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Availability</label>
              <input value={form.availability || ''} onChange={(e) => set('availability', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Freelance</label>
              <input value={form.freelance || ''} onChange={(e) => set('freelance', e.target.value)} className={inputClass} placeholder="Available / Unavailable" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Download CV URL</label>
            <input value={form.downloadCVUrl || ''} onChange={(e) => set('downloadCVUrl', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Visibility</label>
            <select value={form.visibility || 'visible'} onChange={(e) => set('visibility', e.target.value)} className={inputClass}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Statistics (JSON)</h3>
          <textarea value={form.statistics} onChange={(e) => set('statistics', e.target.value)} rows={4} className={`${textareaClass} font-mono text-xs`} />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Feature Cards (JSON)</h3>
          <textarea value={form.featureCards} onChange={(e) => set('featureCards', e.target.value)} rows={6} className={`${textareaClass} font-mono text-xs`} />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Background (JSON)</h3>
          <textarea value={form.background} onChange={(e) => set('background', e.target.value)} rows={3} className={`${textareaClass} font-mono text-xs`} />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Decoration (JSON)</h3>
          <textarea value={form.decoration} onChange={(e) => set('decoration', e.target.value)} rows={3} className={`${textareaClass} font-mono text-xs`} />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Animation Settings (JSON)</h3>
          <textarea value={form.animationSettings} onChange={(e) => set('animationSettings', e.target.value)} rows={3} className={`${textareaClass} font-mono text-xs`} />
        </div>

        <button type="submit" disabled={saving} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <ImagePicker
        open={!!pickerField}
        onSelect={(url) => { set(pickerField, url); setPickerField(null); }}
        onClose={() => setPickerField(null)}
      />
    </div>
  );
}
