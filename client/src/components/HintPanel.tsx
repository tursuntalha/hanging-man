import { motion, AnimatePresence } from 'framer-motion';

interface HintPanelProps {
  hints: string[];
  hintsRevealed: string[];
  hintLevel: number;
  onRequestHint: () => void;
  loading: boolean;
  gameOver: boolean;
}

export function HintPanel({ hints, hintsRevealed, hintLevel, onRequestHint, loading, gameOver }: HintPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hints</h3>
        {!gameOver && hintLevel < 3 && (
          <button
            onClick={onRequestHint}
            disabled={loading}
            className="text-xs px-3 py-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {loading ? '...' : 'Get Hint'}
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {hintsRevealed.length === 0 ? (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-400 italic">
            No hints yet. Click "Get Hint" for help!
          </motion.p>
        ) : (
          <div className="space-y-2">
            {hintsRevealed.map((hint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-3 border-primary-400"
              >
                <span className="font-mono text-xs text-primary-500 mr-2">#{i + 1}</span>
                {hint}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
