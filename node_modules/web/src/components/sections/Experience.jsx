export default function Experience() {
  const experiences = [
    {
      company: 'Tech Company',
      role: 'Senior Developer',
      duration: '2022 - Present',
    },
    {
      company: 'Digital Agency',
      role: 'Frontend Developer',
      duration: '2020 - 2022',
    },
  ];

  return (
    <section id="experience" className="py-24">
      <h2 className="text-center mb-16 text-white">Experience</h2>
      <div className="max-w-2xl mx-auto">
        {experiences.map((exp, idx) => (
          <div key={idx} className="card p-6 mb-6 border-l-4 border-cyan-400">
            <h3 className="text-xl font-semibold">{exp.role}</h3>
            <p className="text-slate-400">{exp.company}</p>
            <p className="text-sm text-slate-500 mt-2">{exp.duration}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
