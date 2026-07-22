import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { ServiceViewerProvider, useServiceViewer } from "../../context/ServiceViewerContext";
import ServicePrism from "../three/ServicePrism";
import ServiceViewer from "../ServiceViewer";

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
    title: "API Development",
    shortDescription: "Reliable, documented APIs for web and mobile.",
    description: "Reliable, documented APIs for web and mobile.",
    fullDescription: "I design and build RESTful and GraphQL APIs that are secure, well-documented, and performant.",
    features: ["RESTful API design", "GraphQL schemas", "Authentication (JWT, OAuth)", "Rate limiting & caching", "API documentation", "Database optimization"],
    technologies: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis", "Docker"],
    tools: ["Postman", "Swagger", "GitHub Actions"],
  },
  {
    id: "svc-3",
    title: "UI/UX Design & Implementation",
    shortDescription: "Beautiful interfaces with smooth interactions.",
    description: "Beautiful interfaces with smooth interactions.",
    fullDescription: "I transform product ideas into elegant, conversion-focused interfaces.",
    features: ["Responsive design systems", "Micro-interactions & animations", "Accessibility (WCAG 2.1)", "Design-to-code workflow", "Performance-conscious UI", "Component libraries"],
    technologies: ["React", "Framer Motion", "Tailwind CSS", "Figma", "Storybook", "CSS Modules"],
    tools: ["Figma", "Adobe XD", "Storybook", "Chromatic"],
  },
  {
    id: "svc-4",
    title: "Cloud & DevOps",
    shortDescription: "Infrastructure that scales with your product.",
    description: "Infrastructure that scales with your product.",
    fullDescription: "I set up and manage cloud infrastructure, CI/CD pipelines, and monitoring systems.",
    features: ["AWS/GCP cloud architecture", "Docker containerization", "CI/CD pipelines", "Monitoring & alerting", "Auto-scaling", "Security hardening"],
    technologies: ["AWS", "Docker", "GitHub Actions", "Nginx", "Linux", "Terraform"],
    tools: ["AWS Console", "Docker Desktop", "GitHub Actions", "Grafana"],
  },
  {
    id: "svc-5",
    title: "AI & Machine Learning",
    shortDescription: "Intelligent features powered by modern AI.",
    description: "Intelligent features powered by modern AI.",
    fullDescription: "I integrate AI capabilities into web applications.",
    features: ["LLM integration (GPT, Claude)", "Natural language processing", "Image recognition", "Recommendation systems", "AI-powered search", "Automated content generation"],
    technologies: ["Python", "TensorFlow", "OpenAI API", "LangChain", "FastAPI", "Hugging Face"],
    tools: ["Jupyter", "Google Colab", "Hugging Face", "OpenAI"],
  },
];

function ServicesContent() {
  const { services } = usePortfolio();
  const { setServices, isOpen } = useServiceViewer();
  const serviceList = services && services.length > 0 ? services : defaultServices;

  useEffect(() => {
    setServices(serviceList);
  }, [serviceList, setServices]);

  return (
    <section id="services" className="py-4 overflow-hidden relative" style={{ background: "#0c1929" }}>
      {!isOpen && (
        <div className="px-4 sm:px-8 relative mb-4">
          <p className="text-center text-sm font-medium text-blue-400 tracking-widest uppercase mb-3">
            What I Do
          </p>
          <h2 className="text-center text-white text-4xl font-bold">
            Services <span className="text-blue-400">I Offer</span>
          </h2>
          <div className="w-16 h-1 bg-blue-500 rounded-full mx-auto mt-4" />
        </div>
      )}

      <div
        className="relative w-full transition-all duration-700"
        style={{ height: isOpen ? "0" : "min(80vh, 700px)" }}
      >
        {!isOpen && (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 0, 9], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: false }}
              style={{ background: "#0c1929" }}
            >
              <ServicePrism services={serviceList} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <AnimatePresence>
        {isOpen && <ServiceViewer />}
      </AnimatePresence>
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
