export default function Skills() {
  const skills = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 88 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'Docker', level: 80 },
    { name: 'Tailwind', level: 92 },
  ];

  return (
    <section id="skills" className="py-24">
      <h2 className="text-center mb-16 text-white">Skills</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.name} className="card p-6">
            <h3 className="text-lg font-semibold mb-4">{skill.name}</h3>
            <div className="bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-cyan-purple rounded-full h-2"
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <p className="text-slate-400 text-sm mt-2">{skill.level}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
