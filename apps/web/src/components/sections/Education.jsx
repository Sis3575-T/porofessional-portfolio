export default function Education() {
  const education = [
    {
      school: 'University of Tech',
      degree: 'B.S. Computer Science',
      year: '2022',
    },
  ];

  return (
    <section id="education" className="py-24">
      <h2 className="text-center mb-16 text-white">Education</h2>
      <div className="max-w-2xl mx-auto">
        {education.map((edu, idx) => (
          <div key={idx} className="card p-6 mb-6 border-l-4 border-purple-400">
            <h3 className="text-xl font-semibold">{edu.degree}</h3>
            <p className="text-slate-400">{edu.school}</p>
            <p className="text-sm text-slate-500 mt-2">{edu.year}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
