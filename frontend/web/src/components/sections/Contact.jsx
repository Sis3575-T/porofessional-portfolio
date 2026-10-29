import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  Phone,
  Loader2,
  CheckCircle2,
  User,
  Tag,
  MessageSquare,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useProfile } from "../../context/ProfileContext";
import { contactAPI } from "../../services/api";
import { useAnalytics } from "../../hooks/useAnalytics";

const VISITOR_TOKEN_KEY = "portfolio_visitor_token";

function getVisitorToken() {
  let token = localStorage.getItem(VISITOR_TOKEN_KEY);
  if (!token) {
    token = "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(VISITOR_TOKEN_KEY, token);
  }
  return token;
}

const serviceOptions = [
  "Full Stack Web Development",
  "Frontend Architecture & React",
  "Backend & RESTful API Engineering",
  "Database Modeling & PostgreSQL",
  "AI Integration & Prompt Engineering",
  "General Consultation",
];

export default function Contact() {
  const { settings } = usePortfolio();
  const { email: profileEmail } = useProfile();
  const { trackEvent } = useAnalytics();
  const locationState = useLocation().state;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: locationState?.subject || "",
    message: "",
    service: "",
    honeypot: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitTime] = useState(() => Date.now());

  const submitRef = useRef(false);
  const visitorTokenRef = useRef(getVisitorToken());
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const contactEmail = settings?.contactEmail || profileEmail || "sisay3575@gmail.com";
  const contactPhone = settings?.contactPhone || "0935756054";
  const contactLocation = settings?.address || "Bahir Dar, Ethiopia";

  useEffect(() => {
    if (locationState?.subject) {
      setForm((prev) => ({ ...prev, subject: locationState.subject }));
    }
  }, [locationState]);

  const validate = () => {
    const errs = {};
    if (!form.message.trim()) {
      errs.message = "Message is required";
    } else if (form.message.trim().length > 5000) {
      errs.message = "Message cannot exceed 5000 characters";
    }

    if (form.email && form.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errs.email = "Please enter a valid email address";
      }
    }

    const timeDiff = Date.now() - submitTime;
    if (timeDiff < 1500) {
      errs.submit = "Please wait a moment before sending";
    }

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
        subject: form.subject.trim() || (form.service ? `Inquiry: ${form.service}` : undefined),
        message: form.message.trim(),
        honeypot: form.honeypot,
      });

      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", service: "", honeypot: "" });
      setErrors({});
      trackEvent("contact_submit", { subject: form.subject || form.service });
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Unable to send message at this moment. Please reach out directly via email.",
      });
    } finally {
      setLoading(false);
      submitRef.current = false;
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <section
      id="contact"
      className="py-6 sm:py-8 relative transition-colors scroll-mt-16"
      style={{ background: "var(--section-contact)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={sectionRef}>
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#246BFD] dark:bg-[#3B82F6]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246BFD] dark:text-[#3B82F6]">
              Let&apos;s Connect
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#14213D] dark:text-[#F8FAFC] tracking-tight">
            Get In Touch
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT: Direct Contact Information (5 columns) */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between"
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                Let&apos;s discuss your next project
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-4 font-normal">
                I am actively seeking software engineering opportunities, internships, and contract builds. Feel free
                to send a message or contact me directly through my primary channels.
              </p>

              <div className="space-y-2.5">
                {/* Email Card */}
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB]/50 hover:shadow-soft transition-all shadow-soft-xs group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                    <Mail size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] font-bold block">
                      Email Address
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors truncate block">
                      {contactEmail}
                    </span>
                  </div>
                </a>

                {/* Location Card */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] shadow-soft-xs">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] font-bold block">
                      Location
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] block truncate">
                      {contactLocation}
                    </span>
                  </div>
                </div>

                {/* Phone Card */}
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB]/50 hover:shadow-soft transition-all shadow-soft-xs group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                      <Phone size={17} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] font-bold block">
                        Telephone
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors truncate block">
                        {contactPhone}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Availability status note */}
            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-pulse shrink-0" />
              <p className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                Response time: <strong>within 24 hours</strong>. Open to remote or hybrid opportunities.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Contact Message Form (7 columns) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 12 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <div className="bg-white dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-soft-sm">
              {success ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#3B82F6]/15 border border-[#E2E8F0] dark:border-[#1E293B] text-[#2563EB] dark:text-[#3B82F6] mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-md mx-auto mb-5">
                    Thank you for reaching out. Your message has been received and I will reply as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs sm:text-sm transition shadow-soft-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Anti-Spam Honeypot */}
                  <div
                    style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0, overflow: "hidden" }}
                    aria-hidden="true"
                  >
                    <label htmlFor="hp-field">Leave blank</label>
                    <input
                      id="hp-field"
                      type="text"
                      value={form.honeypot}
                      onChange={(e) => handleChange("honeypot", e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
                    {/* Name */}
                    <div>
                      <label htmlFor="ct-name" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1 block">
                        Your Name
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-3 text-[#2563EB] dark:text-[#3B82F6]" />
                        <input
                          id="ct-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Sisay"
                          maxLength={100}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-[#161F30] transition font-medium"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="ct-email" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-3 text-[#2563EB] dark:text-[#3B82F6]" />
                        <input
                          id="ct-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="name@example.com"
                          maxLength={254}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border ${
                            errors.email ? "border-rose-400" : "border-[#E2E8F0] dark:border-[#1E293B]"
                          } text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-[#161F30] transition font-medium`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
                    {/* Subject */}
                    <div>
                      <label htmlFor="ct-subject" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1 block">
                        Subject
                      </label>
                      <div className="relative">
                        <Tag size={15} className="absolute left-3.5 top-3 text-[#2563EB] dark:text-[#3B82F6]" />
                        <input
                          id="ct-subject"
                          type="text"
                          value={form.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          placeholder="Project Discussion / Opportunity"
                          maxLength={200}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-[#161F30] transition font-medium"
                        />
                      </div>
                    </div>

                    {/* Preferred Area / Service */}
                    <div>
                      <label htmlFor="ct-service" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1 block">
                        Area of Interest
                      </label>
                      <div className="relative">
                        <Briefcase size={15} className="absolute left-3.5 top-3 text-[#2563EB] dark:text-[#3B82F6]" />
                        <select
                          id="ct-service"
                          value={form.service}
                          onChange={(e) => handleChange("service", e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-[#161F30] transition font-medium"
                        >
                          <option value="">Select an area (optional)...</option>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label htmlFor="ct-message" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-1 block">
                      Message <span className="text-[#2563EB] dark:text-[#3B82F6]">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className="absolute left-3.5 top-3 text-[#2563EB] dark:text-[#3B82F6]" />
                      <textarea
                        id="ct-message"
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell me about your project, timeline, or requirements..."
                        rows={4}
                        maxLength={5000}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border ${
                          errors.message ? "border-rose-400" : "border-[#E2E8F0] dark:border-[#1E293B]"
                        } text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white dark:focus:bg-[#161F30] transition resize-y font-medium`}
                      />
                    </div>
                    {errors.message && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Error Box */}
                  {errors.submit && (
                    <div className="mb-3.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{errors.submit}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-70 text-white font-semibold text-xs sm:text-sm transition shadow-soft-xs hover:shadow-soft flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
