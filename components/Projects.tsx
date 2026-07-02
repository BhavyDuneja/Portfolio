'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, Code, Database, Cloud, Users, Award, ChevronRight } from 'lucide-react'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeProject, setActiveProject] = useState(0)

  const projects = [
    {
      title: 'FreezePreserveChargeF#',
      category: 'System Architecture',
      description: 'C# and F# application integration with Domain-Driven Design (DDD) and Clean Architecture implementation.',
      longDescription: 'Led the redesign and optimization of existing system architectures by identifying performance bottlenecks. Implemented a 7-layer .NET architecture using F# and C#, applying DDD and CQRS principles for scalable and maintainable solutions.',

      technologies: ['.NET', 'F#', 'C#', 'Azure', 'DDD', 'CQRS', 'Visual Studio'],
      features: [
        '7-layer .NET architecture implementation',
        'Domain-Driven Design principles',
        'Command Query Responsibility Segregation',
        'Dependency injection for maintainable code',
        'Azure Data Studio integration',
        'Performance optimization and debugging'
      ],
      status: 'Current',
      company: 'Oak Clinic Group',
      color: 'from-saffron-500 to-orange-600',
      bgColor: 'bg-saffron-500/5',
      borderColor: 'border-saffron-500/20'
    },
    {
      title: 'E-Learning Platform Enhancement',
      category: 'Web Development',
      description: 'Java Servlet-based e-learning system with AWS cloud infrastructure and Go microservices integration.',
      longDescription: 'Enhanced existing e-learning platform with new features including notifications, attendance tracking, and AWS cloud integration. Implemented Go-based microservices for improved performance and scalability.',

      technologies: ['Java', 'Go', 'AWS', 'MySQL', 'Servlet', 'JSP', 'Docker'],
      features: [
        'Java Servlet platform enhancement',
        'AWS cloud infrastructure setup',
        'Go microservices development',
        'Real-time notifications system',
        'Attendance tracking functionality',
        'Database optimization and scaling'
      ],
      status: 'Completed',
      company: 'MegaGroup',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Employee Management System',
      category: 'Full Stack',
      description: 'MERN stack application for employee management with barcode tracking, payroll, and attendance systems.',
      longDescription: 'Developed a comprehensive employee management system using MERN stack with barcode generation, profile management, attendance tracking, and payroll calculation. Implemented role-based access control for different user types.',

      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Barcode API'],
      features: [
        'Role-based access control (Admin/Manager/Employee)',
        'Barcode generation and scanning',
        'Real-time attendance tracking',
        'Automated payroll calculation',
        'Profile management system',
        'Responsive web interface'
      ],
      status: 'Completed',
      company: 'MegaGroup',
      color: 'from-violet-500 to-purple-700',
      bgColor: 'bg-violet-500/5',
      borderColor: 'border-violet-500/20'
    },
    {
      title: 'Kindergarten Management System',
      category: 'Full Stack',
      description: 'Web application for kindergarten management with parent-teacher communication and student tracking.',
      longDescription: 'Built a comprehensive kindergarten management system with public website for school information and private portal for parents and teachers. Implemented student attendance, grade management, and communication features.',

      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'HTML5', 'CSS3'],
      features: [
        'Public school information website',
        'Parent and teacher portals',
        'Student attendance management',
        'Grade and performance tracking',
        'Communication system',
        'Event and announcement management'
      ],
      status: 'Completed',
      company: 'MegaGroup',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-500/5',
      borderColor: 'border-pink-500/20'
    },
    {
      title: 'Drone Delivery Management System',
      category: 'System Design',
      description: 'Requirements definition and budget design for transitioning from truck to drone delivery systems.',
      longDescription: 'Led the requirements definition and budget design for a drone delivery system transition project. Created comprehensive documentation, cost analysis, and implementation roadmap based on MLIT (Ministry of Land, Infrastructure, Transport and Tourism) guidelines.',

      technologies: ['System Design', 'Requirements Analysis', 'Budget Planning', 'Documentation'],
      features: [
        'Requirements definition and analysis',
        'Budget estimation and cost analysis',
        'Implementation roadmap creation',
        'MLIT compliance documentation',
        'Stakeholder communication',
        'Risk assessment and mitigation'
      ],
      status: 'Completed',
      company: 'MegaGroup',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Fit-First E-commerce Platform',
      category: 'Entrepreneurship',
      description: 'Founded and scaled an e-commerce startup specializing in women\'s footwear and apparel.',
      longDescription: 'Founded Fit-First, an e-commerce startup that achieved 4+ lakhs in revenue through online-only business model. Led a team of designers, developers, and marketers to create a seamless customer experience.',

      technologies: ['E-commerce', 'Business Development', 'Marketing', 'Team Management'],
      features: [
        'Zero-investment startup launch',
        'Strategic partnership development',
        'Team leadership and management',
        'Customer satisfaction optimization',
        'Revenue growth strategies',
        'Online marketing campaigns'
      ],
      status: 'Completed',
      company: 'Fit-First (Founder)',
      color: 'from-rose-500 to-rose-700',
      bgColor: 'bg-rose-500/5',
      borderColor: 'border-rose-500/20'
    }
  ]

  const projectCategories = ['All', 'Current', 'Web Development', 'Full Stack', 'System Design', 'Entrepreneurship']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project =>
        project.category === selectedCategory ||
        project.status === selectedCategory
      )

  return (
    <section id="projects" ref={ref} className="section-spacing bg-dark-400">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6">
            <span className="gradient-text-saffron">Featured Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From system architecture to full-stack applications, each project represents
            a unique challenge and learning opportunity in my development journey.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {projectCategories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'btn-primary shadow-lg'
                  : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass-card rounded-3xl p-6 sm:p-8 hover-lift cursor-pointer"
              onClick={() => setActiveProject(index)}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <Code className="w-6 h-6 text-saffron-500 flex-shrink-0" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Current' ? 'bg-saffron-500/10 text-saffron-500' :
                      project.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-white/5 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{project.description}</p>
                  <p className="text-sm text-gray-500">{project.company}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>


              {/* Technologies */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-300 mb-3 flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Technologies
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm font-medium text-gray-300 border border-white/10 hover:scale-105 transition-transform duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h5 className="font-semibold text-gray-300 mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Key Features
                </h5>
                <ul className="space-y-2">
                  {project.features.slice(0, 3).map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 + idx * 0.1 }}
                      className="flex items-start space-x-3 text-gray-400"
                    >
                      <ChevronRight className="w-4 h-4 text-saffron-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                  {project.features.length > 3 && (
                    <li className="text-sm text-gray-500 ml-6">
                      +{project.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Project Status */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-2 text-saffron-500">
                  <div className="w-2 h-2 bg-saffron-500 rounded-full" />
                  <span className="text-sm font-medium">Company Project - Confidential</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This project is proprietary and cannot be shared publicly due to company confidentiality agreements.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { number: '15+', label: 'Projects Completed' },
            { number: '5+', label: 'Technologies Mastered' },
            { number: '4+', label: 'Years Experience' },
            { number: '2', label: 'Countries Worked' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="text-center glass-card rounded-2xl p-6 hover-lift"
            >
              <div className="text-3xl font-bold text-saffron-500 mb-2">{stat.number}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
