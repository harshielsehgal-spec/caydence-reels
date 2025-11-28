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

export async function uploadReelAttempt(
  reelId: string,
  athleteId: string,
  videoFile: File
): Promise<{ success: boolean; score: number; coins: number; error?: string }> {
  try {
    // Upload video to storage
    const fileName = `${athleteId}/${Date.now()}_${videoFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('reel_attempts')
      .upload(fileName, videoFile);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, score: 0, coins: 0, error: 'Failed to upload video. Please try again.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('reel_attempts')
      .getPublicUrl(fileName);

    // Generate AI match score (simulated - in production this would call an AI service)
    const aiMatchScore = Math.floor(Math.random() * 26) + 70; // 70-95
    const coinsEarned = Math.floor(aiMatchScore / 10) + 10; // 17-19 coins

    // Try to save attempt to database (but don't fail if it doesn't work)
    const { error: insertError } = await supabase
      .from('reel_attempts')
      .insert({
        reel_id: reelId,
        athlete_id: athleteId,
        video_url: urlData.publicUrl,
        ai_match_score: aiMatchScore,
        coins_earned: coinsEarned,
      });

    if (insertError) {
      // Log DB errors but still show success to user for demo purposes
      console.warn('DB insert failed (demo mode - continuing anyway):', insertError);
    }

    // Always return success with score and coins if storage upload worked
    return { success: true, score: aiMatchScore, coins: coinsEarned };
  } catch (err) {
    console.error('Upload attempt error:', err);
    return { success: false, score: 0, coins: 0, error: 'Failed to upload attempt' };
  }
}

export async function fetchLeaderboard(reelId: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('reel_leaderboard', { p_reel_id: reelId });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data as LeaderboardEntry[];
}

// Stubbed out - no Supabase writes for demo
export async function toggleLike(reelId: string, userId: string, isLiked: boolean): Promise<boolean> {
  return true;
}

// Stubbed out - no Supabase writes for demo
export async function toggleSave(reelId: string, userId: string, isSaved: boolean): Promise<boolean> {
  return true;
}

// Stubbed out - no Supabase reads for demo
export async function checkUserLikedReel(reelId: string, userId: string): Promise<boolean> {
  return false;
}

// Stubbed out - no Supabase reads for demo
export async function checkUserSavedReel(reelId: string, userId: string): Promise<boolean> {
  return false;
}
