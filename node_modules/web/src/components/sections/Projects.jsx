export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application',
      tags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'Project Management Tool',
      description: 'Collaborative project management system',
      tags: ['React', 'Firebase', 'Real-time'],
    },
  ];

  return (
    <section id="projects" className="py-24">
      <h2 className="text-center mb-16 text-white">Projects</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div key={project.title} className="card p-6">
            <div className="bg-slate-800 rounded-lg h-40 mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-slate-400 mb-4">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-700 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
