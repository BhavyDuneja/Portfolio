import ServiceFaq, { type Faq } from '@/components/anantasutra/ServiceFaq'

// The searcher's own questions, answered in the site's wording: ₹20,000 to ₹60,000 a month is the only price
// published for a dedicated expert, "about 7 days" and the 48-hour replacement guarantee stay as the site states them.
const faqs: Faq[] = [
  {
    question: 'How much does a dedicated expert cost in India?',
    answer: 'One fixed monthly price, from ₹20,000 to ₹60,000 a month, depending on the expert\'s skills, experience and the work. No extra fees, no recruitment fee, no lock-in. The price is said upfront, before the expert starts.',
    guide: { href: '/blog/cost-hire-dedicated-developer-india', label: 'What a dedicated developer costs in India' },
  },
  {
    question: 'What is a dedicated expert, and how is it different from staff augmentation or resource augmentation?',
    answer: 'Buyers often search for "staff augmentation" or "resource augmentation"; both mean adding outside people to your team for a period. A dedicated expert is one vetted specialist who works only for your business, inside your tools and standups, for one fixed monthly price and with no lock-in. You interview and choose the person, and they report to you.',
    guide: { href: '/blog/staff-augmentation-vs-dedicated-expert', label: 'Staff augmentation vs a dedicated expert' },
  },
  {
    question: 'Can I hire AI experts in India this way?',
    answer: 'Yes. AI engineers, machine-learning specialists and automation experts are among the roles we place, embedded in your team like any other dedicated expert and priced within the same monthly range.',
    guide: { href: '/blog/hire-dedicated-ai-engineer-india', label: 'How to hire a dedicated AI engineer from India' },
  },
  {
    question: 'How fast can the expert start?',
    answer: 'Your expert is live in about 7 days. After a 30-minute call we hand-pick and vet 2-3 experts, you interview and choose, and the one you pick joins your team\'s tools and standups.',
  },
  {
    question: 'What if the fit is wrong?',
    answer: 'Every dedicated expert comes with our 48-hour replacement guarantee. If the fit fails, a vetted replacement joins your team within 48 hours.',
  },
  {
    question: 'Is there a minimum term or lock-in?',
    answer: 'No. The engagement runs month to month, with no lock-in and no recruitment fee. Scale up, pause or stop when your business needs change.',
  },
]

export default function DedicatedExpertsFaq() {
  return (
    <ServiceFaq
      faqs={faqs}
      accent="violet"
      heading={<>Questions founders <span className="gradient-text-violet">ask us</span></>}
    />
  )
}
