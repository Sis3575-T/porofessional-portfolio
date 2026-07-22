export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-cyan-400 mb-4 text-lg">Hello, I'm</p>
          <h1 className="text-white mb-6">Developer Name</h1>
          <p className="text-slate-300 text-xl mb-8">
            Full Stack Developer building beautiful digital experiences with modern technology.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary">View My Work</button>
            <button className="btn btn-secondary">Get In Touch</button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-72 h-72 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-slate-700">
            <span className="text-slate-400">3D Scene Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
