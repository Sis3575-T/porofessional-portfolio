import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { contactAPI } from "../../services/api";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  Send, Mail, MapPin, Phone, Clock, Loader2, CheckCircle,
  Github, Linkedin, Twitter, User, Tag, MessageSquare,
  Globe, Zap, ArrowRight, Briefcase, CalendarDays,
} from "lucide-react";

const defaultContactInfo = {
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  location: "Remote / Worldwide",
  availability: "Available for projects",
  responseTime: "Within 24 hours",
  workingHours: "Mon - Fri, 9AM - 6PM",
};

const defaultSocialLinks = {
  github: "#",
  linkedin: "#",
  twitter: "#",
  email: "mailto:hello@example.com",
  telegram: "#",
  portfolio: "#",
};

const serviceOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI Design",
  "API Development",
  "Consultation",
];

function ContactCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      className="ct-info-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="ct-info-icon">
        <Icon size={18} />
      </div>
      <div className="ct-info-text">
        <span className="ct-info-label">{label}</span>
        <span className="ct-info-value">{value}</span>
      </div>
    </motion.div>
  );
}

function SocialIcon({ href, icon: Icon, label, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ct-social-icon"
      aria-label={label}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Icon size={20} />
    </motion.a>
  );
}

export default function Contact() {
  const { settings } = usePortfolio();
  const { trackEvent } = useAnalytics();
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "", service: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const sectionRef = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const contactInfo = {
    email: settings?.contactEmail || defaultContactInfo.email,
    phone: settings?.contactPhone || defaultContactInfo.phone,
    location: settings?.address || defaultContactInfo.location,
    availability: settings?.availability || defaultContactInfo.availability,
    responseTime: settings?.responseTime || defaultContactInfo.responseTime,
    workingHours: settings?.workingHours || defaultContactInfo.workingHours,
  };

  let socialLinks = defaultSocialLinks;
  try {
    if (settings?.socialLinks) {
      socialLinks = { ...defaultSocialLinks, ...JSON.parse(settings.socialLinks) };
    }
  } catch { /* use defaults */ }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await contactAPI.send({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        service: form.service,
      });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "", service: "" });
      setErrors({});
      trackEvent("contact_submit", { name: form.name, subject: form.subject });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to send message" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `ct-input ${errors[field ? field : ""] ? "ct-input--error" : ""}`;

  return (
    <section
      id="contact"
      className="ct-section"
      style={{ background: "var(--section-contact)" }}
    >
      {/* Background decoration */}
      <div className="ct-bg-decoration" aria-hidden="true">
        <div className="ct-bg-circle ct-bg-circle--1" />
        <div className="ct-bg-circle ct-bg-circle--2" />
        <div className="ct-bg-dots" />
      </div>

      <div className="ct-section-inner" ref={sectionRef}>
        {/* Header */}
        <motion.div
          className="ct-header"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="ct-header-badge">Let&apos;s Connect</span>
          <h2 className="ct-header-title">
            Get <span style={{ color: "var(--accent)" }}>In</span> Touch
          </h2>
          <div className="ct-header-accent" />
          <p className="ct-header-desc">
            Have a project in mind? Let&apos;s build something meaningful together.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="ct-grid">
          {/* ─── Left Side: Info Card ─── */}
          <div className="ct-left">
            <motion.div
              className="ct-info-panel"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h3 className="ct-info-heading">Get In Touch</h3>
              <p className="ct-info-desc">
                I&apos;m available for freelance work, consulting, and collaborative
                product builds focused on thoughtful design and dependable engineering.
                Whether you need a full-stack application, a sleek frontend, or
                technical consultation — let&apos;s talk.
              </p>

              <div className="ct-info-cards">
                <ContactCard icon={Mail} label="Email" value={contactInfo.email} delay={0.1} />
                <ContactCard icon={Phone} label="Phone" value={contactInfo.phone} delay={0.15} />
                <ContactCard icon={MapPin} label="Location" value={contactInfo.location} delay={0.2} />

              </div>
            </motion.div>
          </div>

          {/* ─── Right Side: Form ─── */}
          <div className="ct-right">
            <motion.div
              className="ct-form-panel"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            >
              {success ? (
                <div className="ct-success">
                  <div className="ct-success-icon">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="ct-success-title">Message Sent!</h3>
                  <p className="ct-success-desc">
                    Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="ct-success-btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="ct-form" aria-label="Contact form" noValidate>
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label htmlFor="ct-name" className="ct-label">Name *</label>
                      <div className="ct-input-wrap">
                        <User size={16} className="ct-input-icon" />
                        <input
                          id="ct-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={inputClass("name")}
                          placeholder="John Doe"
                          aria-required="true"
                        />
                      </div>
                      {errors.name && <span className="ct-error">{errors.name}</span>}
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-email" className="ct-label">Email *</label>
                      <div className="ct-input-wrap">
                        <Mail size={16} className="ct-input-icon" />
                        <input
                          id="ct-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={inputClass("email")}
                          placeholder="john@example.com"
                          aria-required="true"
                        />
                      </div>
                      {errors.email && <span className="ct-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-subject" className="ct-label">Subject *</label>
                    <div className="ct-input-wrap">
                      <Tag size={16} className="ct-input-icon" />
                      <input
                        id="ct-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        className={inputClass("subject")}
                        placeholder="Project Inquiry"
                        aria-required="true"
                      />
                    </div>
                    {errors.subject && <span className="ct-error">{errors.subject}</span>}
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-message" className="ct-label">Message *</label>
                    <div className="ct-input-wrap ct-input-wrap--textarea">
                      <MessageSquare size={16} className="ct-input-icon ct-input-icon--top" />
                      <textarea
                        id="ct-message"
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={6}
                        className={`${inputClass("message")} ct-textarea`}
                        placeholder="Tell me about your project..."
                        aria-required="true"
                      />
                    </div>
                    {errors.message && <span className="ct-error">{errors.message}</span>}
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-service" className="ct-label">Preferred Service</label>
                    <div className="ct-input-wrap">
                      <Briefcase size={16} className="ct-input-icon" />
                      <select
                        id="ct-service"
                        value={form.service}
                        onChange={(e) => handleChange("service", e.target.value)}
                        className="ct-input ct-select"
                      >
                        <option value="">Select a service...</option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="ct-error-box" role="alert">
                      <span className="ct-error-dot" />
                      {errors.submit}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="ct-submit"
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} aria-hidden="true" />
                        Send Message
                        <ArrowRight size={16} className="ct-submit-arrow" />
                      </>
                    )}
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
