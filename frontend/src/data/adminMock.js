// Admin Panel Mock Data

export const adminData = {
  pagesContent: {
    home: {
      hero: {
        badge: '',
        headline: 'Build Your Dream Website',
        subheadline: 'METECHQ Web Development Solutions',
        description: 'Transform your vision into stunning reality with our premium web development services. We craft bespoke digital experiences that captivate, engage, and convert.',
        cta1Text: 'Start Your Project',
        cta1Link: '/contact',
        cta2Text: 'View Our Work',
        cta2Link: '/portfolio',
        visible: true
      },
      stats: {
        visible: true,
        items: [
          { icon: 'Briefcase', value: '50+', label: 'Completed Projects' },
          { icon: 'Users', value: '35+', label: 'Happy Clients' },
          { icon: 'TrendingUp', value: '3+', label: 'Years Experience' },
          { icon: 'Zap', value: '98%', label: 'Client Satisfaction' }
        ]
      },
      services: {
        visible: true,
        headline: 'Our Premium Services',
        description: 'Comprehensive web solutions tailored to your needs'
      },
      portfolio: {
        visible: true,
        headline: 'Featured Projects',
        description: 'Explore our latest work'
      },
      testimonials: {
        visible: true,
        headline: 'What Our Clients Say',
        description: 'Real feedback from real clients'
      }
    },
    about: {
      hero: {
        headline: 'About METECHQ',
        subheadline: 'Your Trusted Web Development Partner',
        description: 'We are a team of passionate developers and designers dedicated to creating exceptional digital experiences.',
        visible: true
      },
      mission: {
        headline: 'Our Mission',
        description: 'To empower businesses with cutting-edge web solutions that drive growth and success.',
        visible: true
      },
      vision: {
        headline: 'Our Vision',
        description: 'To be the leading web development agency known for innovation, quality, and client satisfaction.',
        visible: true
      },
      values: {
        visible: true,
        items: [
          { title: 'Quality First', description: 'We never compromise on quality' },
          { title: 'Client Focus', description: 'Your success is our priority' },
          { title: 'Innovation', description: 'Always staying ahead of the curve' },
          { title: 'Transparency', description: 'Open and honest communication' }
        ]
      }
    },
    services: {
      hero: {
        headline: 'Our Services',
        description: 'Comprehensive web development solutions for your business',
        visible: true
      },
      process: {
        visible: true,
        headline: 'Our Development Process',
        steps: [
          { title: 'Discovery', description: 'Understanding your needs' },
          { title: 'Design', description: 'Creating the perfect solution' },
          { title: 'Development', description: 'Building with precision' },
          { title: 'Launch', description: 'Deploying your success' }
        ]
      }
    },
    portfolio: {
      hero: {
        headline: 'Our Portfolio',
        description: 'Showcasing our best work',
        visible: true
      },
      filters: {
        visible: true,
        categories: ['All', 'E-commerce', 'Corporate', 'SaaS', 'Mobile']
      }
    },
    contact: {
      hero: {
        headline: 'Get In Touch',
        description: 'Let\'s discuss your next project',
        visible: true
      },
      form: {
        visible: true,
        fields: ['name', 'email', 'phone', 'message']
      },
      info: {
        visible: true,
        email: 'contact@metechq.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA'
      }
    }
  },

  services: [
    {
      id: 1,
      icon: 'Code',
      title: 'Custom Website Development',
      description: 'Bespoke websites tailored to your brand, built with cutting-edge technology and optimized for performance.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading'],
      price: 'Starting at $2,999',
      order: 1,
      active: true
    },
    {
      id: 2,
      icon: 'ShoppingCart',
      title: 'E-commerce Solutions',
      description: 'Complete online stores with secure payments, inventory management, and seamless checkout experiences.',
      features: ['Payment Integration', 'Product Management', 'Analytics Dashboard'],
      price: 'Starting at $4,999',
      order: 2,
      active: true
    },
    {
      id: 3,
      icon: 'Layers',
      title: 'Full-Stack Development',
      description: 'End-to-end application development with robust backends, modern frontends, and cloud deployment.',
      features: ['API Development', 'Database Design', 'Cloud Hosting'],
      price: 'Starting at $5,999',
      order: 3,
      active: true
    },
    {
      id: 4,
      icon: 'Palette',
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that enhance user experience and drive meaningful engagement.',
      features: ['User Research', 'Prototyping', 'Brand Identity'],
      price: 'Starting at $1,999',
      order: 4,
      active: true
    }
  ],

  projects: [
    {
      id: 'aishu-foods-ecommerce',
      title: 'AISHU FOODS | Authentic Delicacies & E-Commerce Platform',
      slug: 'aishu-foods-ecommerce',
      category: 'E-commerce',
      description: 'Handcrafted authentic delicacies, traditional Andhra pickles, and pure ghee sweets with seamless online ordering.',
      image: '/images/projects/aishufoods-cover.png',
      technologies: ['E-Commerce', 'React', 'Node.js', 'Payment Gateway', 'Order Tracking'],
      featured: true,
      liveUrl: 'https://aishufoods.com/',
      githubUrl: '',
      status: 'completed',
      date: '2025-01-15'
    },
    {
      id: 'studio-photography-portfolio',
      title: 'Metechq Studio | Photography & Creative Portfolio',
      slug: 'studio-photography-portfolio',
      category: 'Photography & Studio',
      description: 'Modern photography and creative studio website showcasing high-resolution gallery collections and client booking.',
      image: '/images/projects/studio-website-cover.png',
      technologies: ['React', 'Tailwind CSS', 'Portfolio', 'Responsive Web Design'],
      featured: true,
      liveUrl: 'https://studio-website-orcin-five.vercel.app/',
      githubUrl: '',
      status: 'completed',
      date: '2025-02-01'
    },
    {
      id: 1,
      title: 'StyleHub Fashion Store',
      slug: 'stylehub-fashion-store',
      category: 'E-commerce',
      description: 'A modern e-commerce platform for fashion retail with advanced filtering and cart functionality.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8'],
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      featured: true,
      liveUrl: '/demo/ecommerce',
      caseStudy: {
        challenge: 'Create a seamless shopping experience with real-time cart updates',
        solution: 'Implemented React Context API for state management and optimized performance',
        results: '+245% conversion rate increase'
      },
      createdAt: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Corporate Business Site',
      slug: 'corporate-business-site',
      category: 'Corporate',
      description: 'Professional corporate website with service showcase and team profiles.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'],
      techStack: ['React', 'Tailwind', 'FastAPI'],
      featured: true,
      liveUrl: '/demo/corporate',
      caseStudy: {
        challenge: 'Modern professional design that builds trust',
        solution: 'Clean layouts with strategic CTAs and testimonials',
        results: '85% increase in lead generation'
      },
      createdAt: '2024-02-10',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Learning Management System',
      slug: 'learning-management-system',
      category: 'Education',
      description: 'Comprehensive LMS platform with course management and student tracking.',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
      images: ['https://images.unsplash.com/photo-1501504905252-473c47e087f8'],
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      featured: true,
      liveUrl: '/demo/lms',
      caseStudy: {
        challenge: 'Engaging online learning experience',
        solution: 'Interactive course modules with progress tracking',
        results: '92% student satisfaction rate'
      },
      createdAt: '2024-03-05',
      status: 'completed'
    }
  ],

  contacts: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      message: 'I\'m interested in building an e-commerce website for my business.',
      status: 'unread',
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      message: 'Need a custom web application for my startup. Can we schedule a call?',
      status: 'read',
      createdAt: '2024-03-14T14:20:00Z'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'mbrown@example.com',
      phone: '+1 (555) 456-7890',
      message: 'Looking for UI/UX design services for mobile app.',
      status: 'read',
      createdAt: '2024-03-13T09:15:00Z'
    }
  ],

  settings: {
    agency: {
      name: 'METECHQ',
      owner: 'Maneesh',
      email: 'contact@metechq.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
      description: 'Premium Web Development Agency',
      tagline: 'Transforming Ideas into Digital Reality'
    },
    social: {
      facebook: 'https://facebook.com/metechq',
      twitter: 'https://twitter.com/metechq',
      linkedin: 'https://linkedin.com/company/metechq',
      instagram: 'https://instagram.com/metechq',
      github: 'https://github.com/metechq'
    },
    theme: {
      primaryColor: '#a34e1d',
      secondaryColor: '#c5792c',
      darkColor: '#352a21'
    }
  }
};

export default adminData;
