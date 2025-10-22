'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, MapPin, Github, Linkedin, Twitter, Calendar, Clock } from 'lucide-react'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'co-founder@anantasutra.com',
      link: 'https://mail.google.com/mail/?view=cm&fs=1&to=contact@anantasutra.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Osaka, Japan',
      link: 'https://maps.google.com/?q=Osaka,Japan',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'bhavy-duneja',
      link: 'https://www.linkedin.com/in/bhavy-duneja',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Github,
      title: 'GitHub',
      value: 'bhavyaduneja',
      link: 'https://github.com/bhavyduneja',
      color: 'from-gray-700 to-gray-800'
    }
  ]


  /*const availability = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM JST', status: 'Available' },
    { day: 'Saturday', time: '10:00 AM - 2:00 PM JST', status: 'Limited' },
    { day: 'Sunday', time: 'Closed', status: 'Unavailable' }
  ]*/

  return (
    <section id="contact" ref={ref} className="section-spacing bg-gradient-to-b from-green-50/30 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to collaborate on your next project? I'm always excited to discuss 
            new opportunities and innovative solutions.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
              <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                Let's Connect
              </h3>
              
              {/* Contact Information Row */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-green-100 hover:border-green-200"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mb-4`}>
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{info.title}</h4>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </motion.a>
                ))}
              </div>

              {/* Social Links Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {socialLinks.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-green-50 transition-all duration-300 border border-green-100 hover:border-green-200"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mb-4`}>
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{info.title}</h4>
                    <p className="text-gray-600 text-sm">{info.value}</p>
                  </motion.a>
                ))}
              </div>
            </div>


            {/* Availability */}
            {/*<div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-green-600" />
                Availability
              </h3>
              
              <div className="space-y-4">
                {availability.map((slot, index) => (
                  <motion.div
                    key={slot.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className="flex justify-between items-center p-3 bg-white rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{slot.day}</p>
                      <p className="text-sm text-gray-600">{slot.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      slot.status === 'Available' ? 'bg-green-100 text-green-700' :
                      slot.status === 'Limited' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {slot.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>*/}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12 border border-green-100">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Ready to Start Your Project?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you need a full-stack application, cloud architecture consultation, 
              or system optimization, I'm here to help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@anantasutra.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Start a Conversation</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact

