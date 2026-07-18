export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <h2 className="text-center mb-16 text-white">Get In Touch</h2>
      <div className="max-w-2xl mx-auto">
        <form className="card p-8 space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
