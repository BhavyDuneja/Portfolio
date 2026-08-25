// Document library catalog for the admin panel.
// A curated index of every AnantaSutra document. Sensitive files (legal contracts,
// leads, proposals) are NOT web-served — each entry links to its private Google Drive copy,
// and links are added/edited in the admin UI (persisted to localStorage), never hardcoded here.

export type DocType = 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'md' | 'txt' | 'folder' | 'link'

export type DocEntry = {
  id: string
  name: string
  category: string
  type: DocType
  /** Where the file lives, for reference (Drive folder / repo path). */
  source: string
  /** Optional built-in link (e.g. a public website file). Drive links are added in the UI. */
  link?: string
}

export const DOCUMENT_CATEGORIES = [
  'Legal & Contracts',
  'Proposals',
  'Value Proposition Canvases',
  'Content & Social',
  'SEO & GEO',
  'Research & Leads',
  'Decks & Playbooks',
  'Website',
] as const

export const DOCUMENTS: DocEntry[] = [
  // ─── Legal & Contracts (repo: legal-documents/) ───
  { id: 'legal-01-client-nda', name: 'Client–Company NDA', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/01_Client_Company_NDA.docx' },
  { id: 'legal-02-employee-nda', name: 'Employee NDA & Confidentiality', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/02_Employee_NDA_and_Confidentiality.docx' },
  { id: 'legal-03-ipr', name: 'IPR Assignment & Policy', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/03_IPR_Assignment_and_Policy.docx' },
  { id: 'legal-04-msa', name: 'Master Service Agreement', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/04_Master_Service_Agreement.docx' },
  { id: 'legal-04a-simple-msa', name: 'Simple Service Agreement (Startup)', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/04a_Simple_Service_Agreement_Startup.docx' },
  { id: 'legal-05-employment', name: 'Employment Agreement', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/05_Employment_Agreement.docx' },
  { id: 'legal-05a-simple-employment', name: 'Simple Employment Agreement', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/05a_Simple_Employment_Lakshay_Chauhan.docx' },
  { id: 'legal-06-consultant', name: 'Consultant Agreement', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/06_Consultant_Agreement.docx' },
  { id: 'legal-07-dpa', name: 'Data Processing Agreement (DPDP)', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/07_Data_Processing_Agreement_DPDP.docx' },
  { id: 'legal-08-awish-sa', name: 'Service Agreement — Awish Clinic', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/08_Service_Agreement_Awish_Clinic.docx' },
  { id: 'legal-09-referral', name: 'Referral Partner Agreement', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/09_Referral_Partner_Agreement.docx' },
  { id: 'legal-10-invoice', name: 'Invoice Template', category: 'Legal & Contracts', type: 'docx', source: 'Repo · legal-documents/10_Invoice_Template.docx' },

  // ─── Proposals (Google Drive · AnantaSutra-Proposals) ───
  { id: 'prop-general', name: 'General Proposal (any segment)', category: 'Proposals', type: 'docx', source: 'Drive · AnantaSutra-Proposals/Proposal-00-General.docx' },
  { id: 'prop-segments', name: 'Segment Proposals — all 12 (Doctors, Real Estate, Immigration, Dentists, Architects, Financial Advisors, CAs, Insurance, Dietitians, Vets, Lawyers, Therapists)', category: 'Proposals', type: 'folder', source: 'Drive · AnantaSutra-Proposals/' },

  // ─── Value Proposition Canvases ───
  { id: 'vpc-all', name: 'Value Proposition Canvases — General + 12 segments (with ad-banner prompts)', category: 'Value Proposition Canvases', type: 'folder', source: 'Repo · temp/VPC/' },

  // ─── Content & Social ───
  { id: 'content-calendar', name: '30-Day Content Calendar (LinkedIn + Instagram + X)', category: 'Content & Social', type: 'docx', source: 'Drive · AnantaSutra-Content/content-calendar.docx' },
  { id: 'content-tracker', name: 'Content Tracker (posting status + links)', category: 'Content & Social', type: 'xlsx', source: 'Drive · AnantaSutra-Content/content-tracker.xlsx' },
  { id: 'content-reels', name: 'Reel Shoot Scripts — spoken-only (for models)', category: 'Content & Social', type: 'docx', source: 'Drive · AnantaSutra-Content/Reel-Shoot-Scripts-SpokenOnly.docx' },

  // ─── SEO & GEO ───
  { id: 'seo-tracker', name: 'SEO + GEO Tracker', category: 'SEO & GEO', type: 'xlsx', source: 'Drive · AnantaSutra-SEO/seo-tracker.xlsx' },
  { id: 'seo-articles', name: 'SEO+GEO Articles (daily-generated drafts)', category: 'SEO & GEO', type: 'folder', source: 'Drive · AnantaSutra-SEO/articles/' },
  { id: 'gsc-rank', name: 'Search Console Rank Report', category: 'SEO & GEO', type: 'xlsx', source: 'Drive · AnantaSutra-SEO/gsc-rank.xlsx' },

  // ─── Research & Leads ───
  { id: 'leads-clinics', name: 'Delhi Clinic Leads (522, verified)', category: 'Research & Leads', type: 'xlsx', source: 'Repo · temp/Delhi-Clinic-Leads.xlsx' },
  { id: 'influencers', name: 'India Success-Story Influencers (74)', category: 'Research & Leads', type: 'xlsx', source: 'Drive · AnantaSutra-Influencers/India-Success-Story-Influencers.xlsx' },
  { id: 'events-calendar', name: 'One-Year Events Calendar (2026–27)', category: 'Research & Leads', type: 'xlsx', source: 'Drive · AnantaSutra-Planning/One-Year-Events-Calendar-2026-27.xlsx' },
  { id: 'segmentation', name: 'Target Segmentation Report (12 segments)', category: 'Research & Leads', type: 'docx', source: 'Repo · temp/DDD implementation explanation summary.docx' },

  // ─── Decks & Playbooks ───
  { id: 'pitch-deck', name: 'AnantaSutra Pitch Deck', category: 'Decks & Playbooks', type: 'pptx', source: 'Repo · temp/AnantaSutra-Pitch-Deck.pptx' },
  { id: 'coldcall-playbook', name: 'Cold-Call Playbook', category: 'Decks & Playbooks', type: 'docx', source: 'Repo · temp/AnantaSutra-ColdCall-Playbook.docx' },
  { id: 'wondergifts-deck', name: 'WonderGifts Deck', category: 'Decks & Playbooks', type: 'pptx', source: 'Repo · temp/AnantaSutra-WonderGifts-Deck.pptx' },
  { id: 'video-editor-skillset', name: 'Video Editor Skillset', category: 'Decks & Playbooks', type: 'md', source: 'Repo · temp/AnantaSutra-Video-Editor-Skillset.md' },

  // ─── Website ───
  { id: 'llms-txt', name: 'llms.txt (AI-crawlability file)', category: 'Website', type: 'txt', source: 'Live · anantasutra.com/llms.txt', link: 'https://anantasutra.com/llms.txt' },
]
