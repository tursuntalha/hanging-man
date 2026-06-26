import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  gamesWon: number;
  gamesPlayed: number;
  avgGuesses: number;
  winStreak: number;
}

export function StatsDashboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [localStats, setLocalStats] = useState(() => {
    const saved = localStorage.getItem('linguaai_stats');
    return saved ? JSON.parse(saved) : { gamesPlayed: 0, gamesWon: 0, gamesLost: 0, avgGuesses: 0, currentStreak: 0 };
  });

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then(setLeaders)
      .catch(() => {});
  }, []);

  const winRate = localStats.gamesPlayed > 0 ? Math.round((localStats.gamesWon / localStats.gamesPlayed) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Statistics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Games Played', value: localStats.gamesPlayed, color: 'bg-blue-500' },
          { label: 'Won', value: localStats.gamesWon, color: 'bg-green-500' },
          { label: 'Win Rate', value: `${winRate}%`, color: 'bg-purple-500' },
          { label: 'Streak', value: localStats.currentStreak, color: 'bg-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className={`text-2xl font-bold ${stat.color} text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
              {typeof stat.value === 'number' ? stat.value : '--'}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Global Leaderboard</h3>
        {leaders.length === 0 ? (
          <p className="text-gray-400 text-sm">No leaderboard data yet. Play some games to appear here!</p>
        ) : (
          <div className="space-y-2">
            {leaders.map((entry, i) => (
              <div key={entry.playerId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-500'}`}>
                    {i + 1}
                  </span>
                  <span className="font-medium">{entry.playerName || 'Anonymous'}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="mr-3">🏆 {entry.gamesWon}</span>
                  <span>📊 {entry.avgGuesses}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
