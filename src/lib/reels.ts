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

export async function uploadReelAttempt(
  reelId: string,
  athleteId: string,
  videoFile: File
): Promise<{ success: boolean; score: number; coins: number; error?: string }> {
  try {
    // Upload video to Supabase storage
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

    // Fetch the reference reel video_url and sport from Supabase
    const reelData = await supabase
      .from('reels')
      .select('video_url, sport')
      .eq('id', reelId)
      .single();

    if (reelData.error || !reelData.data) {
      console.error('Could not fetch reel data:', reelData.error);
      return { success: false, score: 0, coins: 0, error: 'Could not load reference reel.' };
    }

    const { video_url: referenceUrl, sport } = reelData.data;

    // Fetch reference video as blob to send to backend
    const refResponse = await fetch(referenceUrl);
    const refBlob = await refResponse.blob();
    const refFile = new File([refBlob], 'reference.mp4', { type: 'video/mp4' });

    // Call FastAPI backend
    const formData = new FormData();
    formData.append('attempt_video', videoFile);
    formData.append('reference_video', refFile);

    const analyzeResponse = await fetch(
      `https://caydence-reels-backend.onrender.com/reels/analyze?reel_id=${reelId}&sport=${sport || 'generic'}`,
      { method: 'POST', body: formData }
    );

    if (!analyzeResponse.ok) {
      throw new Error('Backend analyze call failed');
    }

    const { job_id } = await analyzeResponse.json();

    // Poll for result every 1s, max 30 attempts
    let aiMatchScore = 0;
    for (let i = 0; i < 60; i++) {
      await new Promise(res => setTimeout(res, 1000));
      const resultResponse = await fetch(`https://caydence-reels-backend.onrender.com/reels/result/${job_id}`);
      const resultData = await resultResponse.json();

      if (resultData.status === 'complete' && resultData.result) {
        aiMatchScore = resultData.result.score;
        break;
      }
    }

    if (aiMatchScore === 0) {
      throw new Error('Scoring timed out');
    }

    const coinsEarned = Math.floor(aiMatchScore / 10) + 10;

    // Save attempt to Supabase
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
      console.warn('DB insert failed (continuing anyway):', insertError);
    }

    return { success: true, score: aiMatchScore, coins: coinsEarned };

  } catch (err) {
    console.error('Upload attempt error:', err);
    return { success: false, score: 0, coins: 0, error: 'Analysis failed. Please try again.' };
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