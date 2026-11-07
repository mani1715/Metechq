// Educational LMS Platform - Course Data

export const categories = [
  { id: 1, name: 'Web Development', icon: 'Code', color: '#a34e1d' },
  { id: 2, name: 'Data Science', icon: 'Database', color: '#3b82f6' },
  { id: 3, name: 'Design', icon: 'Palette', color: '#ec4899' },
  { id: 4, name: 'Business', icon: 'Briefcase', color: '#f59e0b' },
  { id: 5, name: 'Marketing', icon: 'TrendingUp', color: '#10b981' },
  { id: 6, name: 'Personal Development', icon: 'Users', color: '#a34e1d' }
];

export const courses = [
  {
    id: 1,
    slug: 'complete-web-development-bootcamp',
    title: 'Complete Web Development Bootcamp 2025',
    instructor: 'Sarah Johnson',
    instructorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    category: 'Web Development',
    categoryId: 1,
    level: 'Beginner',
    duration: '42 hours',
    lessons: 156,
    students: 12543,
    rating: 4.9,
    reviews: 2341,
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
    description: 'Master web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 15+ real-world projects and launch your career as a web developer.',
    longDescription: 'This comprehensive bootcamp takes you from complete beginner to job-ready web developer. Learn modern web technologies including HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, and MongoDB. Build a portfolio of 15+ professional projects including e-commerce sites, social networks, and full-stack applications.',
    featured: true,
    bestseller: true,
    new: false,
    whatYouLearn: [
      'Build responsive websites with HTML5, CSS3, and modern CSS frameworks',
      'Master JavaScript ES6+ including async/await, promises, and modules',
      'Create dynamic web apps with React including hooks and context',
      'Develop backend APIs with Node.js, Express, and RESTful architecture',
      'Work with MongoDB and Mongoose for database management',
      'Deploy full-stack applications to production on cloud platforms',
      'Implement authentication and authorization with JWT',
      'Use Git and GitHub for version control and collaboration'
    ],
    requirements: [
      'A computer (Windows, Mac, or Linux)',
      'No programming experience needed - we start from scratch',
      'Basic computer skills and internet access',
      'Enthusiasm to learn and build amazing projects'
    ],
    curriculum: [
      {
        section: 'Getting Started',
        lectures: 8,
        duration: '45 min',
        lessons: [
          { title: 'Welcome to the Course', duration: '5:30', preview: true },
          { title: 'Course Overview and Roadmap', duration: '8:15', preview: true },
          { title: 'Setting Up Your Development Environment', duration: '12:45', preview: false },
          { title: 'Introduction to Web Development', duration: '10:20', preview: false }
        ]
      },
      {
        section: 'HTML5 Fundamentals',
        lectures: 22,
        duration: '3 hours',
        lessons: [
          { title: 'HTML Basics and Document Structure', duration: '15:30', preview: false },
          { title: 'Semantic HTML Elements', duration: '18:45', preview: false },
          { title: 'Forms and Input Elements', duration: '22:15', preview: false }
        ]
      },
      {
        section: 'CSS3 & Responsive Design',
        lectures: 28,
        duration: '4.5 hours',
        lessons: [
          { title: 'CSS Fundamentals', duration: '20:30', preview: false },
          { title: 'Flexbox Layout System', duration: '25:45', preview: false },
          { title: 'CSS Grid for Modern Layouts', duration: '28:15', preview: false },
          { title: 'Responsive Design Principles', duration: '22:30', preview: false }
        ]
      },
      {
        section: 'JavaScript Mastery',
        lectures: 45,
        duration: '8 hours',
        lessons: [
          { title: 'JavaScript Basics and Variables', duration: '18:30', preview: false },
          { title: 'Functions and Scope', duration: '22:45', preview: false },
          { title: 'DOM Manipulation', duration: '28:15', preview: false },
          { title: 'ES6+ Features', duration: '32:30', preview: false }
        ]
      },
      {
        section: 'React Development',
        lectures: 35,
        duration: '7 hours',
        lessons: [
          { title: 'Introduction to React', duration: '20:30', preview: false },
          { title: 'Components and Props', duration: '25:45', preview: false },
          { title: 'State and Lifecycle', duration: '28:15', preview: false },
          { title: 'Hooks in Depth', duration: '35:30', preview: false }
        ]
      },
      {
        section: 'Backend with Node.js',
        lectures: 18,
        duration: '5.5 hours',
        lessons: [
          { title: 'Node.js Fundamentals', duration: '22:30', preview: false },
          { title: 'Express Framework', duration: '28:45', preview: false },
          { title: 'RESTful API Design', duration: '32:15', preview: false }
        ]
      }
    ],
    instructor_details: {
      name: 'Sarah Johnson',
      title: 'Senior Full-Stack Developer & Educator',
      bio: 'Sarah has over 10 years of experience in web development and has taught over 50,000 students worldwide. She specializes in making complex concepts easy to understand.',
      students: 52340,
      courses: 8,
      rating: 4.9,
      reviews: 12450
    }
  },
  {
    id: 2,
    slug: 'data-science-machine-learning-python',
    title: 'Data Science & Machine Learning with Python',
    instructor: 'Dr. Michael Chen',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    category: 'Data Science',
    categoryId: 2,
    level: 'Intermediate',
    duration: '38 hours',
    lessons: 142,
    students: 9876,
    rating: 4.8,
    reviews: 1876,
    price: 94.99,
    originalPrice: 159.99,
    discount: 41,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    description: 'Learn data science, machine learning, and deep learning with Python. Master NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow through hands-on projects.',
    longDescription: 'Dive deep into data science and machine learning with this comprehensive course. Learn to analyze data, build predictive models, and create stunning visualizations using industry-standard tools.',
    featured: true,
    bestseller: true,
    new: false,
    whatYouLearn: [
      'Master Python for data analysis and machine learning',
      'Work with NumPy, Pandas, and data manipulation techniques',
      'Create beautiful visualizations with Matplotlib and Seaborn',
      'Build machine learning models with Scikit-learn',
      'Implement deep learning with TensorFlow and Keras',
      'Handle real-world datasets and data cleaning',
      'Deploy ML models to production',
      'Understand statistical concepts and their applications'
    ],
    requirements: [
      'Basic Python programming knowledge',
      'Understanding of high school level mathematics',
      'Computer with at least 8GB RAM',
      'Willingness to practice and experiment'
    ],
    curriculum: [],
    instructor_details: {
      name: 'Dr. Michael Chen',
      title: 'Data Scientist & AI Researcher',
      bio: 'PhD in Computer Science with specialization in Machine Learning. Has worked with leading tech companies and published 20+ research papers.',
      students: 38520,
      courses: 6,
      rating: 4.8,
      reviews: 8920
    }
  },
  {
    id: 3,
    slug: 'ui-ux-design-figma-masterclass',
    title: 'UI/UX Design Masterclass - Figma & Design Thinking',
    instructor: 'Emma Rodriguez',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    category: 'Design',
    categoryId: 3,
    level: 'Beginner',
    duration: '28 hours',
    lessons: 98,
    students: 8234,
    rating: 4.9,
    reviews: 1543,
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    description: 'Master UI/UX design with Figma. Learn design thinking, wireframing, prototyping, and create stunning interfaces that users love.',
    longDescription: 'Become a professional UI/UX designer with this complete masterclass. Learn Figma from scratch, master design principles, and build a portfolio of real-world projects.',
    featured: true,
    bestseller: false,
    new: true,
    whatYouLearn: [
      'Master Figma for UI/UX design',
      'Understand user research and personas',
      'Create wireframes and prototypes',
      'Learn design principles and typography',
      'Build responsive designs for all devices',
      'Conduct usability testing',
      'Create design systems and component libraries',
      'Present designs to clients and stakeholders'
    ],
    requirements: [
      'No prior design experience needed',
      'A computer (Figma works in browser)',
      'Creative mindset and attention to detail',
      'Free Figma account (we will set it up together)'
    ],
    curriculum: [],
    instructor_details: {
      name: 'Emma Rodriguez',
      title: 'Lead UI/UX Designer',
      bio: 'Emma has designed award-winning apps for Fortune 500 companies and startups. She passionate about teaching design to everyone.',
      students: 25680,
      courses: 5,
      rating: 4.9,
      reviews: 6340
    }
  },
  {
    id: 4,
    slug: 'digital-marketing-mastery-seo-social-media',
    title: 'Digital Marketing Mastery: SEO, Social Media & Ads',
    instructor: 'James Wilson',
    instructorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    category: 'Marketing',
    categoryId: 5,
    level: 'Beginner',
    duration: '32 hours',
    lessons: 118,
    students: 11245,
    rating: 4.7,
    reviews: 2134,
    price: 84.99,
    originalPrice: 139.99,
    discount: 39,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    description: 'Complete digital marketing course covering SEO, social media marketing, Google Ads, Facebook Ads, content marketing, and analytics.',
    longDescription: 'Master all aspects of digital marketing in this comprehensive course. Learn to create effective marketing campaigns, optimize for search engines, and grow your business online.',
    featured: false,
    bestseller: true,
    new: false,
    whatYouLearn: [
      'Search Engine Optimization (SEO) fundamentals',
      'Social media marketing strategies',
      'Google Ads and Facebook Ads campaigns',
      'Content marketing and copywriting',
      'Email marketing automation',
      'Google Analytics and data analysis',
      'Conversion rate optimization',
      'Marketing funnel strategies'
    ],
    requirements: [
      'No marketing experience required',
      'Basic internet and social media knowledge',
      'Willingness to implement and test strategies',
      'Optional: A website or business to practice on'
    ],
    curriculum: [],
    instructor_details: {
      name: 'James Wilson',
      title: 'Digital Marketing Expert',
      bio: 'James has managed $10M+ in ad spend and helped 500+ businesses grow their online presence. CMO of multiple successful startups.',
      students: 45230,
      courses: 12,
      rating: 4.7,
      reviews: 11290
    }
  },
  {
    id: 5,
    slug: 'python-programming-complete-course',
    title: 'Python Programming: From Beginner to Advanced',
    instructor: 'Dr. Aisha Patel',
    instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    category: 'Web Development',
    categoryId: 1,
    level: 'Beginner',
    duration: '35 hours',
    lessons: 128,
    students: 15678,
    rating: 4.9,
    reviews: 2876,
    price: 79.99,
    originalPrice: 134.99,
    discount: 41,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
    description: 'Master Python from basics to advanced topics. Learn programming fundamentals, OOP, web scraping, automation, APIs, and build real projects.',
    longDescription: 'The most comprehensive Python course available. Perfect for beginners and those wanting to advance their Python skills. Build 20+ projects and prepare for Python developer roles.',
    featured: true,
    bestseller: true,
    new: false,
    whatYouLearn: [
      'Python fundamentals and syntax',
      'Object-oriented programming concepts',
      'File handling and data structures',
      'Web scraping with Beautiful Soup',
      'API development with Flask/FastAPI',
      'Automation and scripting',
      'Database operations with SQL',
      'Testing and debugging techniques'
    ],
    requirements: [
      'No programming experience needed',
      'A computer with Python installed',
      'Enthusiasm to write code daily',
      'Problem-solving mindset'
    ],
    curriculum: [],
    instructor_details: {
      name: 'Dr. Aisha Patel',
      title: 'Software Engineer & Computer Science Professor',
      bio: 'PhD in Computer Science, 15 years of teaching experience, and author of 3 bestselling Python books.',
      students: 68920,
      courses: 9,
      rating: 4.9,
      reviews: 15430
    }
  },
  {
    id: 6,
    slug: 'business-strategy-entrepreneurship',
    title: 'Business Strategy & Entrepreneurship Fundamentals',
    instructor: 'Robert Anderson',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    category: 'Business',
    categoryId: 4,
    level: 'Beginner',
    duration: '24 hours',
    lessons: 86,
    students: 7543,
    rating: 4.8,
    reviews: 1432,
    price: 89.99,
    originalPrice: 149.99,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    description: 'Learn business strategy, startup fundamentals, market analysis, financial planning, and how to launch and grow a successful business.',
    longDescription: 'Transform your business idea into reality. This course covers everything from ideation to execution, including market research, business planning, funding, and growth strategies.',
    featured: false,
    bestseller: false,
    new: true,
    whatYouLearn: [
      'Develop viable business ideas and validate them',
      'Create comprehensive business plans',
      'Understand market analysis and competition',
      'Financial planning and budgeting',
      'Fundraising and investment strategies',
      'Marketing and customer acquisition',
      'Team building and management',
      'Scaling and growth strategies'
    ],
    requirements: [
      'Business idea or interest in entrepreneurship',
      'Basic understanding of business concepts helpful but not required',
      'Notebook for planning and ideation',
      'Commitment to take action on learnings'
    ],
    curriculum: [],
    instructor_details: {
      name: 'Robert Anderson',
      title: 'Serial Entrepreneur & Business Consultant',
      bio: 'Founded and exited 3 successful startups. MBA from Harvard Business School. Advises Fortune 500 companies and startups.',
      students: 32450,
      courses: 7,
      rating: 4.8,
      reviews: 7820
    }
  },
  {
    id: 7,
    slug: 'graphic-design-adobe-creative-suite',
    title: 'Graphic Design with Adobe Creative Suite',
    instructor: 'Lisa Martinez',
    instructorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    category: 'Design',
    categoryId: 3,
    level: 'Beginner',
    duration: '26 hours',
    lessons: 94,
    students: 6892,
    rating: 4.7,
    reviews: 1289,
    price: 74.99,
    originalPrice: 124.99,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop',
    description: 'Master graphic design with Photoshop, Illustrator, and InDesign. Create logos, branding, social media graphics, and print designs.',
    longDescription: 'Become a professional graphic designer with this complete Adobe Creative Suite course. Learn industry-standard tools and create stunning designs.',
    featured: false,
    bestseller: false,
    new: false,
    whatYouLearn: [
      'Adobe Photoshop for photo editing and manipulation',
      'Adobe Illustrator for vector graphics and logos',
      'Adobe InDesign for layout and print design',
      'Typography and color theory',
      'Logo design and branding',
      'Social media graphics and marketing materials',
      'Print design for brochures and magazines',
      'Portfolio development'
    ],
    requirements: [
      'Adobe Creative Cloud subscription (trial available)',
      'Computer with recommended specs for Adobe software',
      'No design experience needed',
      'Creative mindset'
    ],
    curriculum: [],
    instructor_details: {
      name: 'Lisa Martinez',
      title: 'Award-Winning Graphic Designer',
      bio: 'Worked with Nike, Apple, and Coca-Cola. 12 years of design experience and passionate about teaching creative skills.',
      students: 19680,
      courses: 6,
      rating: 4.7,
      reviews: 4520
    }
  },
  {
    id: 8,
    slug: 'excel-data-analysis-business-intelligence',
    title: 'Excel for Data Analysis & Business Intelligence',
    instructor: 'David Thompson',
    instructorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    category: 'Business',
    categoryId: 4,
    level: 'Intermediate',
    duration: '18 hours',
    lessons: 72,
    students: 9234,
    rating: 4.8,
    reviews: 1654,
    price: 69.99,
    originalPrice: 114.99,
    discount: 39,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    description: 'Master Excel for business analytics. Learn advanced formulas, pivot tables, dashboards, Power Query, and data visualization.',
    longDescription: 'Transform raw data into actionable insights with Excel. Learn advanced techniques used by analysts at Fortune 500 companies.',
    featured: false,
    bestseller: true,
    new: false,
    whatYouLearn: [
      'Advanced Excel formulas and functions',
      'Pivot tables and pivot charts mastery',
      'Data visualization and dashboard creation',
      'Power Query for data transformation',
      'VLOOKUP, INDEX-MATCH, and array formulas',
      'Data cleaning and preparation',
      'Business intelligence techniques',
      'Automated reporting'
    ],
    requirements: [
      'Basic Excel knowledge (creating spreadsheets, simple formulas)',
      'Microsoft Excel 2016 or later',
      'Sample datasets provided in the course',
      'Desire to become data-driven'
    ],
    curriculum: [],
    instructor_details: {
      name: 'David Thompson',
      title: 'Business Intelligence Consultant',
      bio: 'Former analyst at Goldman Sachs. Specializes in making complex Excel techniques easy to understand and apply.',
      students: 41230,
      courses: 8,
      rating: 4.8,
      reviews: 9760
    }
  }
];

export const instructors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Full-Stack Developer & Educator',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    students: 52340,
    courses: 8,
    rating: 4.9,
    reviews: 12450
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    title: 'Data Scientist & AI Researcher',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    students: 38520,
    courses: 6,
    rating: 4.8,
    reviews: 8920
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    title: 'Lead UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    students: 25680,
    courses: 5,
    rating: 4.9,
    reviews: 6340
  },
  {
    id: 4,
    name: 'James Wilson',
    title: 'Digital Marketing Expert',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    students: 45230,
    courses: 12,
    rating: 4.7,
    reviews: 11290
  }
];

export const platformStats = {
  totalStudents: '250,000+',
  totalCourses: '500+',
  totalInstructors: '150+',
  averageRating: '4.8'
};
