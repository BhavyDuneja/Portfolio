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
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
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
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
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
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
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
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
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
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
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
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured <span className="text-emerald-600">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful technology solutions and innovative projects 
            that have delivered real value to our clients.
          </p>
        </motion.div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${project.bgColor} ${project.borderColor} border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105`}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-3 h-3 bg-gradient-to-r ${project.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-600">{project.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {project.features.slice(0, 3).map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-2 h-2 bg-gradient-to-r ${project.color} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{project.company}</span>
                </div>
                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200">
                  Company Project - Confidential
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and create a solution that drives your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Your Project</span>
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="/co-founder"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                Meet Our Co-founder
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
