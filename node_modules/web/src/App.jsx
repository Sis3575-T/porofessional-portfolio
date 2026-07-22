import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PortfolioProvider } from "./context/PortfolioContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AvatarProvider } from "./context/AvatarContext";
import { Avatar3DProvider } from "./context/Avatar3DContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipLink from "./components/SkipLink";
import BackToTop from "./components/BackToTop";
import LoadingOverlay from "./components/LoadingOverlay";
import PhotoManager from "./components/PhotoManager";
import ScreenshotButton from "./components/ScreenshotButton";

import NotFoundPage from "./components/NotFoundPage";

const Hero = lazy(() => import("./components/sections/Hero"));
const About = lazy(() => import("./components/sections/About"));
const Skills = lazy(() => import("./components/sections/Skills"));
const Services = lazy(() => import("./components/sections/Services"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Education = lazy(() => import("./components/sections/Education"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Testimonials = lazy(() => import("./components/sections/Testimonials"));
const Contact = lazy(() => import("./components/sections/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetails"));

const SectionLoader = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function HomePage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <AnimatedPage>
        <SEO />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Experience />
        <Education />
        <Testimonials />
        <Contact />
      </AnimatedPage>
    </Suspense>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={
          <Suspense fallback={<SectionLoader />}>
            <AnimatedPage>
              <SEO />
              <ProjectDetails />
            </AnimatedPage>
          </Suspense>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
      <PortfolioProvider>
      <AvatarProvider>
      <Avatar3DProvider>
        <ErrorBoundary>
          <div className="min-h-screen relative" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <SkipLink />
            <Sidebar />
            <Navbar />
            <div className="ml-0 md:ml-[100px] xl:ml-[105px] 2xl:ml-[110px] pt-[80px]">
              <main id="main-content">
                <AppRoutes />
              </main>
              <Footer />
            </div>
            <BackToTop />
            <LoadingOverlay />
            <PhotoManager />
            <ScreenshotButton />
          </div>
        </ErrorBoundary>
      </Avatar3DProvider>
      </AvatarProvider>
      </PortfolioProvider>
      </ThemeProvider>
    </Router>
  );
}
