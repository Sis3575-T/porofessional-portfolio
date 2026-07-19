import { motion } from "framer-motion";
import { Code, Layout, Shield, Lightbulb, Cpu, Palette, Zap, Layers } from "lucide-react";

const iconOptions = {
  code: Code,
  layout: Layout,
  shield: Shield,
  lightbulb: Lightbulb,
  cpu: Cpu,
  palette: Palette,
  zap: Zap,
  layers: Layers,
};

const defaultCards = [
  { icon: "code", title: "Clean Code", description: "Writing maintainable, well-documented code that follows industry best practices and design patterns." },
  { icon: "layers", title: "Scalable Architecture", description: "Designing systems that grow seamlessly with your business needs and user demands." },
  { icon: "lightbulb", title: "Problem Solving", description: "Tackling complex challenges with creative, efficient solutions backed by deep technical expertise." },
  { icon: "palette", title: "Modern UI/UX", description: "Crafting beautiful, intuitive interfaces that deliver exceptional user experiences." },
];

export default function FeatureCard({ cards: cardsJson }) {
  let cards = defaultCards;
  if (cardsJson) {
    try {
      const parsed = typeof cardsJson === "string" ? JSON.parse(cardsJson) : cardsJson;
      if (Array.isArray(parsed) && parsed.length > 0) cards = parsed;
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.slice(0, 4).map((card, i) => {
        const IconComp = iconOptions[card.icon] || Code;
        return (
          <motion.div
            key={card.title + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            whileHover={{
              y: -6,
              borderColor: "rgba(6, 182, 212, 0.3)",
              transition: { duration: 0.2 },
            }}
            className="group bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-cyan-500/5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
              <IconComp size={20} className="text-cyan-400" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">{card.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
