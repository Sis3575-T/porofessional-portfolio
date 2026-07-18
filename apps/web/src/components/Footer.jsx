import { Github, Linkedin, Twitter, ArrowUp, Mail } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Footer() {
  const { settings } = usePortfolio();
  const socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : {};
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Portfolio
            </h3>
            <p className="text-slate-400 max-w-md">
              Building digital experiences with modern technology. Available for freelance projects and full-time opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Skills", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-slate-400 hover:text-cyan-400 transition text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                  <Github size={20} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                  <Twitter size={20} />
                </a>
              )}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`}
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition">
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {year} Portfolio Pro. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
