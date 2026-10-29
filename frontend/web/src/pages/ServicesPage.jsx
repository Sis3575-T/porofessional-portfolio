import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import SEO from "../components/SEO";
import Services from "../components/sections/Services";

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Services & Capabilities | Sisay Temesgen"
        description="Full-stack web application development, RESTful APIs, database architecture, and frontend engineering services by Sisay Temesgen."
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
              Home / Services
            </span>
          </div>

          {/* Render Dedicated Services Component */}
          <Services />

          {/* Bottom Call to Action Card */}
          <div className="mt-6 sm:mt-8 rounded-[24px] p-4 sm:p-6 bg-white dark:bg-[#161F30] border border-[#D8E5F8] dark:border-[#1E293B] shadow-soft-3d flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#14213D] dark:text-[#F8FAFC]">
                Ready to bring your software project to life?
              </h3>
              <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] mt-1">
                From initial architecture to full implementation and deployment, let&apos;s build it together.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white text-xs sm:text-sm font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover shrink-0"
            >
              <MessageSquare size={15} />
              <span>Start an Inquiry</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
