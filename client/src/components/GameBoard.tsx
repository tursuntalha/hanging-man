import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { HangmanSVG } from './HangmanSVG';
import { Keyboard } from './Keyboard';
import { WordDisplay } from './WordDisplay';
import { HintPanel } from './HintPanel';
import { CategoryBadge } from './CategoryBadge';
import { GameOver } from './GameOver';

const CATEGORIES = [
  { id: '', label: 'Random', emoji: '🎲' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'literature', label: 'Literature', emoji: '📚' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'geography', label: 'Geography', emoji: '🌍' },
  { id: 'popculture', label: 'Pop Culture', emoji: '🎬' },
  { id: 'ottoman', label: 'Ottoman Roots', emoji: '🏛️' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

export function GameBoard() {
  const { game, loading, error, startGame, guess, requestHint, getExplanation, reset } = useGame();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');

  if (loading && !game) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!game) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">LinguaAI</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">AI-Powered Word Guessing Game</p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-left">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${category === c.id ? 'bg-primary-500 text-white ring-2 ring-primary-300' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-left">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${difficulty === d.id ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-left">Language</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${language === 'tr' ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                🇹🇷 Turkish
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={() => startGame(category || undefined, difficulty, language)}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-lg"
          >
            Start Game
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <CategoryBadge category={game.category} difficulty={game.difficulty} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <HangmanSVG wrongCount={game.wrongGuesses.length} gameOver={game.state !== 'in_progress'} />
          <div className="text-center text-sm text-gray-500">
            Wrong: {game.wrongGuesses.length} / {game.maxWrong}
          </div>
        </div>
        <div>
          <WordDisplay revealedLetters={game.revealedLetters} showWord={game.state === 'lost'} word={game.word} />
          <HintPanel
            hints={game.hints}
            hintsRevealed={game.hintsRevealed}
            hintLevel={game.hintLevel}
            onRequestHint={requestHint}
            loading={loading}
            gameOver={game.state !== 'in_progress'}
          />
        </div>
      </div>

      {game.state === 'in_progress' && (
        <Keyboard
          onGuess={guess}
          wrongGuesses={game.wrongGuesses}
          correctGuesses={game.correctGuesses}
          disabled={false}
        />
      )}

      {game.state !== 'in_progress' && (
        <GameOver
          state={game.state}
          word={game.word}
          explanation={game.explanation}
          onPlayAgain={reset}
        />
      )}
    </motion.div>
  );
}
