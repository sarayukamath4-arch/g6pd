-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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

-- Create indexes for better search performance
CREATE INDEX idx_substances_canonical_name ON public.substances USING gin(canonical_name gin_trgm_ops);
CREATE INDEX idx_substance_aliases_alias_name ON public.substance_aliases USING gin(alias_name gin_trgm_ops);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_exposure_date ON public.journal_entries(exposure_date DESC);
CREATE INDEX idx_journal_ingredients_journal_id ON public.journal_ingredients(journal_id);
CREATE INDEX idx_user_learning_progress_user_id ON public.user_learning_progress(user_id);
CREATE INDEX idx_condition_evidence_substance_id ON public.condition_evidence(substance_id);