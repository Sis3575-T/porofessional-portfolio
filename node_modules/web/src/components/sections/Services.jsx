import { motion } from "framer-motion";
import { Code, Server, Palette, Cloud, ArrowRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { AnimatedSection, AnimatedCard } from "../AnimatedSection";

const iconMap = {
  "Full Stack Web Development": Code,
  "REST API Development": Server,
  "UI/UX Implementation": Palette,
  "Deployment & DevOps": Cloud,
};

export default function Services() {
  const { services, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-slate-800 rounded mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-800 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatedSection id="services" theme="services" className="py-32 overflow-hidden" aria-label="Services section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-slate-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What I Do
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Services I Offer
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-slate-400 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Professional solutions tailored to your needs
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.title] || Code;
            const features = service.features ? JSON.parse(service.features) : [];
            return (
              <AnimatedCard key={service.id} index={i} className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-slate-600 transition-all hover:-translate-y-2 flex flex-col">
                <motion.div
                  className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-all"
                  whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                  <Icon className="text-slate-300" size={28} />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">{service.description}</p>
                {features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {features.map((feature, fi) => (
                      <motion.li
                        key={fi}
                        className="flex items-center gap-2 text-sm text-slate-400"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fi * 0.1 }}
                      >
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                )}
                <motion.button
                  className="text-slate-300 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                  whileHover={{ x: 5 }}
                >
                  Learn More <ArrowRight size={14} />
                </motion.button>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
