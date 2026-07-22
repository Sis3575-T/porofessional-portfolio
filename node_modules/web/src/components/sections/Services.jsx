import { Suspense, useEffect, useRef, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { usePortfolio } from "../../context/PortfolioContext";
import { ServiceViewerProvider, useServiceViewer } from "../../context/ServiceViewerContext";
import ServicePrism from "../three/ServicePrism";
import { X, ExternalLink, Github, MessageSquare } from "lucide-react";

const defaultServices = [
  {
    id: "svc-1",
    title: "Full Stack Web Development",
    shortDescription: "End-to-end web applications with modern architecture.",
    description: "End-to-end web applications with modern architecture.",
    fullDescription: "I build complete web applications from concept to deployment. Using React, Next.js, Node.js, and modern databases, I create scalable products that feel polished from day one.",
    features: ["React & Next.js interfaces", "Node.js & Express APIs", "MongoDB & PostgreSQL databases", "Real-time features", "Authentication & authorization", "Automated testing"],
    technologies: ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    tools: ["VS Code", "Git", "Docker", "Vercel", "AWS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "svc-2",
    title: "UI/UX Design & Implementation",
    shortDescription: "Beautiful interfaces with smooth interactions.",
    description: "Beautiful interfaces with smooth interactions.",
    fullDescription: "I transform product ideas into elegant, conversion-focused interfaces.",
    features: ["Responsive design systems", "Micro-interactions & animations", "Accessibility (WCAG 2.1)", "Design-to-code workflow", "Performance-conscious UI", "Component libraries"],
    technologies: ["React", "Framer Motion", "Tailwind CSS", "Figma", "Storybook", "CSS Modules"],
    tools: ["Figma", "Adobe XD", "Storybook", "Chromatic"],
  },
  {
    id: "svc-3",
    title: "Cloud & DevOps",
    shortDescription: "Infrastructure that scales with your product.",
    description: "Infrastructure that scales with your product.",
    fullDescription: "I set up and manage cloud infrastructure, CI/CD pipelines, and monitoring systems.",
    features: ["AWS/GCP cloud architecture", "Docker containerization", "CI/CD pipelines", "Monitoring & alerting", "Auto-scaling", "Security hardening"],
    technologies: ["AWS", "Docker", "GitHub Actions", "Nginx", "Linux", "Terraform"],
    tools: ["AWS Console", "Docker Desktop", "GitHub Actions", "Grafana"],
  },
  {
    id: "svc-4",
    title: "AI & Machine Learning",
    shortDescription: "Intelligent features powered by modern AI.",
    description: "Intelligent features powered by modern AI.",
    fullDescription: "I integrate AI capabilities into web applications.",
    features: ["LLM integration (GPT, Claude)", "Natural language processing", "Image recognition", "Recommendation systems", "AI-powered search", "Automated content generation"],
    technologies: ["Python", "TensorFlow", "OpenAI API", "LangChain", "FastAPI", "Hugging Face"],
    tools: ["Jupyter", "Google Colab", "Hugging Face", "OpenAI"],
  },
];

function ServiceCard({ service, onClose }) {
  const safeParse = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
    return [];
  };
  const features = safeParse(service.features);
  const technologies = safeParse(service.technologies);
  const gallery = safeParse(service.galleryImages);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-xl mx-4 rounded-2xl border overflow-hidden shadow-2xl"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          maxHeight: "80vh",
          animation: "slideFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{service.title}</h2>
              <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>{service.shortDescription}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition">
              <X size={18} />
            </button>
          </div>

          {service.heroImage && (
            <img src={service.heroImage} alt={service.title} className="w-full h-40 object-cover rounded-xl mb-4" style={{ border: "1px solid var(--border)" }} />
          )}

          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{service.fullDescription || service.description}</p>

          {technologies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium rounded-lg" style={{ color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {features.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Features</h4>
              <ul className="space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                    <span className="mt-1" style={{ color: "var(--accent)" }}>&bull;</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Gallery</h4>
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-lg" style={{ border: "1px solid var(--border)" }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap mt-4">
            {service.liveUrl && (
              <a href={service.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {service.githubUrl && (
              <a href={service.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-80 transition"
                style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                <Github size={14} /> GitHub
              </a>
            )}
            <button onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-80 transition"
              style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
              <MessageSquare size={14} /> Contact
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ServicesContent() {
  const { services } = usePortfolio();
  const { setServices, doorOpen, activeIndex, closeDoor, animationDone } = useServiceViewer();
  const serviceList = services && services.length > 0 ? services.slice(0, 4) : defaultServices;
  const serviceListRef = useRef(serviceList);
  serviceListRef.current = serviceList;
  const canvasContainerRef = useRef(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setServices(serviceListRef.current);
  }, [services, setServices]);

  useEffect(() => {
    if (doorOpen && activeIndex >= 0) {
      const timer = setTimeout(() => setShowCard(true), 700);
      return () => clearTimeout(timer);
    } else {
      setShowCard(false);
    }
  }, [doorOpen, activeIndex]);

  const handleClose = useCallback(() => {
    setShowCard(false);
    setTimeout(() => {
      closeDoor();
      setTimeout(animationDone, 800);
    }, 300);
  }, [closeDoor, animationDone]);

  const handlePointerMove = useCallback((e) => {
    if (doorOpen) return;
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const maxDist = Math.min(rect.width, rect.height) * 0.35;
    container.style.pointerEvents = dist < maxDist ? "auto" : "none";
  }, [doorOpen]);

  const activeService = doorOpen && activeIndex >= 0 ? serviceList[activeIndex] : null;

  return (
    <section id="services" className="py-4 relative" style={{ background: "var(--section-services)" }}>
      {!doorOpen && (
        <div className="px-4 sm:px-8 relative mb-4">
          <p className="text-center text-sm font-medium tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>What I Do</p>
          <h2 className="text-center text-4xl font-bold" style={{ color: "var(--text-primary)" }}>Services <span style={{ color: "var(--accent)" }}>I Offer</span></h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: "var(--accent)" }} />
        </div>
      )}

      <div
        ref={canvasContainerRef}
        className="relative w-full"
        style={{ height: "min(90vh, 850px)", pointerEvents: doorOpen ? "none" : "none" }}
        onPointerMove={handlePointerMove}
      >
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        }>
          <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }} style={{ background: "transparent" }}>
            <ServicePrism services={serviceList} />
          </Canvas>
        </Suspense>

        {showCard && activeService && (
          <ServiceCard service={activeService} onClose={handleClose} />
        )}
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <ServiceViewerProvider>
      <ServicesContent />
    </ServiceViewerProvider>
  );
}
