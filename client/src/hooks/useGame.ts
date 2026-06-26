import { useState, useCallback } from 'react';
import { GameState, WordData } from '../types';
import { createRevealedLetters, checkWin, checkLoss } from '../utils/gameLogic';

const API = '/api';

export function useGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startGame = useCallback(async (category?: string, difficulty?: string, language?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, language }),
      });
      if (!res.ok) throw new Error('Failed to get word');
      const wordData: WordData = await res.json();
      setGame({
        word: wordData.word,
        category: wordData.category,
        difficulty: wordData.difficulty,
        state: 'in_progress',
        wrongGuesses: [],
        correctGuesses: [],
        revealedLetters: createRevealedLetters(wordData.word, []),
        maxWrong: 8,
        hintsUsed: 0,
        hintsRevealed: [],
        hints: [wordData.hint1, wordData.hint2, wordData.hint3],
        hintLevel: 0,
        explanation: wordData.explanation || '',
        etymology: wordData.etymology || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const guess = useCallback((letter: string) => {
    if (!game || game.state !== 'in_progress') return;
    const upper = letter.toUpperCase();
    if (game.wrongGuesses.includes(upper) || game.correctGuesses.includes(upper)) return;

    const isCorrect = game.word.includes(upper);
    const newWrong = isCorrect ? game.wrongGuesses : [...game.wrongGuesses, upper];
    const newCorrect = isCorrect ? [...game.correctGuesses, upper] : game.correctGuesses;
    const revealed = createRevealedLetters(game.word, newCorrect);
    const won = checkWin(revealed);
    const lost = checkLoss(newWrong.length);

    setGame({
      ...game,
      wrongGuesses: newWrong,
      correctGuesses: newCorrect,
      revealedLetters: revealed,
      state: won ? 'won' : lost ? 'lost' : 'in_progress',
    });
  }, [game]);

  const requestHint = useCallback(async () => {
    if (!game || game.hintLevel >= 3) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: game.word, category: game.category, hintLevel: game.hintLevel + 1, previousHints: game.hintsRevealed }),
      });
      const data = await res.json();
      setGame((prev) => prev ? {
        ...prev,
        hintsRevealed: [...prev.hintsRevealed, data.hint],
        hintLevel: prev.hintLevel + 1,
        hintsUsed: prev.hintsUsed + 1,
      } : prev);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [game]);

  const getExplanation = useCallback(async () => {
    if (!game || game.state === 'in_progress') return;
    try {
      const res = await fetch(`${API}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: game.word, category: game.category }),
      });
      const data = await res.json();
      setGame((prev) => prev ? { ...prev, explanation: data.explanation } : prev);
    } catch (err: any) {
      setError(err.message);
    }
  }, [game]);

  const reset = useCallback(() => {
    setGame(null);
    setError('');
  }, []);

  return { game, loading, error, startGame, guess, requestHint, getExplanation, reset };
}
