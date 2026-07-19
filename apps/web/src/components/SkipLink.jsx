export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-slate-950 focus:rounded-lg focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
