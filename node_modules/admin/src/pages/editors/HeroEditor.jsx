import { useState } from 'react';

export default function HeroEditor() {
  const [formData, setFormData] = useState({
    name: 'Developer Name',
    title: 'Full Stack Developer',
    description: 'Building amazing experiences',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save to backend
    alert('Hero section updated!');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Hero Section</h1>
      <form onSubmit={handleSubmit} className="space-y-6 card">
        <div>
          <label className="block text-sm mb-2">Developer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Professional Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
        </div>
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}
