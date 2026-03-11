'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code, Database, Cloud, Globe, Users, Award, Zap, Shield, Layers, Cpu } from 'lucide-react'

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const skillCategories = [
    {
      title: 'Backend Development',
      icon: Code,
      color: 'from-blue-500 to-blue-700',
      skills: [
        { name: '.NET / C#', level: 95, experience: '3+ years' },
        { name: 'F#', level: 85, experience: '1+ year' },
        { name: 'Java', level: 90, experience: '2+ years' },
        { name: 'Go', level: 80, experience: '1+ year' },
        { name: 'Node.js', level: 85, experience: '2+ years' },
        { name: 'Python', level: 75, experience: '1+ year' }
      ]
    },
    {
      title: 'Frontend Development',
      icon: Layers,
      color: 'from-saffron-500 to-orange-600',
      skills: [
        { name: 'React', level: 90, experience: '3+ years' },
        { name: 'JavaScript', level: 95, experience: '4+ years' },
        { name: 'TypeScript', level: 85, experience: '2+ years' },
        { name: 'HTML5', level: 95, experience: '4+ years' },
        { name: 'CSS3', level: 90, experience: '4+ years' },
        { name: 'Next.js', level: 80, experience: '1+ year' }
      ]
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      color: 'from-violet-500 to-purple-700',
      skills: [
        { name: 'AWS', level: 85, experience: '2+ years' },
        { name: 'Azure', level: 80, experience: '1+ year' },
        { name: 'Docker', level: 75, experience: '1+ year' },
        { name: 'Kubernetes', level: 60, experience: '6 months' },
        { name: 'CI/CD', level: 70, experience: '1+ year' },
        { name: 'Infrastructure', level: 80, experience: '2+ years' }
      ]
    },
    {
      title: 'Database & Data',
      icon: Database,
      color: 'from-orange-500 to-orange-700',
      skills: [
        { name: 'MySQL', level: 90, experience: '3+ years' },
        { name: 'MongoDB', level: 85, experience: '2+ years' },
        { name: 'PostgreSQL', level: 80, experience: '1+ year' },
        { name: 'SQL', level: 95, experience: '4+ years' },
        { name: 'Data Analysis', level: 85, experience: '2+ years' },
        { name: 'Azure Data Studio', level: 75, experience: '1+ year' }
      ]
    },
    {
      title: 'System Design',
      icon: Cpu,
      color: 'from-pink-500 to-pink-700',
      skills: [
        { name: 'Architecture Design', level: 85, experience: '2+ years' },
        { name: 'DDD', level: 80, experience: '1+ year' },
        { name: 'CQRS', level: 75, experience: '1+ year' },
        { name: 'Microservices', level: 70, experience: '1+ year' },
        { name: 'API Design', level: 90, experience: '3+ years' },
        { name: 'Performance Optimization', level: 85, experience: '2+ years' }
      ]
    },
    {
      title: 'Languages & Communication',
      icon: Globe,
      color: 'from-saffron-500 to-violet-500',
      skills: [
        { name: 'English', level: 95, experience: 'Native/Business' },
        { name: 'Japanese', level: 75, experience: 'JLPT N3' },
        { name: 'Hindi', level: 100, experience: 'Native' },
        { name: 'Technical Writing', level: 85, experience: '2+ years' },
        { name: 'Cross-cultural Communication', level: 90, experience: '3+ years' },
        { name: 'Team Leadership', level: 80, experience: '2+ years' }
      ]
    }
  ]

  const certifications = [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2024',
      icon: Award,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: Shield,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Complete React Developer 2022',
      issuer: 'Udemy',
      year: '2022',
      icon: Code,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'JLPT N3 Japanese Language',
      issuer: 'Japan Foundation',
      year: '2024',
      icon: Globe,
      color: 'from-red-500 to-pink-500'
    }
  ]

  const achievements = [
    { number: '4+', label: 'Years Experience', icon: Users },
    { number: '15+', label: 'Projects Completed', icon: Code },
    { number: '5+', label: 'Technologies Mastered', icon: Zap },
    { number: '2', label: 'Countries Worked', icon: Globe }
  ]

  return (
    <section id="skills" ref={ref} className="section-spacing bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6">
            <span className="gradient-text-saffron">Skills & Expertise</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A comprehensive skill set developed through hands-on experience,
            continuous learning, and working across diverse technology stacks.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="glass-card rounded-3xl p-8 hover-lift"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.4 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{skill.experience}</span>
                        <span className="text-sm font-semibold text-gray-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: 0.6 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                        className={`h-3 bg-gradient-to-r ${category.color} rounded-full shadow-sm`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold font-display text-center mb-8 text-white">Certifications & Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${cert.color} rounded-full flex items-center justify-center mb-4`}>
                  <cert.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-white mb-2 text-sm">{cert.name}</h4>
                <p className="text-gray-400 text-sm mb-1">{cert.issuer}</p>
                <p className="text-gray-500 text-xs">{cert.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-saffron-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-saffron-500 mb-2">{achievement.number}</div>
              <div className="text-gray-400 font-medium">{achievement.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <div className="glass-card rounded-3xl p-12">
            <h3 className="text-3xl font-bold font-display mb-6 text-white">Learning Philosophy</h3>
            <blockquote className="text-xl text-gray-400 italic leading-relaxed max-w-4xl mx-auto mb-8">
              "Technology is constantly evolving, and so must we. My approach to learning is hands-on,
              project-driven, and always focused on solving real-world problems. Every new technology
              I learn is an opportunity to build something meaningful."
            </blockquote>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-saffron-500">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Continuous Learning</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center space-x-2 text-violet-500">
                <Code className="w-5 h-5" />
                <span className="font-medium">Hands-on Practice</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center space-x-2 text-violet-400">
                <Users className="w-5 h-5" />
                <span className="font-medium">Collaborative Growth</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
