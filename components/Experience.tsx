'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, MapPin, Calendar, Code, Database, Cloud, Users, Award, ChevronRight } from 'lucide-react'

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const experiences = [
    {
      company: 'Oak Clinic Group, Inc.',
      position: 'Software Engineer',
      location: 'Japan',
      duration: 'Sep 2025 - Present',
      type: 'Current',
      description: 'Redesigning and optimizing system architectures using .NET, F#, and Azure technologies.',
      technologies: ['.NET', 'F#', 'C#', 'Azure', 'DDD', 'CQRS'],
      achievements: [
        'Redesigned existing system architectures by identifying performance bottlenecks',
        'Implemented 7-layer .NET architecture using F# and C# with DDD principles',
        'Built scalable solutions with Azure Data Studio and SQL-based databases',
        'Developed 4-layer architecture with dependency injection for maintainable code'
      ],
      color: 'from-saffron-500 to-orange-600',
      bgColor: 'bg-saffron-500/5',
      borderColor: 'border-saffron-500/20'
    },
    {
      company: 'MegaGroup',
      position: 'System Engineer',
      location: 'Shibuya-ku, Tokyo',
      duration: 'Aug 2024 - Aug 2025',
      type: 'Previous',
      description: 'Full-stack development with Java, Go, AWS, and e-learning platform maintenance.',
      technologies: ['Java', 'Go', 'AWS', 'React', 'MySQL', 'Docker'],
      achievements: [
        'Developed e-commerce platform with React, Redux, and Firebase',
        'Built PHP-based Attendance & Payroll System with barcode tracking',
        'Enhanced Java Servlet e-learning platform with notifications',
        'Achieved Japanese N4 certification while managing multiple projects'
      ],
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20'
    },
    {
      company: 'Trainity',
      position: 'Data Analyst Trainee',
      location: 'Jaipur, Rajasthan',
      duration: 'Feb 2023 - May 2023',
      type: 'Training',
      description: 'Data analysis and social media analytics with SQL, Excel, and Window Functions.',
      technologies: ['SQL', 'Excel', 'Data Analysis', 'Window Functions', 'Analytics'],
      achievements: [
        'Created 4 comprehensive project reports on social media analytics',
        'Analyzed user engagement and identified bot users vs loyal customers',
        'Implemented Window Functions for job analysis and user growth metrics',
        'Developed insights on trending hashtags and user retention patterns'
      ],
      color: 'from-violet-500 to-purple-700',
      bgColor: 'bg-violet-500/5',
      borderColor: 'border-violet-500/20'
    },
    {
      company: 'Fit-First',
      position: 'Founder',
      location: 'Delhi, India',
      duration: 'Dec 2021 - May 2022',
      type: 'Entrepreneurship',
      description: 'Founded and scaled an e-commerce startup specializing in women\'s footwear and apparel.',
      technologies: ['E-commerce', 'Business Development', 'Marketing', 'Team Management'],
      achievements: [
        'Grew business to 4+ lakhs revenue through online-only model',
        'Launched with zero initial investment using strategic partnerships',
        'Led team of designers, developers, and marketers',
        'Achieved high customer satisfaction and repeat business'
      ],
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-500/5',
      borderColor: 'border-pink-500/20'
    },
    {
      company: 'SAVE',
      position: 'Frontend Developer',
      location: 'Delhi, India',
      duration: 'Aug 2021 - Nov 2021',
      type: 'Development',
      description: 'Frontend development using HTML5, CSS3, JavaScript, and WordPress.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'Responsive Design'],
      achievements: [
        'Developed responsive and visually appealing user interfaces',
        'Created efficient and reusable code components',
        'Collaborated with team members and stakeholders',
        'Improved development time and reduced code complexity'
      ],
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-500/5',
      borderColor: 'border-orange-500/20'
    }
  ]

  const skills = [
    { category: 'Backend', skills: ['.NET', 'F#', 'C#', 'Java', 'Go', 'Node.js'] },
    { category: 'Frontend', skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'] },
    { category: 'Cloud', skills: ['AWS', 'Azure', 'Docker', 'S3', 'Lambda'] },
    { category: 'Database', skills: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQL'] },
    { category: 'Languages', skills: ['English', 'Japanese (N3)', 'Hindi'] }
  ]

  return (
    <section id="experience" ref={ref} className="section-spacing bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6">
            <span className="gradient-text-saffron">Professional Journey</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From founding my own startup to working with cutting-edge technologies in Japan,
            each experience has shaped my growth as a software engineer.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience Timeline */}
          <div className="lg:col-span-2 space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`glass-card rounded-3xl p-6 sm:p-8 hover-lift`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <Building2 className="w-6 h-6 text-saffron-500 flex-shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{exp.company}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        exp.type === 'Current' ? 'bg-saffron-500/10 text-saffron-500' :
                        exp.type === 'Previous' ? 'bg-blue-500/10 text-blue-400' :
                        exp.type === 'Training' ? 'bg-violet-500/10 text-violet-400' :
                        'bg-pink-500/10 text-pink-400'
                      }`}>
                        {exp.type}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-300 mb-2">{exp.position}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{exp.description}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-300 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Technologies Used
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-white/5 rounded-full text-sm font-medium text-gray-300 border border-white/10 hover:scale-105 transition-transform duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Achievements */}
                <div>
                  <h5 className="font-semibold text-gray-300 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Key Achievements
                  </h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.2 + idx * 0.1 }}
                        className="flex items-start space-x-3 text-gray-400"
                      >
                        <ChevronRight className="w-4 h-4 text-saffron-500 mt-1 flex-shrink-0" />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skills Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                <Database className="w-6 h-6 mr-3 text-saffron-500" />
                Technical Skills
              </h3>
              <div className="space-y-6">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={skillGroup.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <h4 className="font-semibold text-gray-300 mb-3">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-saffron-500/10 text-saffron-500 rounded-full text-sm font-medium hover:bg-saffron-500/20 transition-colors duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Language Proficiency */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                <Users className="w-6 h-6 mr-3 text-saffron-500" />
                Language Skills
              </h3>
              <div className="space-y-4">
                {[
                  { language: 'English', level: 'Native/Business', percentage: 95 },
                  { language: 'Japanese', level: 'JLPT N3', percentage: 75 },
                  { language: 'Hindi', level: 'Native', percentage: 100 }
                ].map((lang, index) => (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">{lang.language}</span>
                      <span className="text-sm text-gray-500">{lang.level}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${lang.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-saffron-500 to-violet-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Focus */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-saffron-500" />
                Current Focus
              </h3>
              <p className="text-gray-400 mb-4">
                Deepening expertise in cloud architecture, system design, and cross-cultural
                software development in the Japanese tech ecosystem.
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-saffron-500/10 text-saffron-500 rounded-full text-sm font-medium">
                  .NET Architecture
                </span>
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm font-medium">
                  Cloud Solutions
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Experience
