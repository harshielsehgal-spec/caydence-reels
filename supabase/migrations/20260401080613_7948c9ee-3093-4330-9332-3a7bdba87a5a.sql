CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = athlete_id)
WITH CHECK (auth.uid() = athlete_id);

-- Also allow anon select/update for demo (localStorage athlete_id, not auth)
CREATE POLICY "Anon can view notifications by athlete_id"
ON public.notifications FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon can update notifications"
ON public.notifications FOR UPDATE
TO anon
USING (true);