import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AvatarProvider } from "./context/AvatarContext";
import { useAnalytics } from "./hooks/useAnalytics";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipLink from "./components/SkipLink";
import BackToTop from "./components/BackToTop";
import LoadingOverlay from "./components/LoadingOverlay";
import PhotoManager from "./components/PhotoManager";
import ScreenshotButton from "./components/ScreenshotButton";
import FaviconUpdater from "./components/FaviconUpdater";
import HomeContactStrip from "./components/HomeContactStrip";

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Services from "./components/sections/Services";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Testimonials from "./components/sections/Testimonials";
import NotFoundPage from "./components/NotFoundPage";

// Dedicated Route Pages
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProjectDetails = lazy(() => import("./components/ProjectDetails"));

const SectionLoader = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] animate-pulse">
      Loading...
    </div>
  </div>
);

const pageVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial={false} animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

const defaultVisibility = {
  hero: true,
  about: true,
  projects: true,
  skills: true,
  services: true,
  experience: true,
  education: true,
  testimonials: true,
  footer: true,
};

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

/**
 * HomePage
 * Strictly adheres to requirement:
 * 1. Compact Navbar (in MainLayout)
 * 2. Home Hero section (viewport-aware 100svh)
 * 3. Compact About section
 * 4. Social media links and direct contact information (HomeContactStrip)
 * 5. Compact footer (in MainLayout)
 * All other detailed sections (Projects, Skills, Services, Experience, Education, Contact)
 * are viewed by clicking their respective buttons / links.
 */
function HomePage() {
  const { settings } = usePortfolio();
  const visibility = (() => {
    try {
      if (settings?.sectionVisibility) {
        const v =
          typeof settings.sectionVisibility === "string"
            ? JSON.parse(settings.sectionVisibility)
            : settings.sectionVisibility;
        return { ...defaultVisibility, ...v };
      }
    } catch {}
    return defaultVisibility;
  })();

  const show = (key) => visibility[key] !== false;

  return (
    <AnimatedPage>
      <SEO />
      {show("hero") && <Hero />}
      {show("about") && <About />}
      {show("projects") && <Projects />}
      {show("skills") && <Skills />}
      {show("services") && <Services />}
      {show("experience") && <Experience />}
      {show("education") && <Education />}
      {show("testimonials") && <Testimonials />}
      <HomeContactStrip />
    </AnimatedPage>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main Homepage: Only Hero, About, Social contacts & Footer */}
        <Route path="/" element={<HomePage />} />

        {/* Dedicated routes for detailed sections on demand */}
        <Route
          path="/projects"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <ProjectsPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="/skills"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <SkillsPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="/experience"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <ExperiencePage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="/education"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <EducationPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <ServicesPage />
              </AnimatedPage>
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <ContactPage />
              </AnimatedPage>
            </Suspense>
          }
        />

        {/* Project detail route */}
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<SectionLoader />}>
              <AnimatedPage>
                <ProjectDetails />
              </AnimatedPage>
            </Suspense>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const { settings } = usePortfolio();
  useAnalytics();
  const visibility = (() => {
    try {
      if (settings?.sectionVisibility) {
        const v =
          typeof settings.sectionVisibility === "string"
            ? JSON.parse(settings.sectionVisibility)
            : settings.sectionVisibility;
        return { ...defaultVisibility, ...v };
      }
    } catch {}
    return defaultVisibility;
  })();

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <SkipLink />
      <FaviconUpdater />
      <ScrollManager />
      <Navbar />
      <div className="w-full flex-1 flex flex-col">
        <main id="main-content" className="flex-1">
          <AppRoutes />
        </main>
        {visibility.footer !== false && <Footer />}
      </div>
      <BackToTop />
      <LoadingOverlay />
      <PhotoManager />
      <ScreenshotButton />
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <PortfolioProvider>
          <ProfileProvider>
            <AvatarProvider>
              <ErrorBoundary>
                <MainLayout />
              </ErrorBoundary>
            </AvatarProvider>
          </ProfileProvider>
        </PortfolioProvider>
      </ThemeProvider>
    </Router>
  );
}
