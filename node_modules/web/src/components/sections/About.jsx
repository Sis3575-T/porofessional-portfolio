import { Download, Mail, MapPin, Phone, Globe, Briefcase } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function About() {
  const { about, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-slate-800 rounded-xl" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const details = [
    { icon: User, label: "Name", value: about?.name || "Sisay Temesgen" },
    { icon: Mail, label: "Email", value: about?.email || "sisay@example.com" },
    { icon: MapPin, label: "Location", value: about?.location || "Addis Ababa, Ethiopia" },
    { icon: Globe, label: "Languages", value: about?.languages || "English, Amharic" },
    { icon: Briefcase, label: "Experience", value: `${about?.yearsOfExperience || 5}+ Years` },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          About <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Me</span>
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          A passionate developer dedicated to crafting digital experiences
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-300" />
            <div className="relative bg-slate-900 rounded-2xl p-8 flex items-center justify-center h-96 border border-slate-800">
              <div className="text-center">
                <div className="text-8xl mb-4">👨‍💻</div>
                <p className="text-slate-400">Developer Photo</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed text-lg">
                {about?.biography || "I'm a full-stack developer crafting digital experiences."}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {about?.summary || "Specialized in modern web technologies."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-800">
                  <Icon size={18} className="text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm text-slate-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href={about?.downloadCVUrl || "#"}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 rounded-lg font-semibold hover:from-cyan-400 hover:to-cyan-500 transition-all flex items-center gap-2"
              >
                <Download size={18} />
                Download CV
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-semibold hover:border-cyan-500 hover:text-cyan-400 transition-all"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function User(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
