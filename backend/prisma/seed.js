import { UserRole, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../shared/utils/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function seedIfEmpty(model, name, dataFn) {
  const count = await model.count();
  if (count === 0) {
    await dataFn();
    console.log(`${name} seeded`);
  } else {
    console.log(`${name} skipped (already has ${count} records)`);
  }
}

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "Sis3575@";
  const adminEmail = (process.env.ADMIN_EMAIL || "sisay3575@gmail.com").trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const emailsToEnsure = Array.from(new Set([adminEmail, "sisay3575@gmail.com", "sisay@example.com"]));
  for (const email of emailsToEnsure) {
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      },
      create: {
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
  }
  console.log("Admin user(s) ensured:", emailsToEnsure.join(", "));

  await prisma.hero.upsert({
    where: { id: "hero-1" },
    update: {},
    create: {
      id: "hero-1",
      greeting: "I am",
      name: "Sisay Temesgen",
      title: "Full-Stack Developer & AI Learner",
      description: "I build responsive, high-performance web applications with JavaScript, React, Node.js, Express, MongoDB, and PostgreSQL, while exploring AI workflows and modern architectures.",
      primaryCTA: "View Projects",
      secondaryCTA: "Contact Me",
      profileImage: "/uploads/media_1793222119216_72m8hcd.jpg",
    },
  });
  console.log("Hero section ensured");

  await prisma.about.upsert({
    where: { id: "about-1" },
    update: {},
    create: {
      id: "about-1",
      name: "Sisay Temesgen",
      biography: "I am a dedicated full-stack developer and AI learner focused on building fast, accessible, and resilient web applications. With hands-on expertise across JavaScript, React, Node.js, Express, MongoDB, and PostgreSQL, I engineer clean APIs, intuitive interfaces, and efficient databases.",
      summary: "Specialized in JavaScript, React, Node.js, Express, MongoDB, and PostgreSQL. Passionate about AI integration and scalable software architectures.",
      yearsOfExperience: 3,
      email: "sisay3575@gmail.com",
      phone: "0935756054",
      downloadCVUrl: "/Sisay_Temesgen_CV.pdf",
      location: "Bahir Dar, Ethiopia",
      nationality: "Ethiopian",
      languages: "English, Amharic",
      availability: "Available for projects",
    },
  });
  console.log("About section ensured");

  await seedIfEmpty(prisma.skill, "Skills", async () => {
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
    for (let i = 0; i < skills.length; i++) {
      await prisma.skill.create({ data: { ...skills[i], order: i } });
    }
  });

  await seedIfEmpty(prisma.service, "Services", async () => {
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
    for (let i = 0; i < services.length; i++) {
      await prisma.service.create({ data: { ...services[i], order: i } });
    }
  });

  await seedIfEmpty(prisma.experience, "Experience", async () => {
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
    for (let i = 0; i < experience.length; i++) {
      await prisma.experience.create({ data: { ...experience[i], order: i } });
    }
  });

  await seedIfEmpty(prisma.education, "Education", async () => {
    const education = [
      {
        institution: "Bahir Dar University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        description: "Studied computer science with focus on web development, software engineering, algorithms, and AI.",
        startDate: new Date("2024-01-01"),
        isCurrent: true,
        location: "Bahir Dar, Ethiopia",
        technologies: JSON.stringify(["Python", "Java", "SQL", "JavaScript"]),
        courses: JSON.stringify(["Data Structures", "Operating Systems", "Computer Networks", "Software Engineering"]),
      },
    ];
    for (let i = 0; i < education.length; i++) {
      await prisma.education.create({ data: { ...education[i], order: i } });
    }
  });

  await seedIfEmpty(prisma.project, "Projects", async () => {
    const projects = [
      {
        title: "Abay Car Rental System",
        slug: "abay-car-rental-system",
        description: "Abay Car Rental system is a user-friendly web application that allows customers to browse available vehicles, compare prices, and book cars online with ease. It provides secure booking management, customer accounts, and an admin dashboard for managing vehicles, reservations, payments, and customer.",
        shortDescription: "Complete vehicle booking platform with customer accounts and admin vehicle/fleet management.",
        thumbnail: "/uploads/media_1793299777754_y4o6uxh.png",
        category: "FULLSTACK",
        technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
        features: JSON.stringify(["Vehicle Catalog", "Online Booking", "Customer Portal", "Fleet Management"]),
        featured: true,
        liveUrl: "https://frontend-snowy-ten-96.vercel.app/",
        githubUrl: "https://github.com/Sis3575-T",
      },
      {
        title: "Abay Grand Hotel",
        slug: "abay-grand-hotel",
        description: "Elegant hotel booking and management system with stunning design and seamless user experience. Features include room reservations, availability calendar, guest management, and online booking with real-time updates. A modern hospitality solution built for luxury accommodations.",
        shortDescription: "Modern luxury hotel booking system with real-time room reservations and guest management.",
        thumbnail: "/uploads/media_1793300382530_9fr1dq0.png",
        category: "FULLSTACK",
        technologies: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
        features: JSON.stringify(["Room Booking", "Availability Calendar", "Guest Management", "Online Payments"]),
        featured: true,
        liveUrl: "https://abay-grand-hotel-1.vercel.app/",
        githubUrl: "https://github.com/Sis3575-T/Abay-Grand_Hotels",
      },
    ];
    for (let i = 0; i < projects.length; i++) {
      await prisma.project.create({ data: { ...projects[i], order: i } });
    }
  });

  await seedIfEmpty(prisma.testimonial, "Testimonials", async () => {
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
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }
  });

  await prisma.setting.upsert({
    where: { id: "settings-1" },
    update: {},
    create: {
      id: "settings-1",
      siteTitle: "Sisay Temesgen - Full Stack Developer",
      siteDescription: "Professional portfolio showcasing full-stack development projects and expertise in modern web technologies.",
      siteUrl: "https://sisaytemesgen.dev",
      contactEmail: "sisay3575@gmail.com",
      contactPhone: "0935756054",
      address: "Addis Ababa, Ethiopia",
      metaKeywords: "developer, portfolio, fullstack, react, node.js, ethiopia, ai",
      metaDescription: "Professional portfolio of Sisay Temesgen, a full-stack developer and AI learner specializing in modern web applications.",
      socialLinks: JSON.stringify({
        github: "https://github.com/Sis3575-T",
        linkedin: "https://www.linkedin.com/in/sisay-temesgen-412290447/",
        telegram: "https://t.me/sisaytem",
      }),
      sectionVisibility: JSON.stringify({
        hero: true, about: true, skills: true, services: true,
        experience: true, education: true, projects: true,
        testimonials: true, contact: true, footer: true,
      }),
    },
  });
  console.log("Settings ensured");

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
  console.log("Statistics ensured");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
