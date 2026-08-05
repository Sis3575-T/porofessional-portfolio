import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { contactAPI } from "../../services/api";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  Send, Mail, MapPin, Phone, Loader2, CheckCircle,
  User, Tag, MessageSquare, Briefcase, ArrowRight,
} from "lucide-react";

const VISITOR_TOKEN_KEY = "portfolio_visitor_token";

function getVisitorToken() {
  let token = localStorage.getItem(VISITOR_TOKEN_KEY);
  if (!token) {
    token = "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(VISITOR_TOKEN_KEY, token);
  }
  return token;
}

const defaultContactInfo = {
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  location: "Remote / Worldwide",
};

const defaultSocialLinks = {
  github: "#", linkedin: "#", twitter: "#", email: "mailto:hello@example.com", telegram: "#", portfolio: "#",
};

const serviceOptions = [
  "Frontend Development", "Backend Development", "Full Stack Development",
  "UI Design", "API Development", "Consultation",
];

function ContactCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div className="ct-info-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}>
      <div className="ct-info-icon"><Icon size={18} /></div>
      <div className="ct-info-text"><span className="ct-info-label">{label}</span><span className="ct-info-value">{value}</span></div>
    </motion.div>
  );
}

function SocialIcon({ href, icon: Icon, label, delay }) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" className="ct-social-icon" aria-label={label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay }}>
      <Icon size={20} />
    </motion.a>
  );
}

export default function Contact() {
  const { settings } = usePortfolio();
  const { trackEvent } = useAnalytics();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", service: "", honeypot: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitTime] = useState(() => Date.now());
  const submitRef = useRef(false);
  const visitorTokenRef = useRef(getVisitorToken());

  const sectionRef = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const contactInfo = {
    email: settings?.contactEmail || defaultContactInfo.email,
    phone: settings?.contactPhone || defaultContactInfo.phone,
    location: settings?.address || defaultContactInfo.location,
  };

  let socialLinks = defaultSocialLinks;
  try { if (settings?.socialLinks) socialLinks = { ...defaultSocialLinks, ...JSON.parse(settings.socialLinks) }; } catch {}

  const validate = () => {
    const errs = {};
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length > 5000) errs.message = "Message is too long";
    if (form.email && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Invalid email";
    const timeDiff = Date.now() - submitTime;
    if (timeDiff < 2000) errs.submit = "Please wait a moment before submitting";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitRef.current) return;
    if (!validate()) return;
    submitRef.current = true;
    setLoading(true);
    try {
      await contactAPI.send({
        visitorToken: visitorTokenRef.current,
        name: form.name.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
        honeypot: form.honeypot,
      });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", service: "", honeypot: "" });
      setErrors({});
      trackEvent("contact_submit", { subject: form.subject });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Unable to send message. Please try again." });
    } finally {
      setLoading(false);
      submitRef.current = false;
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) => `ct-input ${errors[field] ? "ct-input--error" : ""}`;

  return (
    <section id="contact" className="ct-section" style={{ background: "var(--section-contact)" }}>
      <div className="ct-bg-decoration" aria-hidden="true">
        <div className="ct-bg-circle ct-bg-circle--1" /><div className="ct-bg-circle ct-bg-circle--2" /><div className="ct-bg-dots" />
      </div>

      <div className="ct-section-inner" ref={sectionRef}>
        <motion.div className="ct-header" initial={{ opacity: 0, y: 30 }} animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }}>
          <span className="ct-header-badge">Let&apos;s Connect</span>
          <h2 className="ct-header-title">Get <span style={{ color: "var(--accent)" }}>In</span> Touch</h2>
          <div className="ct-header-accent" />
          <p className="ct-header-desc">Have a project in mind? Let&apos;s build something meaningful together.</p>
        </motion.div>

        <div className="ct-grid">
          <div className="ct-left">
            <motion.div className="ct-info-panel" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h3 className="ct-info-heading">Get In Touch</h3>
              <p className="ct-info-desc">I&apos;m available for freelance work, consulting, and collaborative product builds. Let&apos;s talk.</p>
              <div className="ct-info-cards">
                <ContactCard icon={Mail} label="Email" value={contactInfo.email} delay={0.1} />
                <ContactCard icon={Phone} label="Phone" value={contactInfo.phone} delay={0.15} />
                <ContactCard icon={MapPin} label="Location" value={contactInfo.location} delay={0.2} />
              </div>
            </motion.div>
          </div>

          <div className="ct-right">
            <motion.div className="ct-form-panel" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              {success ? (
                <div className="ct-success">
                  <div className="ct-success-icon"><CheckCircle size={40} /></div>
                  <h3 className="ct-success-title">Message Sent!</h3>
                  <p className="ct-success-desc">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  <button onClick={() => setSuccess(false)} className="ct-success-btn">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="ct-form" aria-label="Contact form" noValidate>
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0, overflow: "hidden" }} aria-hidden="true">
                    <label htmlFor="ct-website">Website</label>
                    <input id="ct-website" type="text" value={form.honeypot} onChange={(e) => handleChange("honeypot", e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label htmlFor="ct-name" className="ct-label">Name</label>
                      <div className="ct-input-wrap">
                        <User size={16} className="ct-input-icon" />
                        <input id="ct-name" type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass("name")} placeholder="John Doe" maxLength={100} />
                      </div>
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-email" className="ct-label">Email</label>
                      <div className="ct-input-wrap">
                        <Mail size={16} className="ct-input-icon" />
                        <input id="ct-email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} placeholder="john@example.com" maxLength={254} />
                      </div>
                      {errors.email && <span className="ct-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-phone" className="ct-label">Phone</label>
                    <div className="ct-input-wrap">
                      <Phone size={16} className="ct-input-icon" />
                      <input id="ct-phone" type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} placeholder="+1 (555) 123-4567" maxLength={30} />
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-subject" className="ct-label">Subject</label>
                    <div className="ct-input-wrap">
                      <Tag size={16} className="ct-input-icon" />
                      <input id="ct-subject" type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} className={inputClass("subject")} placeholder="Project Inquiry" maxLength={200} />
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-message" className="ct-label">Message *</label>
                    <div className="ct-input-wrap ct-input-wrap--textarea">
                      <MessageSquare size={16} className="ct-input-icon ct-input-icon--top" />
                      <textarea id="ct-message" value={form.message} onChange={(e) => handleChange("message", e.target.value)} rows={6} className={`${inputClass("message")} ct-textarea`} placeholder="Tell me about your project..." maxLength={5000} />
                    </div>
                    {errors.message && <span className="ct-error">{errors.message}</span>}
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-service" className="ct-label">Preferred Service</label>
                    <div className="ct-input-wrap">
                      <Briefcase size={16} className="ct-input-icon" />
                      <select id="ct-service" value={form.service} onChange={(e) => handleChange("service", e.target.value)} className="ct-input ct-select">
                        <option value="">Select a service...</option>
                        {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {errors.submit && <div className="ct-error-box" role="alert"><span className="ct-error-dot" />{errors.submit}</div>}

                  <button type="submit" disabled={loading} className="ct-submit" aria-busy={loading}>
                    {loading ? (<><Loader2 size={18} className="animate-spin" aria-hidden="true" />Sending...</>) : (<><Send size={18} aria-hidden="true" />Send Message<ArrowRight size={16} className="ct-submit-arrow" /></>)}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
