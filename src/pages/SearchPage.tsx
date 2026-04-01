import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/navigation/BottomNav";

const sportChips = [
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

interface ReelResult {
  id: string;
  title: string;
  creator_username: string;
  sport: string;
  hashtags: string | null;
  likes_count: number;
}

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [results, setResults] = useState<ReelResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchReels = useCallback(async (searchQuery: string, sport: string | null) => {
    setIsLoading(true);
    setHasSearched(true);

    let q = supabase
      .from("reels")
      .select("id, title, creator_username, sport, hashtags, likes_count")
      .order("likes_count", { ascending: false })
      .limit(20);

    if (searchQuery.trim()) {
      const term = `%${searchQuery.trim()}%`;
      q = q.or(`title.ilike.${term},creator_username.ilike.${term},sport.ilike.${term},hashtags.ilike.${term}`);
    }

    if (sport) {
      q = q.ilike("sport", `%${sport}%`);
    }

    const { data, error } = await q;

    if (error) {
      console.error("Search failed:", error);
      setResults([]);
    } else {
      setResults(data || []);
    }
    setIsLoading(false);
  }, []);

  // Debounced text search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim() && !selectedSport) {
      setHasSearched(false);
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchReels(query, selectedSport);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selectedSport, searchReels]);

  const handleSportClick = (sportId: string) => {
    setSelectedSport((prev) => (prev === sportId ? null : sportId));
  };

  const handleReelClick = (reelId: string) => {
    navigate("/", { state: { selectedReelId: reelId } });
  };

  const sportEmojiMap: Record<string, string> = {
    cricket: "🏏",
    football: "⚽",
    gym: "💪",
    gym_pushup: "💪",
    badminton: "🏸",
    basketball: "🏀",
    yoga: "🧘",
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-[220px] xl:pl-[240px]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reels, sports, athletes"
              className="w-full bg-secondary/50 border border-border/30 rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Trending sport pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sportChips.map((sport) => (
            <button
              key={sport.id}
              onClick={() => handleSportClick(sport.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all min-h-[44px] text-sm font-medium ${
                selectedSport === sport.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/30"
              }`}
            >
              <span>{sport.emoji}</span>
              <span>{sport.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Default state — no search yet */}
        {!hasSearched && !isLoading && (
          <div className="flex flex-col items-center pt-16">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold text-base mb-1">Discover Reels</p>
            <p className="text-muted-foreground text-sm text-center">
              Search by name, sport, or hashtag — or tap a category above
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/30">
                <div className="w-11 h-11 rounded-lg bg-secondary animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 bg-secondary rounded animate-pulse" />
                  <div className="h-2.5 w-24 bg-secondary rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-secondary rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {hasSearched && !isLoading && results.length > 0 && (
          <div className="space-y-2">
            {results.map((reel) => (
              <button
                key={reel.id}
                onClick={() => handleReelClick(reel.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors text-left min-h-[44px]"
              >
                {/* Sport icon */}
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg flex-shrink-0">
                  {sportEmojiMap[reel.sport] || "🎯"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{reel.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{reel.creator_username}</p>
                </div>

                {/* Sport pill */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                  {reel.sport.replace(/_/g, " ")}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {hasSearched && !isLoading && results.length === 0 && (
          <div className="flex flex-col items-center pt-16">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <SearchIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold text-sm">
              No reels found for "{query || selectedSport}"
            </p>
            <p className="text-muted-foreground text-xs mt-1 text-center">
              Try a different search term or category
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
