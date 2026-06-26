import { motion } from 'framer-motion';

interface WordDisplayProps {
  revealedLetters: string[];
  showWord: boolean;
  word: string;
}

export function WordDisplay({ revealedLetters, showWord, word }: WordDisplayProps) {
  return (
    <div className="flex justify-center gap-1.5 sm:gap-2 my-6">
      {(showWord ? word.split('') : revealedLetters).map((letter, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`
            w-8 h-10 sm:w-10 sm:h-12 flex items-center justify-center
            text-lg sm:text-2xl font-bold rounded border-b-2
            ${letter !== '_' ? 'text-primary-600 dark:text-primary-400 border-primary-400' : 'text-gray-400 border-gray-300 dark:border-gray-600'}
            ${showWord ? 'bg-green-100 dark:bg-green-900/30' : ''}
          `}
        >
          {letter}
        </motion.div>
      ))}
    </div>
  );
}
