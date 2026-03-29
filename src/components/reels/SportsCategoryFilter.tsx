interface SportsCategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  { id: "all", label: "All", emoji: "🔥" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "gym", label: "Gym", emoji: "💪" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

const SportsCategoryFilter = ({ selected, onSelect }: SportsCategoryFilterProps) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selected === cat.id
                ? "gradient-primary text-primary-foreground glow-orange"
                : "bg-secondary/80 backdrop-blur-sm border border-border text-foreground hover:border-primary/40"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportsCategoryFilter;
