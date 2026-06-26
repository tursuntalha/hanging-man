import { motion } from 'framer-motion';

interface GameOverProps {
  state: 'won' | 'lost';
  word: string;
  explanation: string;
  onPlayAgain: () => void;
}

export function GameOver({ state, word, explanation, onPlayAgain }: GameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6"
    >
      <motion.div
        animate={state === 'won' ? { rotate: [0, -10, 10, -10, 0] } : { x: [0, -5, 5, -5, 0] }}
        transition={{ duration: 0.5 }}
        className="text-5xl mb-4"
      >
        {state === 'won' ? '🎉' : '💀'}
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">
        {state === 'won' ? 'You Won!' : 'Game Over'}
      </h2>
      <p className="text-lg mb-1">
        The word was: <span className="font-bold text-primary-600 dark:text-primary-400">{word}</span>
      </p>
      {explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
        >
          {explanation}
        </motion.p>
      )}
      <button
        onClick={onPlayAgain}
        className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
      >
        Play Again
      </button>
    </motion.div>
  );
}
