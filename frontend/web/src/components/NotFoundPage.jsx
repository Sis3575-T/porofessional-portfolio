import { Link } from "react-router-dom";
import SEO from "./SEO";

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 - Page Not Found | Portfolio" />
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center max-w-md px-4">
           <div className="text-8xl font-bold text-gray-200 mb-4" aria-hidden="true">404</div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
           <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="btn-ceramic"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
