// Mock data for METECHQ Agency Website

export const agencyInfo = {
  name: 'METECHQ',
  tagline: 'Crafting Digital Excellence',
  description: 'Full-stack web development agency specializing in custom solutions',
  developer: 'Maneesh',
  email: 'contact@metechq.com',
  phone: '+1 (555) 123-4567',
  location: 'Worldwide',
  whatsapp: '+918328284501',
  socialLinks: {
    github: 'https://github.com/metechq',
    linkedin: 'https://linkedin.com/in/maneesh',
    twitter: 'https://twitter.com/metechq',
    instagram: 'https://instagram.com/metechq',
    whatsapp: '+918328284501'
  }
};

export const services = [
  {
    id: 1,
    title: 'Custom Website Development',
    description: 'Tailored web solutions built with modern technologies to meet your unique business needs.',
    icon: 'Code',
    color: '#f4d9a0'
  },
  {
    id: 2,
    title: 'E-commerce Solutions',
    description: 'Complete online store development with secure payment integration and inventory management.',
    icon: 'ShoppingCart',
    color: '#efdab8'
  },
  {
    id: 3,
    title: 'Full-Stack Development',
    description: 'End-to-end application development using cutting-edge frontend and backend technologies.',
    icon: 'Layers',
    color: '#f4d9a0'
  },
  {
    id: 4,
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces designed to enhance user experience and drive engagement.',
    icon: 'Palette',
    color: '#efdab8'
  }
];

// Detailed Services Data for Services Page
export const detailedServices = [
  {
    id: 1,
    icon: 'Code',
    title: 'Custom Website Development',
    description: 'Bespoke websites tailored to your brand identity and business goals. We create stunning, high-performance websites that captivate your audience and drive results. From concept to launch, we handle every aspect with precision and creativity.',
    features: [
      'Responsive & Mobile-First Design',
      'SEO Optimized Structure',
      'Lightning-Fast Performance',
      'Modern UI/UX Best Practices',
      'Cross-Browser Compatibility'
    ]
  },
  {
    id: 2,
    icon: 'ShoppingCart',
    title: 'E-commerce Solutions',
    description: 'Complete online stores that convert browsers into buyers. Secure payment integrations, inventory management, and seamless checkout experiences that boost your sales and delight your customers. Built for scalability and growth.',
    features: [
      'Secure Payment Gateway Integration',
      'Product & Inventory Management',
      'Shopping Cart & Checkout Flow',
      'Order Tracking & Management',
      'Analytics & Sales Reports'
    ]
  },
  {
    id: 3,
    icon: 'Layers',
    title: 'Full-Stack Development',
    description: 'End-to-end application development from robust backends to stunning frontends. We build scalable, maintainable applications using the latest technologies. Complete solutions deployed on cloud infrastructure for maximum reliability.',
    features: [
      'RESTful API Development',
      'Database Design & Optimization',
      'Cloud Deployment (AWS/Azure)',
      'Authentication & Security',
      'Real-time Features & WebSockets'
    ]
  },
  {
    id: 4,
    icon: 'Palette',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that enhance user experience and drive engagement. We design with purpose, focusing on user behavior and business objectives. Every interaction is carefully crafted for maximum impact.',
    features: [
      'User Research & Personas',
      'Wireframing & Prototyping',
      'Visual Design & Branding',
      'Usability Testing',
      'Design System Creation'
    ]
  }
];

// Why Choose Us Data
export const whyChooseUs = [
  {
    id: 1,
    icon: 'Zap',
    title: 'Fast Delivery',
    description: 'We value your time. Projects are delivered on schedule without compromising quality through efficient workflows and agile methodologies.'
  },
  {
    id: 2,
    icon: 'Award',
    title: 'Premium Quality',
    description: 'Excellence in every detail. Clean code, beautiful design, and robust functionality that stands the test of time.'
  },
  {
    id: 3,
    icon: 'Smartphone',
    title: 'Responsive Design',
    description: 'Flawless experiences across all devices. Mobile-first approach ensures your website looks stunning everywhere.'
  },
  {
    id: 4,
    icon: 'Code2',
    title: 'Full-Stack Expertise',
    description: 'Complete solutions from frontend to backend. We handle the entire technology stack with expertise and precision.'
  },
  {
    id: 5,
    icon: 'Search',
    title: 'SEO Optimized',
    description: 'Built for search engines from the ground up. Semantic HTML, fast loading, and best practices for maximum visibility.'
  },
  {
    id: 6,
    icon: 'Shield',
    title: 'Secure & Reliable',
    description: 'Security is paramount. Industry-standard practices, encrypted connections, and regular security audits.'
  }
];

// Process/Workflow Steps
export const processSteps = [
  {
    id: 1,
    number: '01',
    title: 'Requirement Analysis',
    description: 'We start by understanding your business goals, target audience, and project requirements in detail.',
    icon: 'FileSearch'
  },
  {
    id: 2,
    number: '02',
    title: 'UI/UX Planning',
    description: 'Creating wireframes, prototypes, and design systems that align with your brand and user needs.',
    icon: 'Palette'
  },
  {
    id: 3,
    number: '03',
    title: 'Development',
    description: 'Building your solution using modern technologies with clean, maintainable, and scalable code.',
    icon: 'Code'
  },
  {
    id: 4,
    number: '04',
    title: 'Testing',
    description: 'Rigorous testing across devices, browsers, and scenarios to ensure flawless functionality.',
    icon: 'CheckCircle2'
  },
  {
    id: 5,
    number: '05',
    title: 'Deployment',
    description: 'Launching your project with optimized configurations and smooth transitions to production.',
    icon: 'Rocket'
  },
  {
    id: 6,
    number: '06',
    title: 'Support & Maintenance',
    description: 'Ongoing support, updates, and enhancements to keep your solution running perfectly.',
    icon: 'HeartHandshake'
  }
];

export const projects = [
  {
    "id": "aishu-foods-ecommerce",
    "title": "AISHU FOODS | Authentic Delicacies & E-Commerce Platform",
    "slug": "aishu-foods-ecommerce",
    "category": "E-commerce",
    "description": "Handcrafted authentic delicacies, traditional Andhra pickles, and pure ghee sweets with seamless online ordering.",
    "image_url": "/images/projects/aishufoods-cover.png",
    "tech_stack": [
      "E-Commerce",
      "React",
      "Node.js",
      "Payment Gateway",
      "Order Tracking"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "https://aishufoods.com/",
    "case_study_content": "AISHU FOODS brings traditional culinary heritage to digital commerce. Engineered for high performance, intuitive product browsing, and mobile-friendly shopping.",
    "status": "completed",
    "github_url": "",
    "client_name": "Aishu Foods",
    "demo_video_url": null,
    "gallery_images": [
      "/images/projects/aishufoods-cover.png"
    ],
    "project_duration": "4 months",
    "team_size": "3 developers",
    "key_features": [
      "Authentic traditional delicacies and pickle catalog",
      "Streamlined product browsing with high-resolution imagery",
      "Mobile-optimized shopping cart and checkout",
      "Integrated secure payment options and order fulfillment"
    ]
  },
  {
    "id": "studio-photography-portfolio",
    "title": "Photography & Creative Portfolio",
    "slug": "studio-photography-portfolio",
    "category": "Photography & Studio",
    "description": "Elegant studio and photography portfolio website showcasing high-resolution gallery collections, visual storytelling, and client booking.",
    "image_url": "/images/projects/studio-website-cover.png",
    "tech_stack": [
      "React",
      "Tailwind CSS",
      "Portfolio",
      "Responsive Web Design"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "https://studio-website-orcin-five.vercel.app/",
    "case_study_content": "Developed for photographers and creative visual studios, emphasizing aesthetics, fast asset loading, and seamless navigation across all devices.",
    "status": "completed",
    "github_url": "",
    "client_name": "Creative Studio",
    "demo_video_url": null,
    "gallery_images": [
      "/images/projects/studio-website-cover.png"
    ],
    "project_duration": "2 months",
    "team_size": "2 developers",
    "key_features": [
      "Curated photo galleries with responsive grid layouts",
      "High-speed image loading and smooth transitions",
      "Service packages showcase and appointment booking inquiries",
      "Client testimonials and behind-the-scenes portfolio storytelling"
    ]
  },
  {
    "id": "shopify-ecommerce-platform",
    "title": "StyleHub E-Commerce Platform",
    "slug": "shopify-ecommerce-platform",
    "category": "E-commerce",
    "description": "Modern online shopping experience with seamless checkout, inventory management, and secure multi-currency payments.",
    "image_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "Node.js",
      "Stripe",
      "Tailwind CSS",
      "MongoDB"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/ecommerce",
    "case_study_content": "Engineered a high-conversion e-commerce platform with real-time stock updates, automated tax calculation, and synchronized checkout flows.",
    "status": "completed",
    "github_url": "",
    "client_name": "Fashion Retail Co.",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop"
    ],
    "project_duration": "3 months",
    "team_size": "4 developers",
    "key_features": [
      "Complete product catalog with 16+ products across 4 categories",
      "Advanced filtering by category, price range, and search",
      "Product detail pages with multi-angle image zoom",
      "Persistent shopping cart and automated discounts"
    ]
  },
  {
    "id": "corporate-website-redesign",
    "title": "TechVentures Inc. Corporate Website",
    "slug": "corporate-website-redesign",
    "category": "Corporate Website",
    "description": "High-performance enterprise website showcasing technology solutions, leadership team, and investor relations.",
    "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    "tech_stack": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/corporate",
    "case_study_content": "Modernized an enterprise legacy site into a fast, accessible, and responsive corporate hub with 99+ Lighthouse performance score.",
    "status": "completed",
    "github_url": "",
    "client_name": "TechVentures Inc.",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    "project_duration": "2 months",
    "team_size": "3 developers",
    "key_features": [
      "Company statistics with animated counter metrics",
      "Executive leadership profiles with interactive bios",
      "Enterprise solution comparison tables",
      "Integrated press release and investor resource center"
    ]
  },
  {
    "id": "analytics-dashboard",
    "title": "Analytics Dashboard Pro",
    "slug": "analytics-dashboard",
    "category": "Dashboard",
    "description": "Real-time business intelligence and data visualization platform with customizable widgets and export capabilities.",
    "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "FastAPI",
      "Recharts",
      "Tailwind CSS",
      "MongoDB"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/analytics",
    "case_study_content": "Designed and developed an end-to-end data reporting dashboard capable of aggregating 1M+ daily telemetry events with sub-second response times.",
    "status": "completed",
    "github_url": "",
    "client_name": "DataMetrics Global",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
    ],
    "project_duration": "4 months",
    "team_size": "3 developers",
    "key_features": [
      "Real-time event streaming and metric cards",
      "Dynamic chart timeframes (7d, 30d, 90d, custom)",
      "Automated PDF and CSV report exporting",
      "Role-based access control and team workspace sharing"
    ]
  },
  {
    "id": "restaurant-booking-platform",
    "title": "Restaurant Booking Platform",
    "slug": "restaurant-booking-platform",
    "category": "Web Application",
    "description": "Real-time restaurant reservation system with table allocation, SMS confirmations, and digital menus.",
    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "FastAPI",
      "MongoDB",
      "Twilio",
      "Tailwind CSS"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/restaurant",
    "case_study_content": "Reduced table booking no-shows by 45% with automated reminder notifications and real-time floor plan seating synchronization.",
    "status": "completed",
    "github_url": "",
    "client_name": "Gourmet Hospitality Group",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
    ],
    "project_duration": "3 months",
    "team_size": "3 developers",
    "key_features": [
      "Interactive floor plan table selection",
      "Real-time slot availability without double booking",
      "Automated confirmation and reminder SMS / emails",
      "Digital menu viewer with dietary restriction filters"
    ]
  },
  {
    "id": "educational-lms-platform",
    "title": "EduLearn - Educational LMS Platform",
    "slug": "educational-lms-platform",
    "category": "Web Application",
    "description": "Learning management system with video courses, interactive quizzes, progress tracking, and certificate issuance.",
    "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "FastAPI",
      "MongoDB",
      "Video.js",
      "Tailwind CSS"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/lms",
    "case_study_content": "Built to support concurrent student video streaming with bandwidth-adaptive video playback, chapter bookmarking, and automated certification workflows.",
    "status": "completed",
    "github_url": "",
    "client_name": "EduLearn Academy",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop"
    ],
    "project_duration": "5 months",
    "team_size": "5 developers",
    "key_features": [
      "Interactive video curriculum player with chapter navigation",
      "Real-time learner progress tracking and quiz assessments",
      "Discussion forums for student-instructor engagement",
      "Automated PDF certificate generation upon course completion"
    ]
  },
  {
    "id": "real-estate-portal",
    "title": "Real Estate Listing Portal",
    "slug": "real-estate-portal",
    "category": "Web Application",
    "description": "Property listing and brokerage platform with interactive maps, virtual tours, and agent scheduling.",
    "image_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "FastAPI",
      "Mapbox",
      "MongoDB",
      "Cloudinary"
    ],
    "featured": true,
    "is_private": false,
    "live_demo_url": "/demo/real-estate",
    "case_study_content": "Engineered a lightning-fast property search with Mapbox cluster markers, polygon boundary filtering, and automated mortgage calculation tools.",
    "status": "completed",
    "github_url": "",
    "client_name": "PrimeEstates Realty",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
    ],
    "project_duration": "4 months",
    "team_size": "4 developers",
    "key_features": [
      "Interactive Mapbox property locator with price clusters",
      "Comprehensive filter engine (beds, baths, square footage, amenities)",
      "Mortgage and monthly payment estimate calculators",
      "Agent contact and showing schedule booking form"
    ]
  },
  {
    "id": "mobile-app-design-system",
    "title": "FitLife Mobile App Design System",
    "slug": "mobile-app-design-system",
    "category": "UI/UX Design",
    "description": "Design system and cross-platform UI component library for health and wellness tracking applications.",
    "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    "tech_stack": [
      "Figma",
      "React Native",
      "Tailwind CSS",
      "Storybook",
      "TypeScript"
    ],
    "featured": false,
    "is_private": false,
    "live_demo_url": "/demo/fitness-app",
    "case_study_content": "Unified brand design tokens, typography scales, and accessible color palettes into an atomic design system adopted across web and mobile clients.",
    "status": "completed",
    "github_url": "",
    "client_name": "FitLife Tech",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop"
    ],
    "project_duration": "3 months",
    "team_size": "2 designers",
    "key_features": [
      "Atomic design token architecture across light and dark modes",
      "Workout routine planners and calendar visualizations",
      "Biometric heart-rate and step counter integration widgets",
      "Comprehensive Storybook documentation and living styleguide"
    ]
  },
  {
    "id": "saas-landing-page",
    "title": "TaskFlow Pro - SaaS Product Landing Page",
    "slug": "saas-landing-page",
    "category": "Landing Page",
    "description": "High-converting SaaS product marketing page with interactive product tour, pricing calculator, and lead capture.",
    "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    "tech_stack": [
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
      "Stripe"
    ],
    "featured": false,
    "is_private": false,
    "live_demo_url": "/demo/saas-landing",
    "case_study_content": "Achieved a 34% increase in signup conversion rate by streamlining the feature demonstration and adding interactive monthly/annual pricing toggles.",
    "status": "completed",
    "github_url": "",
    "client_name": "TaskFlow Software",
    "demo_video_url": null,
    "gallery_images": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    "project_duration": "1 month",
    "team_size": "2 developers",
    "key_features": [
      "Interactive product workflow demonstration simulator",
      "Tiered billing pricing calculator with annual discount toggle",
      "Customer social proof section with verified case studies",
      "A/B test ready hero section with lead capture forms"
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'TechStart Inc',
    role: 'CEO',
    content: 'METECHQ delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'Digital Ventures',
    role: 'CTO',
    content: 'Working with Maneesh was a pleasure. The full-stack solution was delivered on time and the code quality is top-notch.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    company: 'Creative Studio',
    role: 'Design Director',
    content: 'The UI/UX work was phenomenal. They truly understand how to create engaging user experiences.',
    rating: 5
  }
];

export const stats = [
  { label: 'Projects Completed', value: '50+' },
  { label: 'Happy Clients', value: '35+' },
  { label: 'Years Experience', value: '5+' },
  { label: 'Technologies', value: '20+' }
];

export const skills = [
  'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js',
  'Python', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Git',
  'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Figma'
];

// Contact Page Configuration (Admin-ready)
export const contactConfig = {
  hero: {
    title: 'Get in Touch',
    subtitle: 'Let\'s discuss your project and bring your vision to life',
    description: 'We\'re here to help you transform your ideas into reality. Reach out and let\'s start building something amazing together.',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Contact', path: '/contact' }
    ]
  },

  form: {
    title: 'Send Us a Message',
    subtitle: 'Fill out the form below and we\'ll get back to you within 24 hours',
    fields: {
      fullName: {
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
        type: 'text'
      },
      email: {
        label: 'Email Address',
        placeholder: 'john@example.com',
        required: true,
        type: 'email'
      },
      phone: {
        label: 'Phone Number',
        placeholder: '+1 (555) 123-4567',
        required: false,
        type: 'tel'
      },
      service: {
        label: 'Service Interested In',
        placeholder: 'Select a service',
        required: true,
        type: 'select',
        options: [
          { value: '', label: 'Select a service' },
          { value: 'website', label: 'Website Development' },
          { value: 'ecommerce', label: 'E-commerce Solutions' },
          { value: 'fullstack', label: 'Full Stack Development' },
          { value: 'uiux', label: 'UI/UX Design' },
          { value: 'consulting', label: 'Technical Consulting' },
          { value: 'other', label: 'Other Services' }
        ]
      },
      budget: {
        label: 'Project Budget (Optional)',
        placeholder: 'Select your budget range',
        required: false,
        type: 'select',
        options: [
          { value: '', label: 'Select budget range' },
          { value: 'small', label: 'Under $5,000' },
          { value: 'medium', label: '$5,000 - $15,000' },
          { value: 'large', label: '$15,000 - $50,000' },
          { value: 'enterprise', label: '$50,000+' },
          { value: 'discuss', label: 'Let\'s Discuss' }
        ]
      },
      message: {
        label: 'Message',
        placeholder: 'Tell us about your project, goals, and timeline...',
        required: true,
        type: 'textarea',
        rows: 6
      },
      consent: {
        label: 'I agree to the privacy policy and terms of service',
        required: true,
        type: 'checkbox'
      }
    },
    submitButton: {
      text: 'Send Message',
      loadingText: 'Sending...',
      successText: 'Message Sent!'
    },
    messages: {
      success: {
        title: 'Message Sent Successfully!',
        description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.'
      },
      error: {
        title: 'Oops! Something went wrong',
        description: 'Please check your information and try again.'
      }
    }
  },

  contactInfo: {
    title: 'Contact Information',
    subtitle: 'Feel free to reach out through any of these channels. We\'re here to help!',
    cards: [
      {
        id: 1,
        icon: 'Mail',
        label: 'Email Address',
        value: 'contact@metechq.com',
        href: 'mailto:contact@metechq.com',
        description: 'Send us an email anytime'
      },
      {
        id: 2,
        icon: 'Phone',
        label: 'Phone Number',
        value: '+91 8328284501',
        href: 'tel:+918328284501',
        description: 'Available Mon-Sat, 9 AM - 6 PM'
      },
      {
        id: 3,
        icon: 'Clock',
        label: 'Business Hours',
        value: 'Mon - Sat: 9 AM - 6 PM',
        description: 'We typically respond within 24 hours'
      },
      {
        id: 4,
        icon: 'MapPin',
        label: 'Location',
        value: 'India',
        description: 'Serving clients worldwide'
      }
    ]
  },

  businessHours: {
    title: 'Business Hours',
    schedule: [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', available: true },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM', available: true },
      { day: 'Sunday', hours: 'Closed', available: false }
    ],
    timezone: 'IST (Indian Standard Time)',
    note: 'We respond to all inquiries within 24 business hours'
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions about working with us',
    questions: [
      {
        id: 1,
        question: 'What is your typical response time?',
        answer: 'We aim to respond to all inquiries within 24 business hours. For urgent matters, please mention it in your message and we\'ll prioritize accordingly.'
      },
      {
        id: 2,
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary based on complexity and scope. A simple website takes 2-3 weeks, while complex e-commerce or full-stack applications can take 6-12 weeks. We\'ll provide a detailed timeline after discussing your requirements.'
      },
      {
        id: 3,
        question: 'What is your pricing model?',
        answer: 'We offer flexible pricing based on project requirements: fixed-price for well-defined projects, hourly rates for ongoing work, and retainer packages for long-term partnerships. We provide detailed quotes after understanding your needs.'
      },
      {
        id: 4,
        question: 'Do you provide support after project delivery?',
        answer: 'Yes! All projects include 30 days of free post-launch support for bug fixes and minor adjustments. We also offer ongoing maintenance packages for continuous support, updates, and enhancements.'
      },
      {
        id: 5,
        question: 'Can you work with existing projects?',
        answer: 'Absolutely! We can take over existing projects, add new features, fix issues, or provide consultation on improvements. We\'ll review your codebase and provide recommendations.'
      }
    ]
  },

  cta: {
    title: 'Ready to Start Your Project?',
    subtitle: 'Let\'s turn your vision into reality',
    description: 'Join 35+ satisfied clients who have transformed their businesses with our solutions',
    primaryButton: {
      text: 'Request a Quote',
      link: '#contact-form'
    },
    secondaryButton: {
      text: 'View Portfolio',
      link: '/portfolio'
    },
    stats: [
      { value: '35+', label: 'Happy Clients' },
      { value: '50+', label: 'Projects Delivered' },
      { value: '24hrs', label: 'Response Time' }
    ]
  }
};

// About Page Data
export const aboutData = {
  hero: {
    title: 'About METECHQ',
    subtitle: 'Crafting Digital Excellence Through Innovation & Precision',
    description: 'Building exceptional digital experiences that transform businesses and delight users worldwide.'
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      'Founded by Maneesh, a passionate and skilled full-stack developer, METECHQ was born from a vision to help businesses thrive in the digital age. With expertise spanning across HTML, CSS, JavaScript, and modern frameworks, we bring ideas to life with precision and creativity.',
      'At METECHQ, we specialize in full-stack development, creating custom websites and e-commerce platforms that don\'t just look beautiful—they perform exceptionally. Every project is approached with meticulous attention to detail, ensuring seamless user experiences and robust functionality.',
      'Our journey is defined by continuous learning, adopting cutting-edge technologies, and delivering solutions that exceed expectations. From sleek corporate websites to complex web applications, we transform visions into powerful digital realities.'
    ],
    expertise: [
      'Full-Stack Web Development',
      'Custom Website Design & Development',
      'E-commerce Website Solutions',
      'Responsive & Mobile-First Design',
      'API Development & Integration',
      'Performance Optimization'
    ]
  },
  values: [
    {
      id: 1,
      icon: 'Award',
      title: 'Excellence',
      description: 'We strive for excellence in every line of code, every design decision, and every client interaction. Quality is never compromised, and every project reflects our commitment to perfection.'
    },
    {
      id: 2,
      icon: 'Target',
      title: 'Innovation',
      description: 'Staying ahead of technology trends and implementing cutting-edge solutions that give our clients a competitive advantage. We embrace new technologies and methodologies to deliver modern solutions.'
    },
    {
      id: 3,
      icon: 'Zap',
      title: 'Efficiency',
      description: 'Delivering projects on time without sacrificing quality. We value your time and ensure smooth, efficient project execution with clear communication and agile methodologies.'
    },
    {
      id: 4,
      icon: 'Shield',
      title: 'Transparency',
      description: 'Open communication and honesty in every interaction. We believe in building trust through transparency, keeping you informed at every stage of the development process.'
    }
  ],
  founder: {
    name: 'Maneesh',
    role: 'Full-Stack Developer & Founder',
    bio: 'With a passion for creating seamless digital experiences, Maneesh brings years of expertise in full-stack development, specializing in modern web technologies. His commitment to excellence and innovation drives METECHQ to deliver exceptional results for every client.',
    skills: [
      'HTML, CSS, JavaScript',
      'React & Node.js',
      'Full-Stack Development',
      'E-commerce Solutions',
      'API Development',
      'Database Design'
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  achievements: [
    { id: 1, value: '50+', label: 'Projects Completed', icon: 'Briefcase' },
    { id: 2, value: '35+', label: 'Happy Clients', icon: 'Users' },
    { id: 3, value: '3+', label: 'Years Experience', icon: 'TrendingUp' },
    { id: 4, value: '10+', label: 'Technologies', icon: 'Layers' }
  ],
  techStack: [
    { name: 'HTML5', category: 'Frontend' },
    { name: 'CSS3', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'REST APIs', category: 'Integration' },
    { name: 'Git', category: 'Tools' },
    { name: 'Docker', category: 'Tools' },
    { name: 'AWS', category: 'Cloud' }
  ],
  cta: {
    title: "Let's Build Your Next Project",
    description: 'Ready to transform your vision into reality? Get in touch and let\'s create something extraordinary together.',
    buttonText: 'Get in Touch',
    buttonLink: '/contact'
  }
};

// Enhanced Portfolio Projects with Full Details (Admin-ready structure)
export const portfolioProjects = [
  {
    id: 'aishu-foods-ecommerce',
    slug: 'aishu-foods-ecommerce',
    title: 'AISHU FOODS | Authentic Delicacies & E-Commerce Platform',
    shortDesc: 'Handcrafted authentic delicacies, traditional Andhra pickles, and pure ghee sweets with seamless online ordering',
    description: 'A dedicated e-commerce brand platform offering authentic culinary delicacies, traditional Andhra pickles, and pure ghee sweets with high-performance browsing and secure ordering.',
    longDesc: 'AISHU FOODS represents authentic culinary tradition brought into modern digital commerce. Built for food lovers and diaspora customers looking for authentic handcrafted recipes, traditional Andhra pickles, and sweets. The platform features responsive product showcases, streamlined shopping cart, and smooth checkout.',
    category: 'E-commerce',
    image: '/images/projects/aishufoods-cover.png',
    images: [
      '/images/projects/aishufoods-cover.png'
    ],
    technologies: ['E-Commerce', 'React', 'Node.js', 'Payment Gateway', 'Order Tracking'],
    techStack: ['React', 'E-Commerce', 'Tailwind CSS', 'Payment Gateway', 'Responsive Design'],
    featured: true,
    githubLink: null,
    liveLink: 'https://aishufoods.com/',
    date: '2025-01-15',
    clientName: 'Aishu Foods',
    role: 'Full-Stack Development & E-Commerce Engineering',
    views: 2450,
    metrics: {
      users: '15,000+',
      increase: '+320%',
      revenue: '+210%'
    },
    features: [
      'Authentic traditional delicacies and pickle catalog',
      'Streamlined product browsing with high-resolution imagery',
      'Mobile-optimized shopping cart and checkout',
      'Integrated secure payment options and order fulfillment'
    ],
    challenges: [
      {
        title: 'Performance & Imagery',
        description: 'Optimized high-resolution product imagery and mobile responsiveness to ensure fast page loads for customers across regions.'
      }
    ],
    solutions: [
      {
        title: 'Responsive Cart & Checkout',
        description: 'Developed an intuitive variant selection and cart system tailored for quick ordering on mobile devices.'
      }
    ]
  },
  {
    id: 'studio-photography-portfolio',
    slug: 'studio-photography-portfolio',
    title: 'Metechq Studio | Photography & Creative Portfolio',
    shortDesc: 'Modern photography and creative studio website showcasing high-resolution gallery collections and client booking',
    description: 'A stylish, responsive portfolio website designed for creative professionals and visual studios, featuring full-screen galleries and inquiry booking.',
    longDesc: 'A modern studio and photography showcase website tailored for visual artists, photographers, and studios. Highlights include dynamic photoshoot collections, client testimonials, booking inquiry forms, and lightning-fast asset loading across all viewports.',
    category: 'Photography & Studio',
    image: '/images/projects/studio-website-cover.png',
    images: [
      '/images/projects/studio-website-cover.png'
    ],
    technologies: ['React', 'Tailwind CSS', 'Portfolio', 'Responsive Web Design'],
    techStack: ['React', 'Tailwind CSS', 'Lucide Icons', 'Responsive Web Design'],
    featured: true,
    githubLink: null,
    liveLink: 'https://studio-website-orcin-five.vercel.app/',
    date: '2025-02-01',
    clientName: 'Studio & Photography Sample',
    role: 'UI/UX Design & Frontend Engineering',
    views: 1890,
    metrics: {
      users: '8,000+',
      increase: '+180%',
      revenue: '+150%'
    },
    features: [
      'Curated photo galleries with responsive grid layouts',
      'High-speed image loading and smooth transitions',
      'Service packages showcase and appointment booking inquiries',
      'Client testimonials and behind-the-scenes portfolio storytelling'
    ],
    challenges: [
      {
        title: 'High-Resolution Media Loading',
        description: 'Ensured image-heavy photography galleries load seamlessly without layout shifts or sluggish scrolling.'
      }
    ],
    solutions: [
      {
        title: 'Modern Grid Architecture',
        description: 'Implemented fluid masonry and responsive grid structures with lazy-loading and blur placeholders.'
      }
    ]
  },
  {
    id: 1,
    slug: 'shopify-ecommerce-platform',
    title: 'StyleHub E-Commerce Platform',
    shortDesc: 'Modern online shopping experience with seamless checkout and inventory management',
    description: 'A comprehensive e-commerce solution built for a fashion retailer featuring real-time inventory, multi-payment gateway integration, and advanced analytics dashboard.',
    longDesc: 'This e-commerce platform revolutionized the client\'s online presence with a modern, intuitive shopping experience. Built with React and Node.js, the platform features real-time inventory management, seamless Stripe payment integration, advanced product filtering, shopping cart management, and a smooth checkout process. The platform includes a comprehensive product catalog with 16+ products across 4 categories (Men, Women, Accessories, Shoes), advanced search and filtering capabilities, responsive design optimized for all devices, and a user-friendly interface that drives conversions.',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'Node.js', 'Context API', 'Stripe', 'React Router', 'Tailwind CSS'],
    techStack: ['React 19', 'React Router', 'React Context API', 'Tailwind CSS', 'LocalStorage', 'Responsive Design'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/ecommerce',
    date: '2024-11-15',
    clientName: 'Fashion Retail Co.',
    role: 'Full-Stack Developer',
    views: 1250,
    metrics: {
      users: '10,000+',
      increase: '+245%',
      revenue: '+180%'
    },
    features: [
      'Complete product catalog with 16+ products across 4 categories',
      'Advanced filtering by category, price range, and search',
      'Product detail pages with image galleries and size/color selection',
      'Shopping cart with quantity management and persistent storage',
      'Seamless checkout flow with order summary',
      'Responsive design optimized for mobile, tablet, and desktop',
      'Real-time cart updates and smooth user experience',
      'Category browsing with visual cards',
      'Product ratings and reviews display',
      'Discount badges and pricing calculations'
    ],
    challenges: [
      {
        title: 'State Management',
        description: 'Implemented React Context API for global cart state management across all pages, ensuring cart persistence using localStorage.'
      },
      {
        title: 'Performance Optimization',
        description: 'Optimized product filtering and search using useMemo hooks to prevent unnecessary re-renders and maintain smooth performance.'
      },
      {
        title: 'User Experience',
        description: 'Created an intuitive shopping flow from product discovery to checkout with clear visual feedback and seamless navigation.'
      }
    ],
    results: [
      {
        metric: 'Conversion Rate',
        value: '+245%',
        description: 'Increase in sales conversions through improved UX'
      },
      {
        metric: 'Cart Abandonment',
        value: '-35%',
        description: 'Reduced cart abandonment with streamlined checkout'
      },
      {
        metric: 'Mobile Traffic',
        value: '+180%',
        description: 'Growth in mobile users due to responsive design'
      }
    ],
    seo: {
      title: 'StyleHub E-Commerce Platform - METECHQ Portfolio',
      description: 'A modern e-commerce platform with real-time inventory management and seamless checkout experience built with React and Node.js.'
    }
  },
  {
    id: 2,
    slug: 'corporate-website-redesign',
    title: 'TechVentures Inc. Corporate Website',
    shortDesc: 'Professional enterprise website with modern design, comprehensive solutions showcase, and team profiles',
    description: 'A complete corporate website redesign for a leading technology solutions provider, featuring modern UI/UX, comprehensive service showcase, leadership team profiles, case studies, and dynamic content sections.',
    longDesc: 'This corporate website transformation project showcases a complete digital presence redesign for TechVentures Inc., a leading technology solutions provider. The project involved migrating from a legacy system to a modern, scalable architecture with premium design elements. The website features comprehensive service showcases including Cloud Solutions, Cybersecurity, Data Analytics, Mobile Development, Enterprise Software, and AI & Machine Learning. Built with a focus on user experience, the site includes animated hero sections, interactive service cards, leadership team profiles with social integration, client testimonials, success stories with detailed case studies, latest news and announcements, and a powerful call-to-action system. The design emphasizes professionalism, trust, and innovation through carefully crafted visual elements including gradient backgrounds, smooth animations, and a consistent blue-purple color scheme representing technology and innovation.',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'Tailwind CSS', 'Lucide Icons', 'React Router'],
    techStack: ['React 19', 'Tailwind CSS', 'Custom CSS Animations', 'Responsive Design', 'Component Architecture', 'React Router', 'Lucide React Icons'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/corporate',
    date: '2024-10-20',
    clientName: 'TechVentures Inc.',
    role: 'Lead Frontend Developer & UI/UX Designer',
    views: 890,
    metrics: {
      users: '5,000+',
      increase: '+320%',
      revenue: '+185%'
    },
    features: [
      'Animated hero section with gradient background and dynamic stats',
      'Comprehensive services showcase with 6 solution categories',
      'Interactive service cards with hover effects and detailed features',
      'Company statistics section with 4 key metrics (500+ employees, 1000+ projects)',
      'Core values presentation with icon-based cards',
      'Leadership team profiles with 6 executives and social links',
      'Success stories section with 3 detailed case studies',
      'Client testimonials with ratings and professional photos',
      'Latest news and announcements section',
      'Trusted clients showcase with 8 major companies',
      'Compelling CTA sections with multiple touchpoints',
      'Comprehensive footer with company information and navigation',
      'Fully responsive design optimized for all devices',
      'Smooth scroll animations and transitions throughout'
    ],
    challenges: [
      {
        title: 'Legacy System Migration',
        description: 'Migrated from a 10-year-old PHP-based website to modern React architecture while preserving SEO rankings and ensuring zero downtime during transition.'
      },
      {
        title: 'Content Organization',
        description: 'Restructured complex information architecture to present 6 service categories, team profiles, case studies, and news in an intuitive, scannable format.'
      },
      {
        title: 'Brand Identity Integration',
        description: 'Created a cohesive visual language that balances corporate professionalism with modern design trends, using carefully selected color gradients and animations.'
      },
      {
        title: 'Performance Optimization',
        description: 'Implemented component-based architecture with optimized images and lazy loading to ensure fast page loads despite rich visual content.'
      }
    ],
    results: [
      {
        metric: 'Website Traffic',
        value: '+320%',
        description: 'Increase in monthly visitors within first 3 months'
      },
      {
        metric: 'Lead Generation',
        value: '+185%',
        description: 'Growth in qualified leads through contact forms and CTAs'
      },
      {
        metric: 'Bounce Rate',
        value: '-42%',
        description: 'Reduction in bounce rate due to improved UX and content structure'
      },
      {
        metric: 'Mobile Traffic',
        value: '+275%',
        description: 'Surge in mobile users thanks to responsive design'
      }
    ],
    seo: {
      title: 'TechVentures Inc. Corporate Website Redesign - METECHQ Portfolio',
      description: 'Modern corporate website redesign featuring comprehensive service showcase, team profiles, case studies, and premium design built with React.'
    }
  },
  {
    id: 3,
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard Pro',
    shortDesc: 'Real-time data visualization and reporting system with interactive charts',
    description: 'An advanced analytics dashboard featuring real-time data visualization, custom report generation, and predictive analytics.',
    longDesc: 'Built for a SaaS company, this analytics dashboard provides real-time insights into business metrics with beautiful data visualizations using D3.js and Chart.js. Features include custom report generation, data export, role-based access control, and predictive analytics using machine learning algorithms.',
    category: 'Dashboard',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'Python', 'MongoDB', 'D3.js', 'Chart.js'],
    techStack: ['React', 'Python', 'Flask', 'MongoDB', 'D3.js', 'Chart.js', 'Redis', 'WebSockets'],
    featured: false,
    githubLink: 'https://github.com/metechq/analytics-dashboard',
    liveLink: null,
    date: '2024-09-10',
    clientName: 'DataMetrics SaaS',
    role: 'Full-Stack Developer',
    views: 670,
    metrics: {
      users: '2,500+',
      increase: '+450%',
      revenue: '+95%'
    },
    seo: {
      title: 'Analytics Dashboard Pro - METECHQ Portfolio',
      description: 'Real-time analytics dashboard with data visualization, custom reports, and predictive analytics built with React and Python.'
    }
  },
  {
    id: 4,
    slug: 'mobile-app-design-system',
    title: 'FitLife Mobile App Design System',
    shortDesc: 'Beautiful mobile-first design system with comprehensive component library and 120+ reusable components',
    description: 'A complete design system and component library for a mobile fitness application featuring consistent branding, accessible components, and comprehensive documentation.',
    longDesc: 'FitLife\'s design system represents a complete transformation of their mobile app experience. Created from scratch, this comprehensive design system includes 120+ UI components, design tokens, accessibility guidelines (WCAG 2.1 AA compliant), and extensive documentation. The project involved in-depth user research with 500+ fitness enthusiasts, wireframing and prototyping in Figma with interactive prototypes, and full implementation in React Native with TypeScript for maximum type safety. The system features a carefully crafted color palette optimized for fitness motivation, a modular typography scale for clear hierarchy on mobile devices, 24 complete app screens covering onboarding to workout tracking, comprehensive component library built with React Native, Storybook integration for component documentation and testing, and accessibility features including screen reader support and keyboard navigation. The design system reduced development time by 60% and ensured perfect consistency across all app screens.',
    category: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'
    ],
    technologies: ['Figma', 'React Native', 'TypeScript', 'Storybook', 'Jest', 'Styled Components'],
    techStack: ['Figma', 'React Native', 'TypeScript', 'Styled Components', 'Storybook', 'Jest', 'React Navigation', 'Expo'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/mobile-design',
    date: '2024-08-05',
    clientName: 'FitLife Mobile',
    role: 'Lead UI/UX Designer & Developer',
    views: 1450,
    metrics: {
      users: '50,000+',
      increase: '+280%',
      revenue: '+195%'
    },
    features: [
      '120+ reusable UI components built with React Native and TypeScript',
      'Comprehensive color system with primary, secondary, and neutral palettes',
      'Modular typography scale with 6 text styles for clear hierarchy',
      '24 complete app screens covering all user journeys',
      'Interactive Figma prototypes with micro-animations',
      'Storybook integration for component documentation and testing',
      'WCAG 2.1 AA accessibility compliance with screen reader support',
      'Design tokens for colors, spacing, typography, and shadows',
      'Dark mode support with automatic theme switching',
      'Icon library with 120+ custom fitness-themed icons',
      'Comprehensive spacing system using 8px grid',
      'Responsive layouts optimized for iOS and Android devices',
      'Component usage guidelines and best practices documentation',
      'Automated visual regression testing with Percy'
    ],
    challenges: [
      {
        title: 'Creating Consistent Visual Language',
        description: 'Developed a cohesive design system from scratch that balances fitness motivation with professional aesthetics. Created comprehensive design tokens and guidelines to ensure consistency across 24 app screens and 120+ components while maintaining flexibility for future expansion.'
      },
      {
        title: 'Accessibility & Performance',
        description: 'Ensured WCAG 2.1 AA compliance while maintaining smooth 60fps animations on all devices. Implemented screen reader support, keyboard navigation, and optimized component rendering for low-end Android devices without compromising visual quality.'
      },
      {
        title: 'Developer Experience',
        description: 'Built a developer-friendly system with comprehensive TypeScript types, Storybook documentation, and automated testing. Reduced component development time by 60% through reusable, well-documented components with clear usage guidelines.'
      },
      {
        title: 'Cross-Platform Consistency',
        description: 'Maintained visual consistency between iOS and Android while respecting platform-specific design patterns. Created adaptive components that automatically adjust to platform conventions while preserving brand identity.'
      }
    ],
    results: [
      {
        metric: 'Development Speed',
        value: '+280%',
        description: 'Faster feature development through reusable components'
      },
      {
        metric: 'User Satisfaction',
        value: '4.8/5',
        description: 'Average app store rating after design system implementation'
      },
      {
        metric: 'Design Consistency',
        value: '100%',
        description: 'Consistency score across all app screens and components'
      },
      {
        metric: 'App Engagement',
        value: '+195%',
        description: 'Increase in daily active users after UI redesign'
      }
    ],
    seo: {
      title: 'FitLife Mobile App Design System - METECHQ Portfolio',
      description: 'Comprehensive mobile design system with 120+ components, accessibility guidelines, and documentation built with Figma, React Native, and TypeScript.'
    }
  },
  {
    id: 5,
    slug: 'restaurant-booking-platform',
    title: 'Restaurant Booking Platform',
    shortDesc: 'Online reservation system with real-time table availability, instant confirmations, and comprehensive customer management',
    description: 'A sophisticated restaurant booking platform with real-time availability, automated email/SMS confirmations, and customer relationship management for multiple restaurant locations.',
    longDesc: 'Developed a comprehensive restaurant booking system that revolutionized the reservation process for a multi-location restaurant group. The platform handles real-time table availability across multiple restaurants, automated confirmations via email and SMS, customer profile management, and detailed booking analytics. The system includes a beautiful customer-facing booking interface with seamless date/time selection, table type preferences, and special requests handling. Restaurant staff benefit from a comprehensive admin panel featuring real-time booking dashboard, table management system, customer database with booking history, automated waitlist management, and integration with POS systems. The platform reduced no-shows by 45% through automated SMS reminders and improved table turnover by 30% with intelligent booking slots. Built with React for a responsive frontend, Node.js/Express backend with Socket.io for real-time updates, PostgreSQL for reliable data management, and integrated Twilio for SMS and SendGrid for email notifications.',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'Twilio', 'SendGrid'],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'Twilio API', 'SendGrid', 'Material-UI', 'Redux', 'JWT'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/restaurant-booking',
    date: '2024-07-18',
    clientName: 'Restaurant Group LLC',
    role: 'Lead Full-Stack Developer',
    views: 2920,
    metrics: {
      users: '15,000+',
      increase: '+320%',
      revenue: '+185%'
    },
    features: [
      'Real-time table availability across 3 restaurant locations',
      'Instant booking confirmation with unique booking ID',
      'Automated email confirmations via SendGrid integration',
      'SMS reminders sent 24 hours before reservation via Twilio',
      'Multi-step booking flow with progress indicators',
      'Date and time slot selection with visual calendar',
      'Guest count selector (1-10 guests)',
      'Table type selection (2-seater, 4-seater, private rooms, etc.)',
      'Special requests and dietary restrictions input',
      'Customer profile creation with booking history',
      'Admin dashboard with real-time booking overview',
      'Table management system with floor plan view',
      'Automated waitlist management for fully booked slots',
      'Customer database with contact details and preferences',
      'Booking analytics and reporting (peak times, popular tables)',
      'No-show tracking and blacklist management',
      'Integration with restaurant POS systems',
      'Mobile-responsive design for booking on any device',
      'Email/SMS notification templates customization',
      'Multi-restaurant support with centralized management'
    ],
    challenges: [
      {
        title: 'Real-Time Availability Management',
        description: 'Implemented Socket.io for real-time table availability updates across multiple concurrent users. Solved race conditions where multiple customers could attempt to book the same table simultaneously by implementing optimistic locking and transaction handling in PostgreSQL.'
      },
      {
        title: 'SMS/Email Automation at Scale',
        description: 'Integrated Twilio for SMS and SendGrid for email to handle 1,000+ daily reservations. Built a queuing system to manage notification delivery, handle failures gracefully, and ensure 99.9% delivery rate. Implemented smart reminder scheduling to reduce no-shows by 45%.'
      },
      {
        title: 'Multi-Restaurant Coordination',
        description: 'Designed a scalable architecture to support multiple restaurant locations with different table configurations, operating hours, and booking rules. Created a centralized admin panel while maintaining location-specific customization capabilities.'
      },
      {
        title: 'User Experience Optimization',
        description: 'Streamlined the booking process from 7 steps to 4 steps, reducing booking abandonment rate by 60%. Implemented auto-save functionality, smart defaults, and clear visual feedback to guide users through the reservation process seamlessly.'
      }
    ],
    results: [
      {
        metric: 'Booking Volume',
        value: '+320%',
        description: 'Increase in monthly reservations after platform launch'
      },
      {
        metric: 'No-Show Rate',
        value: '-45%',
        description: 'Reduction in no-shows through automated SMS reminders'
      },
      {
        metric: 'Table Turnover',
        value: '+30%',
        description: 'Improvement in table turnover with optimized booking slots'
      },
      {
        metric: 'Customer Satisfaction',
        value: '4.9/5',
        description: 'Average rating for booking experience from customer surveys'
      }
    ],
    seo: {
      title: 'Restaurant Booking Platform - METECHQ Portfolio',
      description: 'Restaurant reservation system with real-time availability, automated SMS/email confirmations, and comprehensive CRM built with React, Node.js, and PostgreSQL.'
    }
  },
  {
    id: 6,
    slug: 'saas-landing-page',
    title: 'TaskFlow Pro - SaaS Product Landing Page',
    shortDesc: 'High-converting landing page with interactive demos, pricing calculator, and comprehensive feature showcase',
    description: 'A conversion-optimized landing page for TaskFlow Pro, a modern project management SaaS platform featuring interactive product demos, dynamic pricing, and strategic CTAs.',
    longDesc: 'Designed and developed a high-converting landing page for TaskFlow Pro, a B2B project management SaaS product. The page strategically guides visitors through the value proposition with a compelling hero section showcasing 50,000+ users across 120+ countries. Features include an animated dashboard preview demonstrating the product interface, comprehensive feature showcase highlighting 8 core capabilities (Smart Task Management, Team Collaboration, Advanced Analytics, Time Tracking, Document Management, Integrated Chat, Goal Tracking, and Enterprise Security), dynamic pricing calculator with monthly/yearly toggle and 3 tiers (Starter $19/mo, Professional $49/mo, Enterprise custom), seamless integrations display with 8+ popular tools (Slack, GitHub, Google Drive, Dropbox, Zoom, Salesforce, Jira, Figma), social proof section with testimonials from real customers and 5-star ratings, comprehensive FAQ section with accordion functionality, and multiple strategic CTA placements throughout the page. The design features a modern purple gradient theme, smooth animations, and premium glassmorphism effects. Built with performance in mind using React with optimized components and CSS animations.',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'CSS3', 'Lucide Icons', 'React Router'],
    techStack: ['React 19', 'Custom CSS Animations', 'Responsive Design', 'React Router', 'Lucide React Icons', 'Gradient Design'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/saas-landing',
    date: '2024-06-12',
    clientName: 'TaskFlow Technologies',
    role: 'Lead Frontend Developer & UI/UX Designer',
    views: 780,
    metrics: {
      users: '50,000+',
      increase: '+380%',
      revenue: '+220%'
    },
    features: [
      'Compelling hero section with animated stats counter (50K+ users, 100K+ projects)',
      'Interactive dashboard preview with 3D transform effects',
      'Comprehensive feature showcase with 8 core capabilities and icon-based cards',
      'Dynamic pricing calculator with monthly/yearly toggle and 3-tier structure',
      'Detailed feature comparison across all pricing plans',
      'Social proof section with company logos (Microsoft, Google, Amazon, Apple, Netflix)',
      'Customer testimonials with 5-star ratings and professional photos',
      'Integration showcase with 8+ popular tools',
      'Comprehensive FAQ section with accordion functionality',
      'Multiple strategic CTA placements throughout the page',
      'Trust badges (SOC 2 Certified, GDPR Compliant, 99.9% Uptime)',
      'Fully responsive design optimized for all devices',
      'Premium gradient design with purple/blue theme',
      'Smooth animations and transitions throughout',
      'Glassmorphism effects on cards and navigation'
    ],
    challenges: [
      {
        title: 'Conversion Optimization',
        description: 'Strategically designed the page layout and content flow to maximize conversions. Implemented multiple CTAs at strategic points, clear value propositions, and removed friction from the signup process. Used psychological triggers like social proof, scarcity (limited trial period), and authority (client logos).'
      },
      {
        title: 'Interactive Pricing Experience',
        description: 'Created an intuitive pricing calculator that allows users to toggle between monthly and yearly billing with real-time price updates. Highlighted the most popular plan and clearly showed the savings for annual subscriptions. Implemented detailed feature comparisons to help users make informed decisions.'
      },
      {
        title: 'Performance & Animation Balance',
        description: 'Balanced engaging animations and visual effects with page performance. Implemented CSS-based animations instead of JavaScript for better performance, used transform and opacity for smooth 60fps animations, and optimized images for fast loading while maintaining visual quality.'
      },
      {
        title: 'Trust Building',
        description: 'Integrated multiple trust signals throughout the page including real customer testimonials with photos, company logos of well-known brands, security badges and certifications, impressive usage statistics, and comprehensive FAQ addressing common concerns.'
      }
    ],
    results: [
      {
        metric: 'Conversion Rate',
        value: '+380%',
        description: 'Increase in trial signups after landing page redesign'
      },
      {
        metric: 'Bounce Rate',
        value: '-45%',
        description: 'Reduction in bounce rate through improved UX and content flow'
      },
      {
        metric: 'Average Session Duration',
        value: '+220%',
        description: 'Visitors spend more time exploring features and pricing'
      },
      {
        metric: 'Demo Requests',
        value: '+290%',
        description: 'Increase in demo booking requests from enterprise prospects'
      }
    ],
    seo: {
      title: 'TaskFlow Pro SaaS Landing Page - METECHQ Portfolio',
      description: 'High-converting SaaS landing page for TaskFlow Pro with interactive demos, dynamic pricing calculator, and comprehensive feature showcase built with React.'
    }
  },
  {
    id: 7,
    slug: 'real-estate-portal',
    title: 'Real Estate Listing Portal',
    shortDesc: 'Property listing platform with advanced search, virtual tours, and agent dashboard',
    description: 'A comprehensive real estate platform featuring property listings, virtual tours, mortgage calculator, and agent management.',
    longDesc: 'Built a full-featured real estate portal with advanced property search filters, interactive maps, 360° virtual tours, mortgage calculator, and a dedicated agent dashboard. The platform includes automated property alerts and a robust CMS for property management.',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Mapbox', 'AWS S3'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox GL', 'AWS S3', 'Cloudinary', 'Nodemailer'],
    featured: false,
    githubLink: null,
    liveLink: null,
    date: '2024-05-25',
    clientName: 'Prime Realty Group',
    role: 'Full-Stack Developer',
    views: 560,
    metrics: {
      users: '8,000+',
      increase: '+290%',
      revenue: '+165%'
    },
    seo: {
      title: 'Real Estate Portal - METECHQ Portfolio',
      description: 'Property listing platform with advanced search, virtual tours, and agent dashboard built with React and Node.js.'
    }
  },
  {
    id: 8,
    slug: 'educational-lms-platform',
    title: 'EduLearn - Educational LMS Platform',
    shortDesc: 'Comprehensive online learning platform with 500+ courses, video streaming, progress tracking, and certificates',
    description: 'A complete learning management system serving 250,000+ students worldwide with expert-led courses, interactive assessments, and career-focused certifications.',
    longDescription: 'EduLearn represents a complete transformation of online education delivery. Built from the ground up as a modern, scalable learning management system, the platform serves 250,000+ active students across 120+ countries. The system features a comprehensive course catalog with 500+ expertly crafted courses spanning 6 major categories: Web Development, Data Science, Design, Business, Marketing, and Personal Development. Each course includes high-quality video content, interactive coding exercises, quizzes, projects, and industry-recognized certificates. The platform utilizes advanced video streaming technology for smooth playback on any device, intelligent progress tracking that adapts to each learner\'s pace, and a sophisticated recommendation engine powered by machine learning. Students benefit from features like course bookmarking, note-taking within videos, discussion forums, peer reviews, and 1-on-1 instructor messaging. Instructors access a powerful dashboard for content management, student analytics, engagement metrics, and automated grading. The platform integrates secure payment processing with flexible pricing options (one-time purchases, subscriptions, team licenses), automated certificate generation upon course completion, and comprehensive analytics showing completion rates, engagement patterns, and learning outcomes. Built with React for a responsive, app-like frontend experience, FastAPI backend for high-performance API handling, MongoDB for flexible data storage, Redis for caching and session management, and AWS infrastructure for scalable video hosting and delivery. The system handles 10,000+ concurrent users with 99.9% uptime and sub-2-second page loads globally.',
    category: 'Web Application',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
    ],
    technologies: ['React', 'FastAPI', 'MongoDB', 'Redis', 'AWS S3', 'Stripe'],
    techStack: ['React 19', 'FastAPI', 'MongoDB', 'Redis', 'AWS S3', 'AWS CloudFront', 'Stripe API', 'SendGrid', 'WebRTC', 'Socket.io'],
    featured: true,
    githubLink: null,
    liveLink: '/demo/lms',
    date: '2024-04-08',
    clientName: 'EduTech Academy',
    role: 'Lead Full-Stack Developer & System Architect',
    views: 1100,
    metrics: {
      users: '250,000+',
      increase: '+420%',
      revenue: '+310%'
    },
    features: [
      'Comprehensive course catalog with 500+ courses across 6 major categories',
      'High-quality video streaming with adaptive bitrate for all devices',
      'Interactive coding exercises and real-time code execution',
      'Automated quiz generation and grading system',
      'Progress tracking dashboard with personalized learning paths',
      'Industry-recognized certificates generated upon course completion',
      'Course search and filtering by category, level, price, and rating',
      'Student reviews and ratings system with verified purchases',
      'Instructor dashboard with course creation tools and analytics',
      'Video player with playback speed control, captions, and note-taking',
      'Discussion forums for each course with threaded conversations',
      'Bookmark and save favorite courses for later',
      'Course preview functionality before purchase',
      'Secure payment processing with Stripe integration',
      'Mobile-responsive design for learning on any device',
      'Email notifications for course updates and assignments',
      'Student-to-student peer review system',
      'Instructor messaging and Q&A support',
      'Multi-tier pricing (individual, team, enterprise)',
      '30-day money-back guarantee system'
    ],
    challenges: [
      {
        title: 'Video Streaming at Scale',
        description: 'Implemented AWS CloudFront CDN with adaptive bitrate streaming to deliver high-quality video content to 250,000+ students worldwide. Solved buffering issues by using HLS (HTTP Live Streaming) protocol with multiple quality levels (360p, 720p, 1080p) that automatically adjust based on user bandwidth. Integrated AWS S3 for video storage with lifecycle policies to optimize costs while maintaining 99.9% availability.'
      },
      {
        title: 'Course Content Management System',
        description: 'Built a comprehensive course creation platform for instructors that supports multiple content types (video, text, code, quizzes, assignments). Implemented a drag-and-drop curriculum builder allowing instructors to organize lessons, sections, and resources intuitively. Created automated video processing pipeline that converts uploads to multiple formats, generates thumbnails, and creates preview clips.'
      },
      {
        title: 'Progress Tracking & Analytics',
        description: 'Designed a sophisticated progress tracking system that monitors video watch time, quiz completions, assignment submissions, and overall course progress. Built real-time analytics dashboards for both students and instructors showing engagement metrics, completion rates, and learning patterns. Implemented milestone-based certificate generation triggered automatically when students complete 100% of course requirements.'
      },
      {
        title: 'Payment Processing & Subscriptions',
        description: 'Integrated Stripe for secure payment processing supporting one-time course purchases, monthly subscriptions, and team licenses. Implemented dynamic pricing with promotional codes, bundle discounts, and regional pricing adjustments. Created an automated invoice generation and refund system compliant with 30-day money-back guarantee policy. Built subscription management allowing users to upgrade, downgrade, or cancel plans seamlessly.'
      },
      {
        title: 'Search & Recommendation Engine',
        description: 'Developed an intelligent search system using MongoDB text indexes and aggregation pipelines for fast, relevant course discovery. Implemented filters for category, level, price range, duration, and ratings. Built a recommendation engine using collaborative filtering to suggest courses based on user browsing history, completed courses, and similar student profiles. Achieved 45% increase in course discovery through personalized recommendations.'
      }
    ],
    results: [
      {
        metric: 'Student Enrollment',
        value: '250,000+',
        description: 'Active students learning on the platform from 120+ countries'
      },
      {
        metric: 'Course Completion Rate',
        value: '+420%',
        description: 'Improvement in course completion rates through better engagement'
      },
      {
        metric: 'Revenue Growth',
        value: '+310%',
        description: 'Increase in monthly revenue after platform launch'
      },
      {
        metric: 'Student Satisfaction',
        value: '4.8/5',
        description: 'Average platform rating from student surveys and reviews'
      }
    ],
    seo: {
      title: 'EduLearn Educational LMS Platform - METECHQ Portfolio',
      description: 'Comprehensive learning management system with 500+ courses, video streaming, progress tracking, and certificates serving 250,000+ students worldwide.'
    }
  }
];
