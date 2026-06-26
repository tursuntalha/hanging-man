import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { GameBoard } from './components/GameBoard';
import { Multiplayer } from './components/Multiplayer';
import { StatsDashboard } from './components/StatsDashboard';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">LinguaAI</Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm hover:text-primary-500">Play</Link>
            <Link to="/multiplayer" className="text-sm hover:text-primary-500">Multiplayer</Link>
            <Link to="/stats" className="text-sm hover:text-primary-500">Stats</Link>
            <ThemeToggle dark={dark} onToggle={toggleTheme} />
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/stats" element={<StatsDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
