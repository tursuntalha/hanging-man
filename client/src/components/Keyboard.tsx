import { motion } from 'framer-motion';

interface KeyboardProps {
  onGuess: (letter: string) => void;
  wrongGuesses: string[];
  correctGuesses: string[];
  disabled: boolean;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function Keyboard({ onGuess, wrongGuesses, correctGuesses, disabled }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-4">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((letter) => {
            const isWrong = wrongGuesses.includes(letter);
            const isCorrect = correctGuesses.includes(letter);
            const isUsed = isWrong || isCorrect;
            return (
              <motion.button
                key={letter}
                whileHover={!isUsed && !disabled ? { scale: 1.1 } : {}}
                whileTap={!isUsed && !disabled ? { scale: 0.95 } : {}}
                onClick={() => !isUsed && !disabled && onGuess(letter)}
                className={`
                  w-8 h-10 sm:w-10 sm:h-12 rounded text-sm sm:text-base font-semibold
                  transition-all duration-150 select-none
                  ${isCorrect ? 'bg-green-500 text-white' : ''}
                  ${isWrong ? 'bg-red-400 text-white' : ''}
                  ${!isUsed ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow hover:shadow-md border border-gray-300 dark:border-gray-600' : ''}
                  ${disabled && !isUsed ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isUsed ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
