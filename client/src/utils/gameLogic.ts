const MAX_WRONG = 8;

export function createRevealedLetters(word: string, correctGuesses: string[]): string[] {
  return word.split('').map((ch) => (correctGuesses.includes(ch) ? ch : '_'));
}

export function checkWin(revealedLetters: string[]): boolean {
  return revealedLetters.every((ch) => ch !== '_');
}

export function checkLoss(wrongCount: number): boolean {
  return wrongCount >= MAX_WRONG;
}

export function getDifficulty(difficulty: string): { label: string; color: string } {
  switch (difficulty) {
    case 'easy': return { label: 'Easy', color: 'bg-green-500' };
    case 'medium': return { label: 'Medium', color: 'bg-yellow-500' };
    case 'hard': return { label: 'Hard', color: 'bg-red-500' };
    default: return { label: 'Medium', color: 'bg-yellow-500' };
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    technology: 'bg-blue-500',
    literature: 'bg-purple-500',
    science: 'bg-emerald-500',
    geography: 'bg-orange-500',
    popculture: 'bg-pink-500',
    ottoman: 'bg-amber-500',
  };
  return colors[category] || 'bg-gray-500';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technology: 'Technology',
    literature: 'Literature',
    science: 'Science',
    geography: 'Geography',
    popculture: 'Pop Culture',
    ottoman: 'Ottoman Roots',
  };
  return labels[category] || category;
}

export function getEmptyGuesses(): { wrongGuesses: string[]; correctGuesses: string[] } {
  return { wrongGuesses: [], correctGuesses: [] };
}
