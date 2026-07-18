import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Services from "./components/sections/Services";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Projects from "./components/sections/Projects";
import Testimonials from "./components/sections/Testimonials";
import Contact from "./components/sections/Contact";
import ProjectDetails from "./components/ProjectDetails";
import Footer from "./components/Footer";

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Experience />
      <Education />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <PortfolioProvider>
        <div className="bg-slate-950 text-slate-50 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
          </Routes>
          <Footer />
        </div>
      </PortfolioProvider>
    </Router>
  );
}
