-- Enable Row-Level Security on all user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS needed for read access)
-- substances, substance_aliases, condition_evidence remain without RLS for public read access

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Journal Entries RLS Policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Journal Ingredients RLS Policies
CREATE POLICY "Users can view ingredients for their journal entries"
  ON public.journal_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE journal_entries.id = journal_ingredients.journal_id
      AND journal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ingredients for their journal entries"
  ON public.journal_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE journal_entries.id = journal_ingredients.journal_id
      AND journal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ingredients for their journal entries"
  ON public.journal_ingredients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE journal_entries.id = journal_ingredients.journal_id
      AND journal_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ingredients for their journal entries"
  ON public.journal_ingredients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE journal_entries.id = journal_ingredients.journal_id
      AND journal_entries.user_id = auth.uid()
    )
  );

-- User Learning Progress RLS Policies
CREATE POLICY "Users can view their own learning progress"
  ON public.user_learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning progress"
  ON public.user_learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning progress"
  ON public.user_learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning progress"
  ON public.user_learning_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Grant public read access to reference tables
GRANT SELECT ON public.substances TO anon;
GRANT SELECT ON public.substance_aliases TO anon;
GRANT SELECT ON public.condition_evidence TO anon;
GRANT SELECT ON public.substances TO authenticated;
GRANT SELECT ON public.substance_aliases TO authenticated;
GRANT SELECT ON public.condition_evidence TO authenticated;