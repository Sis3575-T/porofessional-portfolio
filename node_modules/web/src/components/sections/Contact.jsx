import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Loader2, User, MessageSquare, Tag } from "lucide-react";
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
    <AnimatedSection id="contact" theme="contact" className="py-32 overflow-hidden" aria-label="Contact section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <motion.p
          className="text-center text-sm font-medium text-slate-400 tracking-widest uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.p>
        <motion.h2
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get In Touch
        </motion.h2>
        <motion.div
          className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-4"
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
          Have a project in mind? Let's work together
        </motion.p>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 bg-slate-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Available for freelance & full-time opportunities</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="icon-container icon-email">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-white">{settings?.contactEmail || "hello@example.com"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="icon-container icon-phone">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-white">{settings?.contactPhone || "+1 234 567 890"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="icon-container icon-location">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="text-white">{settings?.address || "Remote"}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-500 mb-4">Follow me on</p>
              <div className="flex gap-3">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800/50 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-slate-800 transition capitalize"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {success ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Thank you for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 btn-ceramic font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6" aria-label="Contact form" noValidate>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm" role="alert">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm text-gray-600 mb-2">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                        placeholder="John Doe"
                        aria-required="true"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-gray-600 mb-2">Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                        placeholder="john@example.com"
                        aria-required="true"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm text-gray-600 mb-2">Subject *</label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      id="contact-subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"
                      placeholder="Project Inquiry"
                      aria-required="true"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-gray-600 mb-2">Message *</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3.5 top-4 text-slate-500 pointer-events-none" />
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition resize-none"
                      placeholder="Tell me about your project..."
                      aria-required="true"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium btn-premium-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  aria-busy={loading}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending...</>
                  ) : (
                    <><Send size={18} aria-hidden="true" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
