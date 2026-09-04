-- The auto-create-profile trigger (003) set disclaimer_accepted_at = NOW() at signup,
-- which caused the onboarding page's "already accepted?" check to pass immediately,
-- so new users skipped the required medical disclaimer entirely.
-- Fix: allow NULL until the user actually accepts, and stop the trigger from
-- pre-filling it.

ALTER TABLE public.profiles ALTER COLUMN disclaimer_accepted_at DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, disclaimer_accepted_at)
  VALUES (
    NEW.id,
    NEW.email,
    NULL -- set when the user actually accepts the disclaimer in onboarding
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
