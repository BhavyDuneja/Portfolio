'use client'

import { motion } from 'framer-motion'
import { Heart, Code, Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '#contact' }
  ]

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bhavy-duneja', icon: Linkedin },
    { name: 'GitHub', url: 'https://github.com/bhavyaduneja', icon: Github },
    { name: 'Twitter', url: 'https://twitter.com/bhavyaduneja', icon: Twitter }
  ]

  const contactInfo = [
    { icon: Mail, text: 'bhavyduneja@gmail.com', href: 'mailto:bhavyduneja@gmail.com' },
    { icon: Phone, text: '+81 07083172647', href: 'tel:+8107083172647' },
    { icon: MapPin, text: 'Osaka, Japan', href: 'https://maps.google.com/?q=Osaka,Japan' }
  ]

  return (
    <footer className="bg-gradient-to-b from-white to-green-50/50 border-t border-green-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">Bhavya Duneja</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Software Engineer passionate about building innovative solutions and 
              bridging cultures through technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border border-green-100"
                >
                  <social.icon className="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors duration-200" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  <motion.a
                    href={info.href}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    <info.icon className="w-4 h-4" />
                    <span className="text-sm">{info.text}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter/CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Let's Work Together</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Ready to bring your ideas to life? Let's discuss your next project.
            </p>
            <motion.a
              href="mailto:bhavyduneja@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gray-600"
            >
              <span>© {currentYear} Bhavya Duneja. Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>in Osaka, Japan</span>
            </motion.div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 text-gray-600 hover:text-green-600"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

