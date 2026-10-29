import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Code2, Server, Layout, Database, Check, ArrowRight, ExternalLink, MessageSquare } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const serviceIcons = {
  web: Code2,
  api: Server,
  ui: Layout,
  db: Database,
  fullstack: Code2,
};

const defaultServices = [
  {
    id: "srv-1",
    title: "Full Stack Web Applications",
    shortDescription: "End-to-end modern web applications built for speed, responsiveness, and scale.",
    description: "Architecting complete web solutions from relational/NoSQL databases to dynamic, component-driven user interfaces. Specializing in React, Node.js, Express, and PostgreSQL with clean code and high performance.",
    features: JSON.stringify([
      "Custom responsive frontend architecture",
      "Secure Node.js & Express REST APIs",
      "Database schema modeling with PostgreSQL/MongoDB",
      "SEO, accessibility & mobile optimization",
    ]),
    technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
    iconType: "fullstack",
  },
  {
    id: "srv-2",
    title: "REST APIs & Backend Systems",
    shortDescription: "Reliable, high-throughput backend services and secure microservices.",
    description: "Designing robust server-side architectures featuring role-based authentication, request validation, rate limiting, connection pooling, and thorough error handling.",
    features: JSON.stringify([
      "Scalable RESTful endpoint design",
      "JWT authentication & session security",
      "Query optimization & database connection pooling",
      "Third-party API integrations & webhooks",
    ]),
    technologies: JSON.stringify(["Node.js", "Express", "PostgreSQL", "MongoDB", "Prisma"]),
    iconType: "api",
  },
  {
    id: "srv-3",
    title: "Frontend Engineering & UI/UX",
    shortDescription: "Soft, accessible, and high-performance user interfaces.",
    description: "Developing modern, clean user experiences with strict adherence to typography, contrast, keyboard accessibility, smooth transitions, and responsive mobile-first layouts.",
    features: JSON.stringify([
      "Reusable component design systems",
      "Cross-browser and responsive testing",
      "Light and dark theme persistence",
      "Fast rendering with minimal bundle overhead",
    ]),
    technologies: JSON.stringify(["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"]),
    iconType: "ui",
  },
  {
    id: "srv-4",
    title: "Database Modeling & Optimization",
    shortDescription: "Structured database schemas, migrations, and efficient queries.",
    description: "Structuring relational and document data stores with proper indexing, data integrity rules, ORM mappings, and performance optimization.",
    features: JSON.stringify([
      "PostgreSQL relational schema modeling",
      "MongoDB document architecture",
      "Prisma ORM integration & migrations",
      "Query tuning & connection management",
    ]),
    technologies: JSON.stringify(["PostgreSQL", "MongoDB", "Prisma", "SQL"]),
    iconType: "db",
  },
];

function safeParse(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function Services() {
  const { services } = usePortfolio();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const serviceList = services && services.length > 0 ? services : defaultServices;

  const handleInquire = (serviceTitle) => {
    navigate("/contact", { state: { subject: `Inquiry: ${serviceTitle}` } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="services"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-services)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
              Engineering Solutions
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight">
            Services &amp; Capabilities
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {serviceList.map((service, index) => {
            const features = safeParse(service.features);
            const technologies = safeParse(service.technologies);
            const Icon =
              serviceIcons[service.iconType] ||
              (index === 0 ? Code2 : index === 1 ? Server : index === 2 ? Layout : Database);

            return (
              <motion.div
                key={service.id || index}
                className="bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-soft-xs hover:border-[#2563EB]/50 hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.25) }}
              >
                <div>
                  {/* Top Bar with Icon */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                      <Icon size={20} />
                    </div>
                    {service.liveUrl && (
                      <a
                        href={service.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#475569] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#3B82F6] transition-colors"
                      >
                        <span>Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] mb-5 font-normal">
                    {service.description || service.shortDescription}
                  </p>

                  {/* Features list */}
                  {features.length > 0 && (
                    <div className="mb-5 pt-3.5 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] mb-2.5">
                        Key Deliverables
                      </h4>
                      <ul className="space-y-1.5">
                        {features.map((item, fIdx) => (
                          <li key={fIdx} className="text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={11} strokeWidth={3} />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer: Tech badges + Inquire CTA */}
                <div className="pt-4 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]">
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#F8FAFC] dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleInquire(service.title)}
                    className="w-full py-2.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#EFF6FF] dark:bg-[#111827] dark:hover:bg-[#161F30] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <MessageSquare size={14} className="text-[#2563EB] dark:text-[#3B82F6]" />
                    <span>Inquire About {service.title.split(" ")[0]}</span>
                    <ArrowRight size={13} className="text-[#475569] dark:text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
