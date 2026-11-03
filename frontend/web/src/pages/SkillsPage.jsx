import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, FolderGit2 } from "lucide-react";
import SEO from "../components/SEO";
import Skills from "../components/sections/Skills";

export default function SkillsPage() {
  return (
    <>
      <SEO
        title="Technical Skills & Stack | Sisay Temesgen"
        description="Comprehensive overview of Sisay Temesgen's technical capabilities across JavaScript, React, Node.js, Express, PostgreSQL, MongoDB, and AI."
      />
      <div className="pt-3 sm:pt-4 pb-6 sm:pb-8 min-h-[calc(100vh-140px)] bg-transparent transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Back Navigation */}
          <div className="pt-2 pb-1 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#52607A] dark:text-[#94A3B8] hover:text-[#246BFD] dark:hover:text-[#3B82F6] transition py-1.5 px-3 rounded-full hover:bg-white/80 dark:hover:bg-white/10 border border-transparent shadow-2xs"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="text-xs font-mono text-[#52607A] dark:text-[#94A3B8]">
              Home / Skills
            </span>
          </div>

          {/* Render Dedicated Skills Component */}
          <Skills />

          {/* Bottom Call to Action Card */}
          <div className="mt-4 sm:mt-5 rounded-[28px] p-5 sm:p-7 bg-white/95 dark:bg-[#0e1420]/85 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#14213D] dark:text-[#F8FAFC]">
                Want to see these skills in real applications?
              </h3>
              <p className="text-xs sm:text-sm text-[#52607A] dark:text-[#94A3B8] mt-1">
                Explore the applications, full-stack systems, and open-source projects built with this stack.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#246BFD] hover:bg-[#1858DF] active:translate-y-0.5 text-white text-xs sm:text-sm font-semibold transition-all shadow-btn-3d hover:shadow-soft-3d-hover shrink-0"
            >
              <FolderGit2 size={15} />
              <span>View Projects</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
