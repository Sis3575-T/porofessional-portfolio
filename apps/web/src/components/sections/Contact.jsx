import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Loader2, Github, Linkedin, Twitter, User, Tag, MessageSquare } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { contactAPI } from "../../services/api";
import { AnimatedSection } from "../AnimatedSection";

export default function Contact() {
  const { settings } = usePortfolio();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await contactAPI.send(form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : {};

  return (
    <AnimatedSection id="contact" theme="contact" className="py-4 overflow-hidden" aria-label="Contact section">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-accent-blue tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.p>
        <motion.h2
          className="text-center text-gray-900 text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get In <span className="text-accent-blue">Touch</span>
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-accent-blue rounded-full mx-auto mt-4 mb-4"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="text-center text-gray-500 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Have a project in mind? Let&apos;s work together
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 xl:gap-16 items-start">
          <div>
            <motion.h3
              className="text-xl font-semibold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Get In Touch
            </motion.h3>
            <motion.p
              className="text-gray-500 text-sm leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              I&apos;m available for freelance work, consulting, and collaborative product builds focused on thoughtful design and dependable engineering.
            </motion.p>

            <div className="flex flex-col gap-5 mb-8">
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                <Mail size={18} className="text-accent-blue mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue block mb-0.5">Email</span>
                  <span className="text-sm text-gray-600">{settings?.contactEmail || "hello@example.com"}</span>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <MapPin size={18} className="text-accent-blue mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue block mb-0.5">Location</span>
                  <span className="text-sm text-gray-600">{settings?.address || "Remote • Worldwide"}</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hover:-translate-y-1"
                  aria-label="GitHub"
                >
                  <Github size={22} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center text-[#0A66C2] hover:text-[#084d82] hover:scale-110 transition-all duration-300 hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={22} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center text-gray-700 hover:text-black hover:scale-110 transition-all duration-300 hover:-translate-y-1"
                  aria-label="Twitter"
                >
                  <Twitter size={22} />
                </a>
              )}
            </motion.div>
          </div>

          <div>
            {success ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Send size={28} className="text-accent-blue" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                <form onSubmit={handleSubmit} className="p-8 space-y-5" aria-label="Contact form" noValidate>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 text-red-700 text-sm flex items-center gap-2.5" role="alert">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                      {error}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="text-sm font-medium text-gray-900">Name *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition"
                          placeholder="John Doe"
                          aria-required="true"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="text-sm font-medium text-gray-900">Email *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition"
                          placeholder="john@example.com"
                          aria-required="true"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="text-sm font-medium text-gray-900">Subject *</label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        id="contact-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition"
                        placeholder="Project Inquiry"
                        aria-required="true"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="text-sm font-medium text-gray-900">Message *</label>
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition resize-none"
                        placeholder="Tell me about your project..."
                        aria-required="true"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent-blue text-white font-semibold rounded-lg py-3 text-sm flex items-center justify-center gap-2 hover:brightness-110 hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    aria-busy={loading}
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending...</>
                    ) : (
                      <><Send size={18} aria-hidden="true" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
