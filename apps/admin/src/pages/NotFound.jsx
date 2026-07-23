import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <div className="text-8xl font-bold text-slate-200 mb-4" aria-hidden="true">404</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The admin page you're looking for doesn't exist.</p>
        <Link to="/admin" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition inline-flex items-center gap-2">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
