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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-[#27232D] border border-[#DED7E2] dark:border-[#403846] rounded-2xl p-5 shadow-soft-xs hover:border-[#78649D]/50 hover:shadow-soft transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAE3F3] dark:bg-[#B9A4DF]/15 text-[#78649D] dark:text-[#B9A4DF] border border-[#DED7E2] dark:border-[#403846] flex items-center justify-center mb-4">
              <IconComp size={18} />
            </div>
            <h4 className="text-base font-bold text-[#29262D] dark:text-[#F6F2F8] mb-2">{card.title}</h4>
            <p className="text-sm text-[#625D66] dark:text-[#C4BCCB] leading-relaxed font-normal">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}