import { getCategoryColor, getCategoryLabel, getDifficulty } from '../utils/gameLogic';

interface CategoryBadgeProps {
  category: string;
  difficulty: string;
}

export function CategoryBadge({ category, difficulty }: CategoryBadgeProps) {
  const diff = getDifficulty(difficulty);
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(category)}`}>
        {getCategoryLabel(category)}
      </span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${diff.color}`}>
        {diff.label}
      </span>
    </div>
  );
}
