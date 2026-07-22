import { PrismaClient, UserRole, SkillCategory } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../services/api/.env") });

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.dev";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log("Admin user created:", adminEmail);

  await prisma.hero.upsert({
    where: { id: "hero-1" },
    update: {},
    create: {
      id: "hero-1",
      greeting: "Hello, I'm",
      name: "Sisay Temesgen",
      title: "Full Stack Developer & UI Designer",
      description: "I build beautiful, responsive web applications with modern technologies. Passionate about clean code and user experience.",
      primaryCTA: "View My Work",
      secondaryCTA: "Get In Touch",
    },
  });
  console.log("Hero section created");

  await prisma.about.upsert({
    where: { id: "about-1" },
    update: {},
    create: {
      id: "about-1",
      biography: "I'm a full-stack developer with 5+ years of experience building web applications. I love solving complex problems and creating intuitive user interfaces.",
      summary: "Specialized in React, Node.js, and modern web technologies. Always learning and exploring new tools.",
      yearsOfExperience: 5,
      email: "sisay@example.com",
      location: "Addis Ababa, Ethiopia",
      nationality: "Ethiopian",
      languages: "English, Amharic",
    },
  });
  console.log("About section created");

  const skills = [
    { name: "React", category: SkillCategory.FRONTEND, proficiency: 95 },
    { name: "TypeScript", category: SkillCategory.LANGUAGES, proficiency: 90 },
    { name: "Node.js", category: SkillCategory.BACKEND, proficiency: 88 },
    { name: "PostgreSQL", category: SkillCategory.DATABASE, proficiency: 85 },
    { name: "Docker", category: SkillCategory.DEVOPS, proficiency: 80 },
    { name: "Tailwind CSS", category: SkillCategory.FRONTEND, proficiency: 92 },
    { name: "Next.js", category: SkillCategory.FRONTEND, proficiency: 90 },
    { name: "Prisma", category: SkillCategory.BACKEND, proficiency: 87 },
    { name: "Git", category: SkillCategory.TOOLS, proficiency: 90 },
    { name: "Python", category: SkillCategory.LANGUAGES, proficiency: 75 },
    { name: "MongoDB", category: SkillCategory.DATABASE, proficiency: 78 },
    { name: "AWS", category: SkillCategory.DEVOPS, proficiency: 72 },
    { name: "Communication", category: SkillCategory.SOFT_SKILLS, proficiency: 90 },
    { name: "Problem Solving", category: SkillCategory.SOFT_SKILLS, proficiency: 95 },
  ];

  await prisma.skill.deleteMany({});
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({ data: { ...skills[i], order: i } });
  }
  console.log("Skills created");

  const services = [
    {
      title: "Full Stack Web Development",
      description: "Complete web applications from database to user interface, built with modern frameworks and best practices.",
      features: JSON.stringify(["React/Vue Frontend", "Node.js Backend", "PostgreSQL Database", "Responsive Design"]),
    },
    {
      title: "REST API Development",
      description: "RESTful APIs designed for scalability, security, and performance.",
      features: JSON.stringify(["RESTful Architecture", "Authentication/Authorization", "Database Design", "API Documentation"]),
    },
    {
      title: "UI/UX Implementation",
      description: "Converting designs into pixel-perfect, responsive web interfaces.",
      features: JSON.stringify(["Responsive Design", "Accessibility", "Animation & Interactivity", "Performance Optimization"]),
    },
    {
      title: "Deployment & DevOps",
      description: "CI/CD pipelines, cloud deployment, and infrastructure management.",
      features: JSON.stringify(["Docker Containerization", "CI/CD Pipelines", "Cloud Deployment", "Monitoring & Logging"]),
    },
  ];

  await prisma.service.deleteMany({});
  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({ data: { ...services[i], order: i } });
  }
  console.log("Services created");

  const experience = [
    {
      company: "Tech Company Inc",
      position: "Senior Full Stack Developer",
      description: "Led development of customer-facing web applications serving 100K+ users. Architected microservices backend and mentored junior developers.",
      startDate: new Date("2022-01-01"),
      isCurrent: true,
      technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Docker", "AWS"]),
    },
    {
      company: "Digital Agency Co",
      position: "Frontend Developer",
      description: "Developed responsive websites and web applications for various clients across industries.",
      startDate: new Date("2020-06-01"),
      endDate: new Date("2021-12-31"),
      technologies: JSON.stringify(["React", "Vue", "Tailwind CSS", "JavaScript"]),
    },
    {
      company: "StartUp Labs",
      position: "Junior Developer",
      description: "Built internal tools and contributed to the main product's frontend architecture.",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2020-05-31"),
      technologies: JSON.stringify(["JavaScript", "React", "Node.js", "MongoDB"]),
    },
  ];

  await prisma.experience.deleteMany({});
  for (let i = 0; i < experience.length; i++) {
    await prisma.experience.create({ data: { ...experience[i], order: i } });
  }
  console.log("Experience created");

  const education = [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      description: "Studied computer science with focus on web development and software engineering.",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2022-06-01"),
      isCurrent: false,
      gpa: "3.8",
      location: "Addis Ababa, Ethiopia",
      achievements: JSON.stringify(["Graduated with Distinction", "Dean's List", "Best Final Year Project"]),
      technologies: JSON.stringify(["Python", "Java", "SQL", "JavaScript"]),
      courses: JSON.stringify(["Data Structures", "Operating Systems", "Computer Networks", "Software Engineering"]),
    },
  ];

  await prisma.education.deleteMany({});
  for (let i = 0; i < education.length; i++) {
    await prisma.education.create({ data: { ...education[i], order: i } });
  }
  console.log("Education created");

  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description: "Full-stack e-commerce application with payment integration, product management, and admin dashboard.",
      category: "FULLSTACK",
      technologies: JSON.stringify(["React", "Node.js", "PostgreSQL", "Stripe", "Redux"]),
      features: JSON.stringify(["Product Catalog", "Shopping Cart", "Payment Processing", "Admin Dashboard"]),
      challenge: "Building a scalable system that handles thousands of concurrent users and transactions.",
      solution: "Implemented database optimization, caching with Redis, and horizontal scaling with load balancers.",
      lessonsLearned: "Learned the importance of early performance planning and thorough testing.",
      featured: true,
      liveUrl: "https://example-ecommerce.com",
      githubUrl: "https://github.com/user/ecommerce",
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      description: "Collaborative project management application with real-time updates and team features.",
      category: "FULLSTACK",
      technologies: JSON.stringify(["React", "Firebase", "Tailwind CSS", "Socket.io"]),
      features: JSON.stringify(["Task Management", "Team Collaboration", "Real-time Updates", "Analytics"]),
      challenge: "Implementing real-time synchronization across multiple users simultaneously.",
      solution: "Used Socket.io for real-time communication with optimistic UI updates.",
      lessonsLearned: "Understanding websocket connections and managing real-time data flow.",
      featured: true,
      liveUrl: "https://example-pm-tool.com",
      githubUrl: "https://github.com/user/pm-tool",
    },
    {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description: "Modern developer portfolio website built with React and Three.js featuring 3D visuals.",
      category: "FRONTEND",
      technologies: JSON.stringify(["React", "Three.js", "Tailwind CSS", "Framer Motion"]),
      features: JSON.stringify(["3D Hero Scene", "Responsive Design", "Dark Mode", "Animations"]),
      challenge: "Creating performant 3D graphics that work across devices.",
      solution: "Used React Three Fiber with adaptive quality based on device capabilities.",
      lessonsLearned: "Optimizing 3D rendering for different hardware configurations.",
      featured: false,
      liveUrl: "https://example-portfolio.com",
      githubUrl: "https://github.com/user/portfolio",
    },
  ];

  await prisma.project.deleteMany({});
  for (let i = 0; i < projects.length; i++) {
    await prisma.project.create({ data: { ...projects[i], order: i } });
  }
  console.log("Projects created");

  const testimonials = [
    {
      name: "John Smith",
      position: "CEO",
      company: "Tech Startup",
      rating: 5,
      review: "Sisay delivered an exceptional web application that exceeded our expectations. Professional, communicative, and highly skilled.",
      order: 0,
    },
    {
      name: "Sarah Johnson",
      position: "Product Manager",
      company: "Digital Agency",
      rating: 5,
      review: "Great developer to work with. Clean code, attention to detail, and always willing to go the extra mile.",
      order: 1,
    },
    {
      name: "Michael Chen",
      position: "CTO",
      company: "InnovateTech",
      rating: 5,
      review: "Outstanding technical skills and a true problem solver. Our project was delivered on time and built to last.",
      order: 2,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("Testimonials created");

  await prisma.setting.upsert({
    where: { id: "settings-1" },
    update: {},
    create: {
      id: "settings-1",
      siteTitle: "Sisay Temesgen - Full Stack Developer",
      siteDescription: "Professional portfolio showcasing full-stack development projects and expertise in modern web technologies.",
      siteUrl: "https://sisaytemesgen.dev",
      contactEmail: "sisay@example.com",
      contactPhone: "+251 911 234 567",
      address: "Addis Ababa, Ethiopia",
      metaKeywords: "developer, portfolio, fullstack, react, node.js, ethiopia",
      metaDescription: "Professional portfolio of Sisay Temesgen, a full-stack developer specializing in modern web applications.",
      socialLinks: JSON.stringify({
        github: "https://github.com/sisay",
        linkedin: "https://linkedin.com/in/sisay",
        twitter: "https://twitter.com/sisay",
      }),
      sectionVisibility: JSON.stringify({
        hero: true, about: true, skills: true, services: true,
        experience: true, education: true, projects: true,
        testimonials: true, contact: true, footer: true,
      }),
    },
  });
  console.log("Settings created");

  await prisma.statistic.upsert({
    where: { id: "stats-1" },
    update: {},
    create: {
      id: "stats-1",
      yearsOfExp: 5,
      projectsCount: 15,
      clientsCount: 12,
      technologiesCount: 20,
    },
  });
  console.log("Statistics created");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
