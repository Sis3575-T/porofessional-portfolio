// prisma/seed.js
import { PrismaClient, UserRole, SkillCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.dev";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword, // In production, hash this with bcrypt
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log("✓ Admin user created:", admin.email);

  // Create Hero
  const hero = await prisma.hero.upsert({
    where: { id: "hero-1" },
    update: {},
    create: {
      id: "hero-1",
      greeting: "Hello, I'm",
      name: "Alex Developer",
      title: "Full Stack Developer & UI Designer",
      description:
        "I build beautiful, responsive web applications with modern technologies. Passionate about clean code and user experience.",
      primaryCTA: "View My Work",
      secondaryCTA: "Get In Touch",
    },
  });

  console.log("✓ Hero section created");

  // Create About
  const about = await prisma.about.upsert({
    where: { id: "about-1" },
    update: {},
    create: {
      id: "about-1",
      biography:
        "I'm a full-stack developer with 5+ years of experience building web applications. I love solving complex problems and creating intuitive user interfaces.",
      summary:
        "Specialized in React, Node.js, and modern web technologies. Always learning and exploring new tools.",
      yearsOfExperience: 5,
      email: "alex@example.com",
      location: "San Francisco, USA",
      nationality: "American",
      languages: "English, Spanish",
    },
  });

  console.log("✓ About section created");

  // Create Skills
  const skills = [
    {
      name: "React",
      category: SkillCategory.FRONTEND,
      proficiency: 95,
    },
    {
      name: "TypeScript",
      category: SkillCategory.LANGUAGES,
      proficiency: 90,
    },
    {
      name: "Node.js",
      category: SkillCategory.BACKEND,
      proficiency: 88,
    },
    {
      name: "PostgreSQL",
      category: SkillCategory.DATABASE,
      proficiency: 85,
    },
    {
      name: "Docker",
      category: SkillCategory.DEVOPS,
      proficiency: 80,
    },
    {
      name: "Tailwind CSS",
      category: SkillCategory.FRONTEND,
      proficiency: 92,
    },
  ];

  // Clear existing skills to prevent unique constraint or duplicates on re-run
  await prisma.skill.deleteMany({});
  
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({
      data: {
        ...skills[i],
        order: i,
      },
    });
  }

  console.log("✓ Skills created");

  // Create Services
  const services = [
    {
      title: "Full Stack Web Development",
      description:
        "Complete web applications from database to user interface, built with modern frameworks and best practices.",
      features:
        '["React/Vue Frontend", "Node.js Backend", "PostgreSQL Database", "Responsive Design"]',
    },
    {
      title: "API Development",
      description: "RESTful and GraphQL APIs designed for scalability and performance.",
      features:
        '["RESTful Architecture", "Authentication/Authorization", "Database Design", "API Documentation"]',
    },
    {
      title: "UI/UX Implementation",
      description: "Converting designs into pixel-perfect, responsive web interfaces.",
      features:
        '["Responsive Design", "Accessibility", "Animation & Interactivity", "Performance Optimization"]',
    },
  ];

  await prisma.service.deleteMany({});
  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({
      data: {
        ...services[i],
        order: i,
      },
    });
  }

  console.log("✓ Services created");

  // Create Experience
  const experience = [
    {
      company: "Tech Company Inc",
      position: "Senior Full Stack Developer",
      description: "Led development of customer-facing web applications.",
      startDate: new Date("2022-01-01"),
      isCurrent: true,
      technologies:
        '["React", "Node.js", "PostgreSQL", "Docker", "AWS"]',
    },
    {
      company: "Digital Agency Co",
      position: "Frontend Developer",
      description: "Developed responsive websites and web applications for various clients.",
      startDate: new Date("2020-06-01"),
      endDate: new Date("2021-12-31"),
      technologies: '["React", "Vue", "Tailwind CSS", "JavaScript"]',
    },
  ];

  await prisma.experience.deleteMany({});
  for (let i = 0; i < experience.length; i++) {
    await prisma.experience.create({
      data: {
        ...experience[i],
        order: i,
      },
    });
  }

  console.log("✓ Experience created");

  // Create Education
  const education = [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      description: "Studied computer science with focus on web development.",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2022-06-01"),
      gpa: "3.8",
    },
  ];

  await prisma.education.deleteMany({});
  for (let i = 0; i < education.length; i++) {
    await prisma.education.create({
      data: {
        ...education[i],
        order: i,
      },
    });
  }

  console.log("✓ Education created");

  // Create Projects
  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description: "Full-stack e-commerce application with payment integration.",
      category: "FULLSTACK",
      technologies:
        '["React", "Node.js", "PostgreSQL", "Stripe", "Redux"]',
      features:
        '["Product Catalog", "Shopping Cart", "Payment Processing", "Admin Dashboard"]',
      challenge:
        "Building a scalable system that handles thousands of concurrent users.",
      solution:
        "Implemented database optimization, caching, and load balancing.",
      lessonsLearned:
        "Learned importance of early performance planning and optimization.",
      featured: true,
      liveUrl: "https://example-ecommerce.com",
      githubUrl: "https://github.com/user/ecommerce",
    },
    {
      title: "Project Management Tool",
      slug: "project-management-tool",
      description:
        "Collaborative project management application with real-time updates.",
      category: "FULLSTACK",
      technologies:
        '["React", "Firebase", "Tailwind CSS", "Socket.io"]',
      features:
        '["Task Management", "Team Collaboration", "Real-time Updates", "Analytics"]',
      challenge: "Implementing real-time synchronization across users.",
      solution:
        "Used Socket.io for real-time communication and Firebase for data persistence.",
      lessonsLearned:
        "Understanding websocket connections and real-time data handling.",
      featured: true,
      liveUrl: "https://example-pm-tool.com",
      githubUrl: "https://github.com/user/pm-tool",
    },
  ];

  await prisma.project.deleteMany({});
  for (let i = 0; i < projects.length; i++) {
    await prisma.project.create({
      data: {
        ...projects[i],
        order: i,
      },
    });
  }

  console.log("✓ Projects created");

  // Create Testimonials
  const testimonials = [
    {
      name: "John Smith",
      position: "CEO",
      company: "Tech Startup",
      rating: 5,
      review:
        "Alex delivered an exceptional web application that exceeded our expectations. Professional, communicative, and highly skilled.",
      order: 0,
    },
    {
      name: "Sarah Johnson",
      position: "Product Manager",
      company: "Digital Agency",
      rating: 5,
      review:
        "Great developer to work with. Clean code, attention to detail, and always willing to go the extra mile.",
      order: 1,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log("✓ Testimonials created");

  // Create Settings
  const settings = await prisma.setting.upsert({
    where: { id: "settings-1" },
    update: {},
    create: {
      id: "settings-1",
      siteTitle: "Alex - Full Stack Developer",
      siteDescription:
        "Professional portfolio showcasing full-stack development projects and expertise.",
      siteUrl: "https://yourportfolio.com",
      contactEmail: "alex@example.com",
      contactPhone: "+1 (555) 123-4567",
      address: "San Francisco, USA",
      metaKeywords: "developer, portfolio, fullstack, react, node.js",
      metaDescription:
        "Professional portfolio of Alex, a full-stack developer specializing in modern web applications.",
      socialLinks:
        '{"github": "https://github.com/user", "linkedin": "https://linkedin.com/in/user", "twitter": "https://twitter.com/user"}',
    },
  });

  console.log("✓ Settings created");

  // Create Statistics
  const stats = await prisma.statistic.upsert({
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

  console.log("✓ Statistics created");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
