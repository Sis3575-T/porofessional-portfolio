import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import Contact from "../components/sections/Contact";

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Get In Touch | Sisay Temesgen - Full-Stack Developer"
        description="Contact Sisay Temesgen for full-stack engineering roles, software projects, AI integration opportunities, and technical collaborations."
      />
      <div className="pt-6 sm:pt-8 pb-8 sm:pb-10 min-h-[calc(100vh-140px)] bg-[#F7FAFE] dark:bg-[#0B0F17] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Back Navigation */}
          <div className="pt-2 pb-1 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#52607A] dark:text-[#94A3B8] hover:text-[#246BFD] dark:hover:text-[#3B82F6] transition py-1.5 px-3 rounded-full hover:bg-white dark:hover:bg-[#161F30] border border-transparent hover:border-[#D8E5F8] dark:hover:border-[#1E293B] shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="text-xs font-mono text-[#52607A] dark:text-[#94A3B8]">
              Home / Contact
            </span>
          </div>

          {/* Render Dedicated Contact Component */}
          <Contact />
        </div>
      </div>
    </>
  );
}
