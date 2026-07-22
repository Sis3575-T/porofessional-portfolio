import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/api';
import { Save, Loader2, RefreshCw } from 'lucide-react';

const MODE_OPTIONS = [
  { value: 'photoCard', label: '3D Photo Card' },
  { value: 'abstract', label: 'Abstract Geometry' },
  { value: 'office', label: '3D Office Environment' },
];

const DEFAULT_UI = {
  customCursorEnabled: true,
  backgroundEffectsEnabled: true,
};

const DEFAULT_3D = {
  mode: 'photoCard',
  rotationSpeed: 0.3,
  floatSpeed: 0.5,
  floatIntensity: 0.3,
  autoRotate: true,
  autoRotateSpeed: 0.3,
  mouseInteraction: true,
  particleDensity: 80,
  shadowQuality: 'medium',
  typingSpeed: 2,
  breathingSpeed: 0.8,
  iconCount: 8,
  ambientIntensity: 0.15,
  directionalIntensity: 0.5,
  accentIntensity: 0.2,
  profileImagePlacement: 'monitor',
};

const PLACEMENT_OPTIONS = [
  { value: 'monitor', label: 'Monitor Display' },
  { value: 'floating', label: 'Floating Frame' },
  { value: 'both', label: 'Both' },
];

const DEFAULT_SECTIONS = {
  hero: true, about: true, skills: true, services: true,
  experience: true, education: true, projects: true,
  testimonials: true, contact: true, footer: true,
};

const SECTION_LABELS = {
  hero: "Hero Section", about: "About Section", skills: "Skills Section",
  services: "Services Section", experience: "Experience Section",
  education: "Education Section", projects: "Projects Section",
  testimonials: "Testimonials Section", contact: "Contact Section",
  footer: "Footer",
};

export default function SettingsEditor() {
  const [form, setForm] = useState({
    siteTitle: '', siteDescription: '', siteUrl: '', contactEmail: '', contactPhone: '',
    address: '', metaKeywords: '', metaDescription: '', socialLinks: '',
    availability: '', responseTime: '', workingHours: '',
  });
  const [hero3d, setHero3d] = useState(DEFAULT_3D);
  const [uiConfig, setUiConfig] = useState(DEFAULT_UI);
  const [sectionVisibility, setSectionVisibility] = useState(DEFAULT_SECTIONS);
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
            availability: s.availability || '', responseTime: s.responseTime || '', workingHours: s.workingHours || '',
          });
          if (s.hero3dConfig) {
            try { setHero3d({ ...DEFAULT_3D, ...JSON.parse(s.hero3dConfig) }); }
            catch { /* use defaults */ }
          }
          if (s.uiConfig) {
            try { setUiConfig({ ...DEFAULT_UI, ...JSON.parse(s.uiConfig) }); }
            catch { /* use defaults */ }
          }
          if (s.sectionVisibility) {
            try { setSectionVisibility({ ...DEFAULT_SECTIONS, ...JSON.parse(s.sectionVisibility) }); }
            catch { /* use defaults */ }
          }
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
      await settingsAPI.update({
        ...form,
        socialLinks: JSON.stringify(socialLinks),
        hero3dConfig: JSON.stringify(hero3d),
        uiConfig: JSON.stringify(uiConfig),
        sectionVisibility: JSON.stringify(sectionVisibility),
      });
      toast.success('Settings updated');
    } catch (err) { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const reset3d = () => setHero3d(DEFAULT_3D);

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  const inputClass = "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm";
  const labelClass = "block text-sm text-slate-400 mb-1.5";
  const selectClass = "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-sm";

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Site Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">General</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Site Title</label>
              <input value={form.siteTitle} onChange={(e) => setForm({...form, siteTitle: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Site URL</label>
              <input value={form.siteUrl} onChange={(e) => setForm({...form, siteUrl: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Site Description</label>
            <textarea value={form.siteDescription} onChange={(e) => setForm({...form, siteDescription: e.target.value})} rows={2} className={inputClass} />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Contact Info</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm({...form, contactEmail: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Phone</label>
              <input value={form.contactPhone} onChange={(e) => setForm({...form, contactPhone: e.target.value})} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address / Location</label>
            <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className={inputClass} placeholder="Remote / Worldwide" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Availability</label>
              <input value={form.availability} onChange={(e) => setForm({...form, availability: e.target.value})} className={inputClass} placeholder="Available for projects" />
            </div>
            <div>
              <label className={labelClass}>Response Time</label>
              <input value={form.responseTime} onChange={(e) => setForm({...form, responseTime: e.target.value})} className={inputClass} placeholder="Within 24 hours" />
            </div>
            <div>
              <label className={labelClass}>Working Hours</label>
              <input value={form.workingHours} onChange={(e) => setForm({...form, workingHours: e.target.value})} className={inputClass} placeholder="Mon - Fri, 9AM - 6PM" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">SEO</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Meta Keywords</label>
              <input value={form.metaKeywords} onChange={(e) => setForm({...form, metaKeywords: e.target.value})} className={inputClass} placeholder="developer, portfolio, react" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea value={form.metaDescription} onChange={(e) => setForm({...form, metaDescription: e.target.value})} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Social Links (JSON)</label>
            <textarea value={form.socialLinks} onChange={(e) => setForm({...form, socialLinks: e.target.value})} rows={5} className={`${inputClass} font-mono text-xs`} />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">3D Hero Configuration</h3>
            <button type="button" onClick={reset3d} className="text-sm text-slate-400 hover:text-cyan-400 transition flex items-center gap-1">
              <RefreshCw size={14} /> Reset Defaults
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Display Mode</label>
              <select value={hero3d.mode} onChange={(e) => setHero3d({...hero3d, mode: e.target.value})} className={selectClass}>
                {MODE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Profile Image Placement</label>
              <select value={hero3d.profileImagePlacement} onChange={(e) => setHero3d({...hero3d, profileImagePlacement: e.target.value})} className={selectClass}>
                {PLACEMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Auto-Rotate Speed</label>
              <input type="range" min="0" max="1" step="0.1" value={hero3d.autoRotateSpeed}
                onChange={(e) => setHero3d({...hero3d, autoRotateSpeed: parseFloat(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.autoRotateSpeed.toFixed(1)}x</span>
            </div>
            <div>
              <label className={labelClass}>Rotation Speed</label>
              <input type="range" min="0" max="1" step="0.1" value={hero3d.rotationSpeed}
                onChange={(e) => setHero3d({...hero3d, rotationSpeed: parseFloat(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.rotationSpeed.toFixed(1)}x</span>
            </div>
            <div>
              <label className={labelClass}>Float Speed</label>
              <input type="range" min="0" max="1.5" step="0.1" value={hero3d.floatSpeed}
                onChange={(e) => setHero3d({...hero3d, floatSpeed: parseFloat(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.floatSpeed.toFixed(1)}x</span>
            </div>
            <div>
              <label className={labelClass}>Float Intensity</label>
              <input type="range" min="0" max="1" step="0.1" value={hero3d.floatIntensity}
                onChange={(e) => setHero3d({...hero3d, floatIntensity: parseFloat(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.floatIntensity.toFixed(1)}</span>
            </div>
            <div>
              <label className={labelClass}>Particle Density</label>
              <input type="range" min="0" max="150" step="10" value={hero3d.particleDensity}
                onChange={(e) => setHero3d({...hero3d, particleDensity: parseInt(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.particleDensity}</span>
            </div>
            <div>
              <label className={labelClass}>Shadow Quality</label>
              <select value={hero3d.shadowQuality} onChange={(e) => setHero3d({...hero3d, shadowQuality: e.target.value})} className={selectClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Icon Count</label>
              <input type="range" min="2" max="10" step="1" value={hero3d.iconCount}
                onChange={(e) => setHero3d({...hero3d, iconCount: parseInt(e.target.value)})}
                className="w-full accent-cyan-500" />
              <span className="text-xs text-slate-500">{hero3d.iconCount}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-sm font-medium text-slate-300 mb-4">Lighting</h4>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Ambient Intensity</label>
                <input type="range" min="0" max="0.5" step="0.05" value={hero3d.ambientIntensity}
                  onChange={(e) => setHero3d({...hero3d, ambientIntensity: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500" />
                <span className="text-xs text-slate-500">{hero3d.ambientIntensity.toFixed(2)}</span>
              </div>
              <div>
                <label className={labelClass}>Directional Intensity</label>
                <input type="range" min="0" max="1" step="0.1" value={hero3d.directionalIntensity}
                  onChange={(e) => setHero3d({...hero3d, directionalIntensity: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500" />
                <span className="text-xs text-slate-500">{hero3d.directionalIntensity.toFixed(1)}</span>
              </div>
              <div>
                <label className={labelClass}>Accent Intensity</label>
                <input type="range" min="0" max="0.5" step="0.05" value={hero3d.accentIntensity}
                  onChange={(e) => setHero3d({...hero3d, accentIntensity: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500" />
                <span className="text-xs text-slate-500">{hero3d.accentIntensity.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-sm font-medium text-slate-300 mb-4">Character Animation</h4>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Typing Speed</label>
                <input type="range" min="0.5" max="4" step="0.5" value={hero3d.typingSpeed}
                  onChange={(e) => setHero3d({...hero3d, typingSpeed: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500" />
                <span className="text-xs text-slate-500">{hero3d.typingSpeed.toFixed(1)}x</span>
              </div>
              <div>
                <label className={labelClass}>Breathing Speed</label>
                <input type="range" min="0.3" max="2" step="0.1" value={hero3d.breathingSpeed}
                  onChange={(e) => setHero3d({...hero3d, breathingSpeed: parseFloat(e.target.value)})}
                  className="w-full accent-cyan-500" />
                <span className="text-xs text-slate-500">{hero3d.breathingSpeed.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={hero3d.autoRotate}
                onChange={(e) => setHero3d({...hero3d, autoRotate: e.target.checked})}
                className="accent-cyan-500 w-4 h-4" />
              Auto Rotate
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={hero3d.mouseInteraction}
                onChange={(e) => setHero3d({...hero3d, mouseInteraction: e.target.checked})}
                className="accent-cyan-500 w-4 h-4" />
              Mouse Interaction
            </label>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">UI Features</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={uiConfig.customCursorEnabled}
              onChange={(e) => setUiConfig({...uiConfig, customCursorEnabled: e.target.checked})}
              className="accent-cyan-500 w-5 h-5 rounded" />
            <div>
              <p className="text-sm font-medium text-slate-200">Custom Cursor</p>
              <p className="text-xs text-slate-500">Animated follower circle with magnetic hover effect</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={uiConfig.backgroundEffectsEnabled}
              onChange={(e) => setUiConfig({...uiConfig, backgroundEffectsEnabled: e.target.checked})}
              className="accent-cyan-500 w-5 h-5 rounded" />
            <div>
              <p className="text-sm font-medium text-slate-200">Background Effects</p>
              <p className="text-xs text-slate-500">Noise texture, stars, grid, and soft glow</p>
            </div>
          </label>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Section Visibility</h3>
          <p className="text-xs text-slate-500">Toggle sections on/off on the public portfolio</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  checked={sectionVisibility[key] !== false}
                  onChange={(e) => setSectionVisibility({ ...sectionVisibility, [key]: e.target.checked })}
                  className="accent-cyan-500 w-5 h-5 rounded"
                />
                <span className="text-sm text-slate-200">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
