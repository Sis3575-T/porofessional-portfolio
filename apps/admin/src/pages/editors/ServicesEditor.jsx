import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../services/api';
import {
  Plus, Save, Trash2, Pencil, GripVertical,
  Upload, Eye, EyeOff, X, ChevronUp, ChevronDown,
  ExternalLink, Github,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EMPTY_FORM = {
  title: '', shortDescription: '', description: '', fullDescription: '',
  icon: '', heroImage: '', galleryImages: '', technologies: '', features: '',
  tools: '', process: '', liveUrl: '', githubUrl: '', docsUrl: '', caseStudyUrl: '',
  buttonText: 'Live Demo', buttonColor: '#111111', accentColor: '#111111',
  enabled: true, order: 0,
};

function ImageUpload({ value, onChange, label, aspect = "w-16 h-16" }) {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/v1/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) { onChange(data.url); toast.success('Uploaded'); }
      else { toast.error('Upload failed'); }
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        {value ? (
          <div className="relative">
            <img src={value} alt="" className={`${aspect} object-cover rounded-lg border border-slate-700`} />
            <button onClick={() => onChange('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
              <X size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className={`${aspect} rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition`}
          >
            {uploading ? '...' : <Upload size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [dragIdx, setDragIdx] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAllAdmin();
      setServices(res.data.data || []);
    } catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const resetForm = () => { setForm({ ...EMPTY_FORM }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title required'); return; }

    try {
      const data = {
        ...form,
        slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        order: editing ? undefined : services.length,
      };

      if (editing) {
        await servicesAPI.update(editing, data);
        toast.success('Service updated');
      } else {
        await servicesAPI.create(data);
        toast.success('Service created');
      }
      resetForm();
      fetchServices();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (s) => {
    const parse = (v) => {
      if (!v) return '';
      if (typeof v === 'string') {
        try { return JSON.parse(v).join('\n'); } catch { return v; }
      }
      if (Array.isArray(v)) return v.join('\n');
      return '';
    };
    setForm({
      title: s.title || '',
      shortDescription: s.shortDescription || '',
      description: s.description || '',
      fullDescription: s.fullDescription || '',
      icon: s.icon || '',
      heroImage: s.heroImage || '',
      galleryImages: parse(s.galleryImages),
      technologies: parse(s.technologies),
      features: parse(s.features),
      tools: parse(s.tools),
      process: s.process || '',
      liveUrl: s.liveUrl || '',
      githubUrl: s.githubUrl || '',
      docsUrl: s.docsUrl || '',
      caseStudyUrl: s.caseStudyUrl || '',
      buttonText: s.buttonText || 'Live Demo',
      buttonColor: s.buttonColor || '#111111',
      accentColor: s.accentColor || '#111111',
      enabled: s.enabled !== false,
      order: s.order || 0,
    });
    setEditing(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await servicesAPI.delete(id); toast.success('Deleted'); fetchServices(); }
    catch { toast.error('Failed'); }
  };

  const handleToggle = async (s) => {
    try { await servicesAPI.update(s.id, { enabled: !s.enabled }); fetchServices(); }
    catch { toast.error('Failed'); }
  };

  const handleMove = async (idx, dir) => {
    const newList = [...services];
    const swap = idx + dir;
    if (swap < 0 || swap >= newList.length) return;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    try {
      for (let i = 0; i < newList.length; i++) {
        await servicesAPI.update(newList[i].id, { order: i });
      }
      fetchServices();
    } catch { toast.error('Failed'); }
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const list = [...services];
    const item = list.splice(dragIdx, 1)[0];
    list.splice(idx, 0, item);
    setServices(list);
    setDragIdx(idx);
  };
  const handleDragEnd = async () => {
    setDragIdx(null);
    try {
      for (let i = 0; i < services.length; i++) {
        await servicesAPI.update(services[i].id, { order: i });
      }
      fetchServices();
    } catch { toast.error('Failed'); }
  };

  const toList = (v) => {
    if (!v) return [];
    if (typeof v === 'string') { try { return JSON.parse(v); } catch { return v.split('\n').filter(Boolean); } }
    if (Array.isArray(v)) return v;
    return [];
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Services</h2>
          <p className="text-sm text-slate-400 mt-1">{services.length} services — prism has {Math.max(3, services.length)} faces</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-3xl mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{editing ? 'Edit Service' : 'New Service'}</h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" required />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Short Description (shown on prism face)</label>
              <input value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Short Description (search/preview)</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Full Description (shown in detail page)</label>
              <textarea value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} rows={5}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            {/* Images */}
            <div className="col-span-2 flex gap-4">
              <ImageUpload value={form.icon} onChange={v => setForm({...form, icon: v})} label="Icon (face)" />
              <ImageUpload value={form.heroImage} onChange={v => setForm({...form, heroImage: v})} label="Hero Image" aspect="w-32 h-16" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Gallery Images (one URL per line)</label>
              <textarea value={form.galleryImages} onChange={e => setForm({...form, galleryImages: e.target.value})} rows={3}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Technologies (one per line)</label>
              <textarea value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} rows={3}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Features (one per line)</label>
              <textarea value={form.features} onChange={e => setForm({...form, features: e.target.value})} rows={3}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Tools (one per line)</label>
              <textarea value={form.tools} onChange={e => setForm({...form, tools: e.target.value})} rows={2}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Development Process</label>
              <textarea value={form.process} onChange={e => setForm({...form, process: e.target.value})} rows={3}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>

            {/* Links */}
            <div className="col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Live Demo URL</label>
                <input value={form.liveUrl} onChange={e => setForm({...form, liveUrl: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                <input value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Docs URL</label>
                <input value={form.docsUrl} onChange={e => setForm({...form, docsUrl: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Case Study URL</label>
                <input value={form.caseStudyUrl} onChange={e => setForm({...form, caseStudyUrl: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
              </div>
            </div>

            {/* Button settings */}
            <div className="col-span-2 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Button Text</label>
                <input value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Button Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.buttonColor} onChange={e => setForm({...form, buttonColor: e.target.value})}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <input value={form.buttonColor} onChange={e => setForm({...form, buttonColor: e.target.value})}
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.accentColor} onChange={e => setForm({...form, accentColor: e.target.value})}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <input value={form.accentColor} onChange={e => setForm({...form, accentColor: e.target.value})}
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition">
              <Save size={16} /> {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-800 transition">Cancel</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {services.map((s, idx) => (
          <div key={s.id} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
            className={`bg-slate-900/50 border rounded-xl p-3 group transition-all ${dragIdx === idx ? 'border-white/30 opacity-60' : 'border-slate-800'}`}>
            <div className="flex items-center gap-3">
              <div className="cursor-grab text-slate-600 hover:text-slate-400"><GripVertical size={16} /></div>

              {s.icon ? (
                <img src={s.icon} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500">{idx + 1}</div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm">{s.title}</h4>
                <p className="text-xs text-slate-500 truncate">{s.shortDescription || s.description}</p>
              </div>

              <div className="flex items-center gap-0.5">
                <button onClick={() => handleMove(idx, -1)} disabled={idx === 0} className="p-1 text-slate-600 hover:text-white disabled:opacity-20"><ChevronUp size={12} /></button>
                <button onClick={() => handleMove(idx, 1)} disabled={idx === services.length - 1} className="p-1 text-slate-600 hover:text-white disabled:opacity-20"><ChevronDown size={12} /></button>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleToggle(s)} className={`p-1.5 rounded-lg ${s.enabled ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-800'}`}>
                  {s.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button onClick={() => handleEdit(s)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No services yet.</p>}
    </div>
  );
}
