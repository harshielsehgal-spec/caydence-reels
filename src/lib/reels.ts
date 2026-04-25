import { supabase } from "@/integrations/supabase/client";

export interface Reel {
  id: string;
  creator_id: string | null;
  creator_initials: string;
  creator_username: string;
  creator_title: string;
  title: string;
  description: string | null;
  hashtags: string | null;
  video_url: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  sport: string;
}

export interface ReelAttempt {
  id: string;
  reel_id: string;
  athlete_id: string;
  video_url: string;
  ai_match_score: number;
  coins_earned: number;
  created_at: string;
}

export interface LeaderboardEntry {
  athlete_id: string;
  best_score: number;
  attempts_count: number;
  rank: number;
}

export async function fetchReels(): Promise<Reel[]> {
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reels:', error);
    return [];
  }

  return data as Reel[];
}

// uploadReelAttempt was removed: file-picker upload path replaced by in-app
// recorder (see UploadAttemptModal -> POST /reels/upload_recorded).

export async function fetchLeaderboard(reelId: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('reel_leaderboard', { p_reel_id: reelId });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data as LeaderboardEntry[];
}

export async function toggleLike(reelId: string, userId: string, isLiked: boolean): Promise<boolean> {
  return true;
}

export async function toggleSave(reelId: string, userId: string, isSaved: boolean): Promise<boolean> {
  return true;
}

export async function checkUserLikedReel(reelId: string, userId: string): Promise<boolean> {
  return false;
}

export async function checkUserSavedReel(reelId: string, userId: string): Promise<boolean> {
  return false;
}