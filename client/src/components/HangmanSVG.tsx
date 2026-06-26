import { motion, AnimatePresence } from 'framer-motion';

const paths = [
  // 0: Base
  'M10 230 L190 230',
  // 1: Pole
  'M50 230 L50 20 L150 20 L150 40',
  // 2: Rope
  'M150 40 L150 60',
  // 3: Head
  'M150 75 A15 15 0 1 1 150 74.9',
  // 4: Body
  'M150 90 L150 150',
  // 5: Left arm
  'M150 105 L120 135',
  // 6: Right arm
  'M150 105 L180 135',
  // 7: Left leg
  'M150 150 L120 185',
  // 8: Right leg
  'M150 150 L180 185',
];

interface HangmanSVGProps {
  wrongCount: number;
  gameOver: boolean;
}

export function HangmanSVG({ wrongCount, gameOver }: HangmanSVGProps) {
  return (
    <div className="relative w-48 h-56 mx-auto">
      <svg viewBox="0 0 200 250" className="w-full h-full hangman-svg">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: i <= wrongCount ? 1 : 0,
              opacity: i <= wrongCount ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={gameOver ? 'stroke-red-500' : 'stroke-gray-700 dark:stroke-gray-300'}
          />
        ))}
        {/* Face expression changes */}
        <AnimatePresence>
          {wrongCount >= 3 && wrongCount < 8 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.circle cx="143" cy="72" r="2" fill="currentColor" />
              <motion.circle cx="157" cy="72" r="2" fill="currentColor" />
              <motion.path d="M143 82 Q150 88 157 82" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </motion.g>
          )}
        </AnimatePresence>
        {wrongCount >= 8 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -3, 3, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <motion.line x1="140" y1="69" x2="146" y2="75" stroke="red" strokeWidth="1.5" />
            <motion.line x1="146" y1="69" x2="140" y2="75" stroke="red" strokeWidth="1.5" />
            <motion.line x1="154" y1="69" x2="160" y2="75" stroke="red" strokeWidth="1.5" />
            <motion.line x1="160" y1="69" x2="154" y2="75" stroke="red" strokeWidth="1.5" />
            <motion.path d="M140 84 Q150 78 160 84" fill="none" stroke="red" strokeWidth="1.5" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
