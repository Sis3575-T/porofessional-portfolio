import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { educationAPI } from '../../services/api';
import {
  Plus, Save, Trash2, Pencil, X, Upload, GripVertical,
  Eye, EyeOff, ChevronDown, ChevronUp, Award, BookOpen,
  MapPin, Calendar, GraduationCap, ExternalLink,
} from 'lucide-react';

const emptyForm = {
  institution: '', degree: '', field: '', description: '',
  startDate: '', endDate: '', isCurrent: false, gpa: '',
  location: '', achievements: '', technologies: '', courses: '',
  certificateUrl: '', logo: '', enabled: true, order: 0,
};

export default function EducationEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [expandedId, setExpandedId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await educationAPI.getAll();
      setItems(res.data.data || []);
    } catch {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        achievements: form.achievements || null,
        technologies: form.technologies || null,
        courses: form.courses || null,
        gpa: form.gpa || null,
        location: form.location || null,
        logo: form.logo || null,
        certificateUrl: form.certificateUrl || null,
        endDate: form.isCurrent ? null : form.endDate || null,
      };
      if (editing) {
        await educationAPI.update(editing, payload);
        toast.success('Education updated');
      } else {
        await educationAPI.create(payload);
        toast.success('Education created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ ...emptyForm });
      fetchItems();
    } catch (err) {
      toast.error('Failed to save education');
    }
  };

  const handleEdit = (item) => {
    setForm({
      institution: item.institution || '',
      degree: item.degree || '',
      field: item.field || '',
      description: item.description || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      isCurrent: item.isCurrent || false,
      gpa: item.gpa || '',
      location: item.location || '',
      achievements: Array.isArray(item.achievements)
        ? item.achievements.join(', ')
        : item.achievements || '',
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : item.technologies || '',
      courses: Array.isArray(item.courses)
        ? item.courses.join(', ')
        : item.courses || '',
      certificateUrl: item.certificateUrl || '',
      logo: item.logo || '',
      enabled: item.enabled !== undefined ? item.enabled : true,
      order: item.order || 0,
    });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      await educationAPI.delete(id);
      toast.success('Deleted');
      fetchItems();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (id, currentEnabled) => {
    try {
      await educationAPI.update(id, { enabled: !currentEnabled });
      toast.success(currentEnabled ? 'Hidden' : 'Visible');
      fetchItems();
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleMove = async (id, direction) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    [updated[idx].order, updated[targetIdx].order] = [updated[targetIdx].order, updated[idx].order];
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    setItems(updated);
    try {
      await educationAPI.update(id, { order: updated[idx].order });
      await educationAPI.update(updated[targetIdx].id, { order: updated[targetIdx].order });
    } catch {
      toast.error('Failed to reorder');
      fetchItems();
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div className="animate-pulse text-slate-400">Loading education...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Education</h2>
          <p className="text-sm text-slate-500 mt-1">{items.length} education entries</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ ...emptyForm }); }}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{editing ? 'Edit' : 'New'} Education</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="p-1 text-slate-500 hover:text-slate-900 transition">
              <X size={18} />
            </button>
          </div>

          {/* Row 1: Institution + Degree */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Institution *</label>
              <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="University name" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Degree *</label>
              <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="BSc, MSc, Certificate..." required />
            </div>
          </div>

          {/* Row 2: Field */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Field of Study</label>
            <input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Computer Science, Software Engineering..." />
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Describe your academic experience..." />
          </div>

          {/* Row 4: Dates + Current */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.isCurrent}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 disabled:opacity-40" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isCurrent}
                  onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })}
                  className="w-4 h-4 rounded border-slate-200 bg-slate-100 text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-slate-600">Currently studying here</span>
              </label>
            </div>
          </div>

          {/* Row 5: GPA + Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">GPA (optional)</label>
              <input value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="3.7/4.0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                placeholder="City, Country" />
            </div>
          </div>

          {/* Row 6: Logo URL */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Logo URL</label>
            <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/logo.png" />
          </div>

          {/* Row 7: Achievements (comma separated) */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5"><Award size={12} /> Achievements (comma separated)</span>
            </label>
            <input value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Dean's List, Best Project, Graduated with Distinction" />
          </div>

          {/* Row 8: Technologies (comma separated) */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Technologies (comma separated)</label>
            <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="React, Node.js, Python, SQL" />
          </div>

          {/* Row 9: Courses (comma separated) */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5"><BookOpen size={12} /> Relevant Courses (comma separated)</span>
            </label>
            <input value={form.courses} onChange={(e) => setForm({ ...form, courses: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Data Structures, Operating Systems, Networks" />
          </div>

          {/* Row 10: Certificate URL */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5"><ExternalLink size={12} /> Certificate URL (optional)</span>
            </label>
            <input value={form.certificateUrl} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/certificate.pdf" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="btn-primary text-sm flex items-center gap-2">
              <Save size={16} /> {editing ? 'Update' : 'Create'}
            </button>
            <button type="button"
              onClick={() => { setShowForm(false); setEditing(null); setForm({ ...emptyForm }); }}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Education List */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id}
            className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
            {/* Item Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMove(item.id, 'up')} disabled={idx === 0}
                  className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => handleMove(item.id, 'down')} disabled={idx === items.length - 1}
                  className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition">
                  <ChevronDown size={14} />
                </button>
              </div>

              {item.logo ? (
                <img src={item.logo} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <GraduationCap size={18} className="text-blue-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 text-sm truncate">{item.degree}</h4>
                <p className="text-xs text-blue-400 truncate">{item.institution}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  {item.startDate && (
                    <span>{formatDate(item.startDate)} – {item.isCurrent ? 'Present' : formatDate(item.endDate)}</span>
                  )}
                  {item.location && <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => handleToggle(item.id, item.enabled)}
                  className={`p-1.5 rounded-lg transition ${item.enabled ? 'text-green-400 hover:bg-green-500/10' : 'text-slate-400 hover:bg-slate-100'}`}
                  title={item.enabled ? 'Visible' : 'Hidden'}>
                  {item.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
                  <ChevronDown size={14} className={`transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={() => handleEdit(item)}
                  className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-slate-100 rounded-lg transition opacity-0 group-hover:opacity-100">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-100 rounded-lg transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === item.id && (
              <div className="px-4 pb-4 pt-0 border-t border-slate-200">
                <div className="pt-3 space-y-2 text-xs text-slate-500">
                  {item.field && <p><span className="text-slate-400">Field:</span> {item.field}</p>}
                  {item.gpa && <p><span className="text-slate-400">GPA:</span> {item.gpa}</p>}
                  {item.description && <p className="text-slate-600 leading-relaxed">{item.description}</p>}
                  {item.achievements && (
                    <div>
                      <span className="text-slate-400">Achievements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(item.achievements) ? item.achievements : [item.achievements]).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.technologies && (
                    <div>
                      <span className="text-slate-400">Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(item.technologies) ? item.technologies : [item.technologies]).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.courses && (
                    <div>
                      <span className="text-slate-400">Courses:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(item.courses) ? item.courses : [item.courses]).map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.certificateUrl && (
                    <p>
                      <span className="text-slate-400">Certificate:</span>{' '}
                      <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer"
                        className="text-blue-400 hover:underline">{item.certificateUrl}</a>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
          <p>No education entries yet. Add your first education record.</p>
        </div>
      )}
    </div>
  );
}
