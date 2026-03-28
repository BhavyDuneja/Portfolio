'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, ChevronDown, Sparkles } from 'lucide-react'

interface FAQ {
  category: string
  question: string
  answer: string
}

const faqs: FAQ[] = [
  // General
  {"category": "General", "question": "What is AnantaSutra?", "answer": "AnantaSutra is a Delhi-based technology and creative agency that combines AI automation, digital marketing, and web development to help businesses grow. The name means 'Infinite Wisdom' in Sanskrit — Ananta (infinite) and Sutra (thread of wisdom)."},
  {"category": "General", "question": "Who founded AnantaSutra?", "answer": "AnantaSutra was founded by Bhavya Duneja, based in Delhi, India. The company was built on the vision of making cutting-edge AI and marketing solutions accessible to businesses of all sizes."},
  {"category": "General", "question": "Where is AnantaSutra located?", "answer": "AnantaSutra is headquartered in Delhi, India. We serve clients across India and internationally through remote collaboration."},
  {"category": "General", "question": "What services does AnantaSutra offer?", "answer": "We offer three core service lines: AI Automation & Intelligence (voice agents, video generators, social media automation), Creative & Marketing Agency (photo/video, branding, performance marketing), and Website Building & Search Optimization (development, SEO, AEO, GEO)."},
  {"category": "General", "question": "What industries does AnantaSutra work with?", "answer": "We work with businesses across real estate, e-commerce, healthcare, education, recruitment, hospitality, and professional services. Our AI and marketing solutions are adaptable to virtually any industry."},
  {"category": "General", "question": "How can I contact AnantaSutra?", "answer": "You can reach us via email at contact@anantasutra.com or through our website at anantasutra.com/contact. We typically respond within 24 hours on business days."},
  {"category": "General", "question": "Does AnantaSutra work with small businesses?", "answer": "We work with businesses of all sizes, from solo founders and startups to established enterprises. Our services and pricing are designed to scale with your needs."},
  {"category": "General", "question": "What does the name AnantaSutra mean?", "answer": "AnantaSutra is derived from Sanskrit — 'Ananta' means infinite and 'Sutra' means thread or wisdom. Together it represents our commitment to delivering infinite wisdom and connected solutions for your business."},
  {"category": "General", "question": "Do you offer ongoing support after delivery?", "answer": "Yes, we offer ongoing maintenance and support packages for all our services. Whether it's AI agent monitoring, website updates, or marketing optimization, we ensure your solutions keep performing."},

  // AI Automation
  {"category": "AI Automation", "question": "What are Voice Calling Agents?", "answer": "Our Voice Calling Agents are AI-powered systems that make and receive phone calls for your business. They handle appointment booking, lead qualification, follow-ups, and customer support — starting at just ₹6 per minute."},
  {"category": "AI Automation", "question": "How does AI Voice Agent pricing work?", "answer": "You are charged ₹6 per minute of actual call time. No hidden fees — you only pay for minutes the AI agent is actively on a call. Volume discounts are available for high-usage clients."},
  {"category": "AI Automation", "question": "Can AI Voice Agents speak Hindi?", "answer": "Yes, our voice agents support multiple languages including Hindi, English, and several regional languages. We configure the language and tone to match your target audience and brand voice."},
  {"category": "AI Automation", "question": "What is Recruiter AI?", "answer": "Recruiter AI automates talent sourcing by scanning databases, job platforms, and networks to find qualified candidates. You pay just ₹2 per verified lead, making it extremely cost-effective compared to traditional recruitment."},
  {"category": "AI Automation", "question": "How does Social Media Automation work?", "answer": "Our Social Media Automation puts your posting schedule on full autopilot. We use AI to generate, schedule, and publish content across all your platforms, maintaining consistent engagement without manual effort."},
  {"category": "AI Automation", "question": "What can the AI Video Generator create?", "answer": "Our AI Video Generator produces professional-quality videos for real estate tours, marketing campaigns, product showcases, and social media content. It dramatically reduces time and cost of video production."},
  {"category": "AI Automation", "question": "How does Gmail Automation help?", "answer": "Gmail Automation creates smart email workflows that automatically sort, respond to, and follow up on emails based on rules you define. It saves hours of manual email management daily."},
  {"category": "AI Automation", "question": "What are AI Marketing Tools?", "answer": "Our AI Marketing Tools use data-driven algorithms to optimize your campaigns. They analyze customer behavior, predict trends, automate ad spending, and generate performance reports to maximize your ROI."},
  {"category": "AI Automation", "question": "Is my data safe with your AI tools?", "answer": "Absolutely. We follow strict data privacy practices and never share your data with third parties. All AI systems use encryption and access controls to keep your business information secure."},
  {"category": "AI Automation", "question": "Can AI tools integrate with my existing CRM?", "answer": "Yes, our AI solutions integrate with popular CRMs, ERPs, and business tools. We handle setup and configuration to ensure seamless data flow between systems."},

  // Creative & Marketing
  {"category": "Marketing", "question": "What does your Marketing Agency offer?", "answer": "We provide end-to-end creative services: professional photo/video shooting, content creation, social media management, brand strategy, performance marketing, and creative direction."},
  {"category": "Marketing", "question": "Do you manage all social media platforms?", "answer": "Yes, we manage Instagram, Facebook, LinkedIn, Twitter/X, YouTube, and emerging platforms. We handle content creation, scheduling, community management, and analytics reporting."},
  {"category": "Marketing", "question": "What is Performance Marketing?", "answer": "Performance Marketing focuses on paid campaigns where every rupee is tracked against measurable results like leads, sales, or sign-ups. We provide transparent dashboards showing exact cost-per-acquisition and ROAS."},
  {"category": "Marketing", "question": "Can you build our brand from scratch?", "answer": "Yes, our Brand Strategy covers logo design, visual identity, brand voice, positioning, and messaging guidelines. We help establish a memorable and cohesive brand presence."},
  {"category": "Marketing", "question": "Do you offer on-location shoots?", "answer": "Yes, we offer professional photo and video shoots on-location across Delhi NCR and can travel to other cities. Our team handles pre-production, shooting, and post-production editing."},
  {"category": "Marketing", "question": "Can you run Google and Meta ads?", "answer": "Yes, we run and optimize paid campaigns across Google Ads, Meta (Facebook/Instagram), LinkedIn, and YouTube. We handle strategy, creative, bidding, and continuous optimization."},
  {"category": "Marketing", "question": "How is your marketing different?", "answer": "We combine human creativity with AI-powered insights. This hybrid approach ensures your marketing is both emotionally compelling and measurably effective — not just beautiful but also ROI-driven."},

  // Website & SEO/AEO/GEO
  {"category": "Website & SEO", "question": "What technology do you use for websites?", "answer": "We build modern, responsive websites using Next.js — one of the most performant and SEO-friendly frameworks available. Our sites are fast, mobile-optimized, and designed for excellent user experience."},
  {"category": "Website & SEO", "question": "What is SEO and why do I need it?", "answer": "SEO (Search Engine Optimization) improves your website's visibility on Google. It drives organic traffic so potential customers find you without paying for every click — a long-term investment that compounds over time."},
  {"category": "Website & SEO", "question": "What is AEO (Answer Engine Optimization)?", "answer": "AEO optimizes your content to appear as direct answers in AI-powered platforms like ChatGPT, Perplexity, and Google AI Overviews. As more users turn to AI for answers, AEO ensures your business gets recommended."},
  {"category": "Website & SEO", "question": "What is GEO (Generative Engine Optimization)?", "answer": "GEO ensures your brand is cited by generative AI platforms when they produce responses. It makes sure AI tools include your business as a trusted source when generating content in your industry."},
  {"category": "Website & SEO", "question": "How is AEO different from SEO?", "answer": "SEO focuses on ranking in Google's search results, while AEO focuses on being the direct answer AI assistants provide. Both are important — SEO captures search traffic, AEO captures the growing AI-using audience."},
  {"category": "Website & SEO", "question": "How long does SEO take to show results?", "answer": "SEO typically shows improvements within 3-6 months, with significant results by 6-12 months. It's a long-term investment that compounds over time, delivering sustainable organic traffic growth."},
  {"category": "Website & SEO", "question": "Do you set up analytics and tracking?", "answer": "Yes, we set up Google Analytics (GA4), Microsoft Clarity for heatmaps and session recordings, and other tracking tools for complete visibility into how visitors interact with your website."},
  {"category": "Website & SEO", "question": "Can you help with domain and hosting?", "answer": "Yes, we handle complete domain registration and hosting setup. We recommend reliable hosting optimized for speed and uptime as part of our website development service."},
  {"category": "Website & SEO", "question": "Will my website be mobile-friendly?", "answer": "Absolutely. Every website we build is fully responsive and optimized for mobile, tablets, and desktops. Mobile performance is a key SEO ranking factor too."},

  // Pricing
  {"category": "Pricing", "question": "How much does a website cost?", "answer": "Website pricing depends on complexity, pages, and features. Contact us at contact@anantasutra.com for a customized quote — we offer solutions for every budget."},
  {"category": "Pricing", "question": "Do you offer package deals?", "answer": "Yes, we offer bundled packages combining AI automation, marketing, and web development at discounted rates. Bundling also ensures better integration and a more cohesive strategy."},
  {"category": "Pricing", "question": "Is there a minimum contract period?", "answer": "For projects like websites, there's no long-term contract. For ongoing services like marketing and AI automation, we recommend a minimum 3-month engagement to see meaningful results."},
  {"category": "Pricing", "question": "Do you offer free consultations?", "answer": "Yes, we offer a free initial consultation to understand your needs and recommend the right solutions. Book one at contact@anantasutra.com or through our website."},
  {"category": "Pricing", "question": "What payment methods do you accept?", "answer": "We accept bank transfers (NEFT/IMPS/UPI), credit/debit cards, and online payment links. For international clients, we accept wire transfers and PayPal."},

  // Getting Started
  {"category": "Getting Started", "question": "How do I get started?", "answer": "Simply reach out via contact@anantasutra.com or anantasutra.com/contact. We'll schedule a free consultation to understand your needs and propose a tailored solution."},
  {"category": "Getting Started", "question": "What is your typical project timeline?", "answer": "Websites take 2-4 weeks, AI agent setup takes 1-2 weeks, and marketing campaigns can launch within a week. We provide a clear timeline in our initial proposal."},
  {"category": "Getting Started", "question": "What info do you need to start?", "answer": "We typically need your business overview, target audience details, goals/KPIs, brand assets (if available), and access to relevant accounts. We provide a detailed onboarding checklist."},
  {"category": "Getting Started", "question": "Will I have a dedicated contact person?", "answer": "Yes, every client gets a dedicated project manager as your single point of contact, coordinating across our AI, creative, and development teams."},
  {"category": "Getting Started", "question": "What if I'm not satisfied?", "answer": "We include revision rounds in all projects and work closely with you. If something doesn't meet expectations, we iterate until it does — your success is our priority."},
]

const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))]

interface Message {
  id: string
  type: 'bot' | 'user'
  text: string
  suggestions?: string[]
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  type: 'bot',
  text: "Namaste! 🙏 I'm AnantaSutra's assistant. Ask me anything about our AI automation, marketing, website development, SEO, AEO, or GEO services.",
  suggestions: ['What services do you offer?', 'What is AEO?', 'How much does a website cost?', 'How do I get started?'],
}

function fuzzyMatch(query: string, text: string): number {
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase()
  if (t.includes(q)) return 1
  const words = q.split(/\s+/).filter(w => w.length > 2)
  if (words.length === 0) return 0
  const matched = words.filter(w => t.includes(w)).length
  return matched / words.length
}

function findBestAnswer(query: string): { answer: string; suggestions: string[] } {
  const scored = faqs.map(faq => ({
    faq,
    score: Math.max(
      fuzzyMatch(query, faq.question) * 1.2,
      fuzzyMatch(query, faq.answer) * 0.8,
      fuzzyMatch(query, faq.category) * 0.6,
    ),
  }))
  scored.sort((a, b) => b.score - a.score)

  if (scored[0].score > 0.3) {
    const related = scored.slice(1, 4).filter(s => s.score > 0.2)
    return {
      answer: scored[0].faq.answer,
      suggestions: related.map(r => r.faq.question),
    }
  }

  return {
    answer: "I don't have a specific answer for that, but I'd love to help! You can reach our team directly at contact@anantasutra.com or visit our contact page for a personalized response.",
    suggestions: ['What services do you offer?', 'How do I get started?', 'Do you offer free consultations?'],
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSend = (text?: string) => {
    const query = text || input.trim()
    if (!query) return

    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const { answer, suggestions } = findBestAnswer(query)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: answer,
        suggestions,
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-saffron-500/20"
            style={{
              background: 'linear-gradient(135deg, #E8A317, #d4940f)',
            }}
          >
            <MessageCircle className="w-6 h-6 text-[#0A0A0F]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0F]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl overflow-hidden border border-white/5"
            style={{
              background: 'rgba(10, 10, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(232, 163, 23, 0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/5"
              style={{
                background: 'linear-gradient(135deg, rgba(232, 163, 23, 0.1), rgba(106, 61, 232, 0.05))',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8A317, #d4940f)' }}>
                  <Sparkles className="w-4 h-4 text-[#0A0A0F]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">AnantaSutra</p>
                  <p className="text-green-400 text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.type === 'user' ? '' : ''}`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.type === 'user'
                          ? 'rounded-br-md text-[#0A0A0F] font-medium'
                          : 'rounded-bl-md text-gray-200'
                      }`}
                      style={
                        msg.type === 'user'
                          ? { background: 'linear-gradient(135deg, #E8A317, #d4940f)' }
                          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }
                      }
                    >
                      {msg.text}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSend(s)}
                            className="text-[11px] px-2.5 py-1.5 rounded-full border border-saffron-500/20 text-saffron-400 hover:bg-saffron-500/10 hover:border-saffron-500/40 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-saffron-500/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-saffron-500/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-saffron-500/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend() }}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={input.trim() ? { background: 'linear-gradient(135deg, #E8A317, #d4940f)' } : {}}
                >
                  <Send className="w-3.5 h-3.5 text-[#0A0A0F]" />
                </button>
              </form>
              <p className="text-[9px] text-gray-600 text-center mt-1.5">
                Powered by AnantaSutra
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
