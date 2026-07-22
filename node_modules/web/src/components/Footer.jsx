import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const { settings } = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const socialLinks = settings?.socialLinks
    ? typeof settings.socialLinks === "string"
      ? JSON.parse(settings.socialLinks)
      : settings.socialLinks
    : {};

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="ft-footer" ref={ref}>
      <div className="ft-inner">
        <motion.div
          className="ft-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Brand */}
          <div className="ft-brand">
            <h3 className="ft-name">SISAY TEMESGEN</h3>
            <p className="ft-subtitle">Full Stack Developer | AI Enthusiast</p>
            <p className="ft-desc">
              Creating responsive, scalable, and user-focused digital solutions
              using modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="ft-links">
            <h4 className="ft-heading">Quick Links</h4>
            <nav className="ft-nav">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="ft-link">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="ft-connect">
            <h4 className="ft-heading">Connect</h4>
            <div className="ft-socials">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="ft-social"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              )}
              {!socialLinks.github && !socialLinks.linkedin && !settings?.contactEmail && (
                <>
                  <a href="#" className="ft-social" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                  <a href="#" className="ft-social" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="ft-social" aria-label="Email">
                    <Mail size={18} />
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="ft-bottom">
          <p className="ft-copyright">
            &copy; {new Date().getFullYear()} Sisay Temesgen. All rights reserved.
          </p>
          <p className="ft-credit">Designed &amp; Developed by Sisay</p>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="ft-scroll-top"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
