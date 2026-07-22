import {
  Github,
  Linkedin,
  Twitter,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Briefcase,
  Sparkles,
  ChevronRight,
  Download,
  Home,
} from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

const defaultNav = [
  { label: "About", href: "#about", icon: Home },
  { label: "Skills", href: "#skills", icon: Sparkles },
  { label: "Projects", href: "#projects", icon: Briefcase },
  { label: "Services", href: "#services", icon: Sparkles },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
];

const defaultServices = [
  "Web Development",
  "Frontend Engineering",
  "Backend Development",
  "Full Stack Delivery",
  "UI Design",
  "API Development",
];

const footerIconClass =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition duration-300 hover:-translate-y-1 hover:text-slate-900";

export default function Footer() {
  const { settings, services } = usePortfolio();
  const socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : {};
  const year = new Date().getFullYear();

  let footerConfig = {};
  try {
    footerConfig = settings?.footerConfig ? JSON.parse(settings.footerConfig) : {};
  } catch {
    footerConfig = {};
  }

  const brandName = footerConfig.brandName || settings?.name || "Sisay Temesgen";
  const footerTitle = footerConfig.title || "Portfolio";
  const description =
    footerConfig.description ||
    "I design and build polished digital experiences with clarity, precision, and calm execution.";

  const navigation = footerConfig.navigation?.length
    ? footerConfig.navigation
    : defaultNav;

  const serviceItems = footerConfig.services?.length
    ? footerConfig.services
    : services?.slice(0, 6).map((service) => service.title || service.name || "Service") || defaultServices;

  const contactItems = footerConfig.contactItems?.length
    ? footerConfig.contactItems
    : [
        {
          label: "Email",
          value: settings?.contactEmail || "hello@sisay.dev",
          icon: Mail,
          href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : "mailto:hello@sisay.dev",
        },
        {
          label: "Phone",
          value: settings?.phone || "+1 (555) 010-2048",
          icon: Phone,
          href: settings?.phone ? `tel:${settings.phone}` : "tel:+15550102048",
        },
        {
          label: "Location",
          value: settings?.location || "Remote • Worldwide",
          icon: MapPin,
          href: null,
        },
        {
          label: "Availability",
          value: settings?.availability || "Open for select projects",
          icon: Clock3,
          href: null,
        },
      ];

  const copyrightText = footerConfig.copyright || `© ${year} ${brandName}. All Rights Reserved.`;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-slate-200 bg-white" role="contentinfo"
      style={{ boxShadow: "0 -4px 12px rgba(0,0,0,0.03), 0 -8px 24px rgba(0,0,0,0.04)" }}>
      <div className="mx-auto flex max-w-[1500px] flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 grid gap-4 lg:grid-cols-4 lg:gap-5">
          <div className="lg:col-span-1">
            <div className="rounded-[20px] border border-gray-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
                <span className="text-base font-semibold tracking-[0.2em] text-slate-800">ST</span>
              </div>
              <h3 className="mb-1 text-[18px] font-semibold text-slate-900">{footerTitle}</h3>
              <p className="mb-2 max-w-sm text-[13px] leading-5 text-slate-600">
                {description}
              </p>
              <div className="mt-2 flex flex-col items-start gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Follow me
                </span>
                <div className="flex flex-row flex-wrap items-center gap-1.5" aria-label="Social media links">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className={footerIconClass} aria-label="GitHub profile">
                      <Github size={18} aria-hidden="true" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={footerIconClass} aria-label="LinkedIn profile">
                      <Linkedin size={18} aria-hidden="true" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={footerIconClass} aria-label="Twitter profile">
                      <Twitter size={18} aria-hidden="true" />
                    </a>
                  )}
                  {settings?.contactEmail && (
                    <a href={`mailto:${settings.contactEmail}`} className={footerIconClass} aria-label="Send email">
                      <Mail size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-lg font-semibold text-slate-900">Quick Navigation</div>
            <div className="space-y-1">
              {navigation.map((item, index) => {
                const Icon = item.icon || Home;
                return (
                  <a
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition duration-300 hover:text-accent-blue"
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[15px] font-semibold text-slate-900">Professional Services</div>
            <div className="flex flex-wrap gap-1.5">
              {serviceItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[13px] font-medium text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.04)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[15px] font-semibold text-slate-900">Contact Information</div>
            <div className="space-y-2">
              {contactItems.map((item, index) => {
                const Icon = item.icon || Mail;
                const content = (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white/90 px-2.5 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                      <div className="text-[13px] font-medium text-slate-700">{item.value}</div>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a key={`${item.label}-${index}`} href={item.href} className="block">
                      {content}
                    </a>
                  );
                }

                return <div key={`${item.label}-${index}`}>{content}</div>;
              })}

              <a
                href={settings?.resumeUrl || "#"}
                className="mt-1.5 inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-accent-blue px-3 py-2 text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(15,23,42,0.18)]"
              >
                <Download size={16} aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex flex-col gap-2 text-[12px] text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>{copyrightText}</p>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_15px_35px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:rotate-3"
        aria-label="Back to top"
      >
        <ArrowUp size={18} aria-hidden="true" />
      </button>
    </footer>
  );
}
