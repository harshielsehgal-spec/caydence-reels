-- Create reels table
CREATE TABLE public.reels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID,
  creator_initials TEXT NOT NULL,
  creator_username TEXT NOT NULL,
  creator_title TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hashtags TEXT,
  video_url TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reel_attempts table for user attempts
CREATE TABLE public.reel_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  ai_match_score INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reel_likes table
CREATE TABLE public.reel_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reel_id, user_id)
);

-- Create reel_saves table
CREATE TABLE public.reel_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reel_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_saves ENABLE ROW LEVEL SECURITY;

-- Reels are publicly readable
CREATE POLICY "Reels are publicly readable" ON public.reels FOR SELECT USING (true);

-- Reel attempts policies
CREATE POLICY "Users can view all attempts" ON public.reel_attempts FOR SELECT USING (true);
CREATE POLICY "Users can insert own attempts" ON public.reel_attempts FOR INSERT WITH CHECK (auth.uid() = athlete_id);

-- Reel likes policies
CREATE POLICY "Likes are publicly readable" ON public.reel_likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.reel_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.reel_likes FOR DELETE USING (auth.uid() = user_id);

-- Reel saves policies
CREATE POLICY "Saves are readable by owner" ON public.reel_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save" ON public.reel_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave" ON public.reel_saves FOR DELETE USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('reels', 'reels', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('reel_attempts', 'reel_attempts', true);

-- Storage policies for reels bucket
CREATE POLICY "Reels are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'reels');

-- Storage policies for reel_attempts bucket
CREATE POLICY "Attempts are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'reel_attempts');
CREATE POLICY "Users can upload attempts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reel_attempts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create leaderboard RPC function
CREATE OR REPLACE FUNCTION public.reel_leaderboard(p_reel_id UUID)
RETURNS TABLE (
  athlete_id UUID,
  best_score INTEGER,
  attempts_count BIGINT,
  rank BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ra.athlete_id,
    MAX(ra.ai_match_score) as best_score,
    COUNT(*)::BIGINT as attempts_count,
    RANK() OVER (ORDER BY MAX(ra.ai_match_score) DESC)::BIGINT as rank
  FROM public.reel_attempts ra
  WHERE ra.reel_id = p_reel_id
  GROUP BY ra.athlete_id
  ORDER BY best_score DESC;
END;
$$;

-- Insert sample reel data
INSERT INTO public.reels (creator_initials, creator_username, creator_title, title, description, hashtags, video_url) VALUES
('JB', '@jasprit_bumrah', 'Pro Bowler · Cricket', 'Master the Yorker Delivery', 'Perfect your yorker with this technique breakdown. Focus on wrist position and release point.', '#cricket #bowling #yorker #technique', '/videos/bumrah_bowling_144.mp4'),
('VS', '@virat_kohli', 'Pro Batter · Cricket', 'Cover Drive Masterclass', 'The perfect cover drive starts with footwork. Watch the ball, move your feet, and follow through.', '#cricket #batting #coverdrive', '/videos/bumrah_bowling_144.mp4'),
('MSD', '@msdhoni', 'Legend · Cricket', 'Helicopter Shot Technique', 'The famous helicopter shot requires strong wrists and perfect timing. Here''s how to master it.', '#cricket #batting #helicopter', '/videos/bumrah_bowling_144.mp4');