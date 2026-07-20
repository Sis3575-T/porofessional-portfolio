import { Github, Linkedin, Twitter, ArrowUp, Mail } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Footer() {
  const { settings } = usePortfolio();
  const socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : {};
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-white border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Portfolio
            </h3>
            <p className="text-gray-500 max-w-md">
              Building digital experiences with modern technology.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2" aria-label="Quick links">
              {["Home", "About", "Skills", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-500 hover:text-gray-900 transition text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex gap-3" aria-label="Social media links">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="icon-container icon-github"
                  aria-label="GitHub profile">
                  <Github size={18} aria-hidden="true" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="icon-container icon-linkedin"
                  aria-label="LinkedIn profile">
                  <Linkedin size={18} aria-hidden="true" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="icon-container icon-github"
                  aria-label="Twitter profile">
                  <Twitter size={18} aria-hidden="true" />
                </a>
              )}
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`}
                  className="icon-container icon-email"
                  aria-label="Send email">
                  <Mail size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {year} Portfolio Pro. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="icon-container icon-email"
            aria-label="Back to top"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
