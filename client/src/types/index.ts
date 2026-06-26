export interface WordData {
  word: string;
  category: string;
  difficulty: string;
  language: string;
  hint1: string;
  hint2: string;
  hint3: string;
  explanation: string;
  etymology: string;
}

export interface GameState {
  word: string;
  category: string;
  difficulty: string;
  state: 'in_progress' | 'won' | 'lost';
  wrongGuesses: string[];
  correctGuesses: string[];
  revealedLetters: string[];
  maxWrong: number;
  hintsUsed: number;
  hintsRevealed: string[];
  hints: string[];
  hintLevel: number;
  explanation: string;
  etymology: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  avgGuesses: number;
  winRate: number;
  currentStreak: number;
}

export interface Room {
  id: string;
  players: { id: string; name: string; isHost: boolean }[];
  state: string;
}

export type GuessResult = {
  correct: boolean;
  revealedLetters?: string[];
  wrongCount?: number;
  state?: string;
  error?: string;
};
