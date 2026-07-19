import { motion } from "framer-motion";
import { usePortfolio } from "../../../context/PortfolioContext";
import { AnimatedSection, AnimatedItem } from "../../AnimatedSection";
import Profile3D from "./Profile3D";
import PersonalInfo from "./PersonalInfo";
import ButtonGroup from "./ButtonGroup";
import StatsCard from "./StatsCard";
import FeatureCard from "./FeatureCard";
import Timeline from "./Timeline";
import SkillsPreview from "./SkillsPreview";
import FloatingIcons from "./FloatingIcons";
import { useDeviceDetect } from "../../../hooks/useDeviceDetect";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const paragraphs = [
  "I build production-grade full-stack applications that solve real problems. With deep experience across the entire web stack, I architect systems that scale, perform, and endure — from pixel-perfect frontends to resilient backend services.",
  "Every project starts with understanding the core problem. I believe clean architecture and thoughtful engineering are what separate good software from great software. Whether it's optimizing database queries, designing RESTful APIs, or crafting component libraries, I bring precision and care to every layer.",
  "I thrive at the intersection of design and engineering — translating complex requirements into intuitive, performant experiences. Security, accessibility, and maintainability aren't afterthoughts; they're embedded in how I build from day one.",
  "Beyond the code, I'm a continuous learner who values clear communication and collaborative teamwork. I've shipped products across fintech, e-commerce, and SaaS, working with teams that share a passion for building things that matter.",
];

export default function AboutSection() {
  const { about, experiences, skills, loading } = usePortfolio();
  const { isLowEnd } = useDeviceDetect();

  if (loading) {
    return (
      <section id="about" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="aspect-[3/4] bg-slate-800 rounded-3xl" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const subtitle = about?.subtitle || "ABOUT ME";
  const heading = about?.heading || "Crafting Digital Experiences That Make an Impact";
  const biography = about?.biography || paragraphs.join(" ");
  const profileImage = about?.profileImage || null;
  const glbModel = about?.glbModel || null;
  const statistics = about?.statistics || null;
  const featureCards = about?.featureCards || null;
  const downloadCVUrl = about?.downloadCVUrl || "#";
  const decoration = about?.decoration || null;

  let decorationConfig = {};
  try {
    decorationConfig = typeof decoration === "string" ? JSON.parse(decoration) : (decoration || {});
  } catch {}

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedSection
      id="about"
      className="relative py-32 overflow-hidden"
      aria-label="About section"
    >
      <FloatingIcons count={6} />

      {decorationConfig.grid && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: `${decorationConfig.gridSize || 60}px ${decorationConfig.gridSize || 60}px`,
          }}
        />
      )}

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeSlideUp}
            className="text-sm font-medium text-cyan-400 tracking-[0.2em] uppercase mb-3"
          >
            {subtitle}
          </motion.p>
          <motion.h2
            variants={fadeSlideUp}
            className="text-white max-w-3xl mx-auto"
          >
            {heading}
          </motion.h2>
          <motion.div
            variants={fadeSlideUp}
            className="w-16 h-1 bg-cyan-600 rounded-full mx-auto mt-4 mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-2 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Profile3D
                profileImage={profileImage}
                glbModel={glbModel}
                isLowEnd={isLowEnd}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            <AnimatedItem>
              <div className="space-y-5">
                {paragraphs.map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="text-slate-300 leading-relaxed text-base max-w-[65ch]"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </AnimatedItem>

            <PersonalInfo about={about} />

            <ButtonGroup downloadCVUrl={downloadCVUrl} onContact={scrollToContact} />

            <StatsCard statistics={statistics} />

            <FeatureCard cards={featureCards} />

            <div>
              <motion.h3
                className="text-white mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Professional Journey
              </motion.h3>
              <Timeline experiences={experiences} />
            </div>

            <div>
              <motion.h3
                className="text-white mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Technologies I Work With
              </motion.h3>
              <SkillsPreview skills={skills} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
