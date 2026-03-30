'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  MapPin,
  ArrowUp,
  ExternalLink,
  Heart,
} from 'lucide-react';

const serviceLinks = [
  { name: 'AI Automation', href: '/services/voice-agents' },
  { name: 'Video Generators', href: '/services/video-generators' },
  { name: 'Social Media Automation', href: '/services/social-automation' },
  { name: 'Marketing Agency', href: '/services/marketing' },
  { name: 'Content Shooting', href: '/services/content-shooting' },
  { name: 'AI Marketing Tools', href: '/services/ai-marketing' },
];

const productLinks = [
  { name: 'Ritualist App', href: 'https://ritualist.anantasutra.com', description: 'Daily spiritual companion' },
  { name: 'Granthas App', href: '/apps', description: 'Sacred text library' },
];

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/company/anantasutra', icon: Linkedin },
  { name: 'GitHub', href: 'https://github.com/anantasutra', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/anantasutra', icon: Twitter },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0A0A0F]">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8A317] to-transparent opacity-40" />
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-20 -mt-px" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="lg:col-span-1"
          >
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <Image src="/images/logo-nobg.png" alt="AnantaSutra Logo" width={40} height={40} className="group-hover:scale-110 transition-transform duration-300" />
              <span
                className="text-xl font-bold bg-gradient-to-r from-[#E8A317] to-[#FFB800] bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AnantaSutra
              </span>
            </Link>
            <p className="text-gray-400 text-sm italic mb-6">Infinite Wisdom, Applied</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Bridging ancient wisdom with modern technology to create transformative digital
              experiences.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#E8A317] hover:border-[#E8A317]/30 hover:bg-[#E8A317]/5 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#E8A317] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Products Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Products
            </h3>
            <ul className="space-y-4">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group block"
                  >
                    <span className="text-gray-400 text-sm group-hover:text-[#E8A317] transition-colors duration-300">
                      {link.name}
                    </span>
                    <p className="text-gray-600 text-xs mt-0.5">{link.description}</p>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-gray-400 text-xs">More products coming soon...</p>
            </div>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@anantasutra.com"
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#E8A317] transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  contact@anantasutra.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Delhi, India
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#E8A317] to-[#FFB800] hover:shadow-lg hover:shadow-[#E8A317]/25 transition-all duration-300 hover:scale-105"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 my-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>&copy; 2024 AnantaSutra.</span>
            <span className="hidden sm:inline mx-2 text-gray-700">|</span>
            <span className="flex items-center gap-1">
              Infinite threads of wisdom
              <Heart className="w-3 h-3 text-[#E8A317] fill-[#E8A317]" />
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-400 hover:text-[#E8A317] bg-white/5 hover:bg-[#E8A317]/5 border border-white/10 hover:border-[#E8A317]/30 transition-all duration-300"
            aria-label="Back to top"
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
