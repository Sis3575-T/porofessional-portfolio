import { Code, Server, Palette, Cloud, ArrowRight } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

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
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <h2 className="text-center mb-4 text-white">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Services</span> I Offer
        </h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Professional solutions tailored to your needs
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.title] || Code;
            const features = service.features ? JSON.parse(service.features) : [];
            return (
              <div
                key={service.id}
                className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-cyan-500/30 transition-all hover:-translate-y-2 flex flex-col"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                  <Icon className="text-cyan-400" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">{service.description}</p>
                {features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <button className="text-cyan-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
