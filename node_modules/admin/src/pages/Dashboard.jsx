import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    { label: 'Hero', path: '/admin/hero' },
    { label: 'About', path: '/admin/about' },
    { label: 'Skills', path: '/admin/skills' },
    { label: 'Projects', path: '/admin/projects' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <h1 className="text-2xl font-bold mb-12 text-cyan-400">Admin</h1>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800 transition"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Projects', value: '15' },
            { label: 'Skills', value: '25' },
            { label: 'Messages', value: '12' },
            { label: 'Views', value: '5.4K' },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <p className="text-slate-400 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
