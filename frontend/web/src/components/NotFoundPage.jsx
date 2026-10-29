import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "./SEO";

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 - Page Not Found | Sisay Temesgen" />
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#0F172A] dark:text-[#F8FAFC] px-4 transition-colors">
        <div className="text-center max-w-md">
          <div className="text-7xl font-bold font-mono text-[#2563EB] dark:text-[#3B82F6] mb-4" aria-hidden="true">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Page Not Found
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mb-8 leading-relaxed">
            The page you are looking for doesn&apos;t exist or may have been moved to another location.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition shadow-soft-xs inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
