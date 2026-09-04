-- Without a uniqueness constraint, the quiz page's upsert() on (user_id, module_id)
-- has no conflict target to match against, so retaking a quiz inserts a new row
-- instead of updating the existing one.

ALTER TABLE public.user_learning_progress
  ADD CONSTRAINT user_learning_progress_user_module_unique UNIQUE (user_id, module_id);
