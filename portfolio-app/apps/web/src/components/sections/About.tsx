export default function About() {
  return (
    <section id="about" className="py-24">
      <h2 className="text-center mb-16 text-white">About Me</h2>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="card p-8 glow-accent">
          <div className="bg-slate-800 rounded-lg h-80 flex items-center justify-center">
            <span className="text-slate-400">Profile Image</span>
          </div>
        </div>
        <div>
          <p className="text-slate-300 mb-6">
            I'm a full-stack developer with 5+ years of experience building web applications.
            Passionate about clean code, user experience, and solving complex problems.
          </p>
          <div className="space-y-4">
            <p className="text-slate-400">📍 Location: San Francisco, USA</p>
            <p className="text-slate-400">💼 Experience: 5+ Years</p>
            <p className="text-slate-400">🎓 Education: Computer Science</p>
          </div>
          <button className="btn btn-primary mt-8">Download CV</button>
        </div>
      </div>
    </section>
  );
}
