-- ============================================
-- Website leads -> Zoho CRM
-- Adds the extra contact-form fields and the id of the matching Zoho Lead.
-- Run this in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).
-- ============================================

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT,
  ADD COLUMN IF NOT EXISTS zoho_lead_id TEXT;
