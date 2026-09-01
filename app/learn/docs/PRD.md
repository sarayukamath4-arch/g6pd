Document 1: Enhanced Product Requirement Document (PRD)
1. Product Overview
Application Name: Genetic Health Education & Personal Reaction Journal

Initial Clinical Focus: G6PD (Glucose-6-Phosphate Dehydrogenase) Deficiency

This platform is a privacy-first web application designed to help individuals with inherited genetic conditions understand their diagnosis, search and explore potentially reactive substances, scan product labels, log personal reactions, and surface observational ingredient patterns.

The application strictly separates clinically reviewed medical evidence from user-reported observational data, maintaining a clear legal boundary between education/self-observation and clinical diagnosis.

2. Technical Stack Specifications
Frontend Framework: Next.js (App Router, React 19, TypeScript)

Styling & UI: Tailwind CSS + shadcn/ui component library (Mobile-first design)

Database & Authentication: Supabase PostgreSQL with Row-Level Security (RLS) & Supabase Auth (Email/Password + Google OAuth)

Storage: Supabase Storage (product label scans)

AI & Vision Processing: Groq API (llama-3.2-11b-vision-instruct for label OCR, fallback to structured JSON parsing)

Client PDF Generation: @react-pdf/renderer

3. Database Schema Blueprint (Supabase PostgreSQL)
SQL
-- 1. Profiles & Consent
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  disclaimer_accepted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Substances & Chemical Catalog
CREATE TABLE public.substances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'Medication', 'Food', 'Chemical', 'Supplement'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Substance Aliases & Synonyms
CREATE TABLE public.substance_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  substance_id UUID REFERENCES public.substances(id) ON DELETE CASCADE,
  alias_name TEXT NOT NULL UNIQUE
);

-- 4. Clinical Evidence Catalog (Reviewed Medical Data)
CREATE TABLE public.condition_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  substance_id UUID REFERENCES public.substances(id) ON DELETE CASCADE,
  evidence_level TEXT NOT NULL, -- 'High Risk', 'Low Risk', 'Inconclusive', 'No Documented Relation'
  clinical_summary TEXT NOT NULL,
  source_citation TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Reaction Journal Entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  exposure_date TIMESTAMPTZ NOT NULL,
  severity TEXT NOT NULL, -- 'Mild', 'Moderate', 'Severe'
  symptoms_description TEXT,
  label_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Journal Entry Ingredients (Junction Table)
CREATE TABLE public.journal_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  matched_substance_id UUID REFERENCES public.substances(id) ON DELETE SET NULL,
  is_custom BOOLEAN DEFAULT FALSE
);

-- 7. Educational Progress Tracking
CREATE TABLE public.user_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
4. Core System Rules & Guardrails
No Dynamic AI Medical Claims: Medical evidence presented for G6PD triggers must be pulled directly from pre-populated, reviewed Supabase tables (condition_evidence). Groq AI is strictly restricted to text parsing and OCR extraction.

Correlation vs. Causation UI Warnings: Every pattern analysis screen must clearly label findings as "Observed Shared Ingredients" rather than "Reaction Causes."

Scan Data Verification Gate: Photographed product labels cannot be committed directly to the database without explicit human user review on a verification modal.

Data Isolation: All personal reaction entries are protected by PostgreSQL Row-Level Security (RLS) policies scoped strictly to auth.uid() = user_id.