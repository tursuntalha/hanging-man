import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';

export function Multiplayer() {
  const { connected, room, timer, createRoom, joinRoom, startGame, aiDuelWord, makeGuess, aiGuess, rematch, leaveRoom } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [mode, setMode] = useState<'menu' | 'friend' | 'aiduel'>('menu');
  const [customWord, setCustomWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wordState, setWordState] = useState<{ revealed: string[]; wrong: number; won?: boolean; lost?: boolean } | null>(null);
  const [aiWordState, setAiWordState] = useState<{ revealed: string[]; wrong: number; won?: boolean; lost?: boolean } | null>(null);

  const handleCreateRoom = useCallback(() => {
    if (!playerName) return;
    createRoom(playerName);
    setMode('friend');
  }, [playerName, createRoom]);

  const handleJoinRoom = useCallback(() => {
    if (!playerName || !roomIdInput) return;
    joinRoom(roomIdInput, playerName);
    setMode('friend');
  }, [playerName, roomIdInput, joinRoom]);

  const handleStartFriendGame = useCallback(() => {
    if (!room || !customWord) return;
    setGuessedLetters([]);
    setWordState({ revealed: Array(customWord.length).fill('_'), wrong: 0 });
    startGame(room.id, customWord);
  }, [room, customWord, startGame]);

  const handleStartAIDuel = useCallback(() => {
    if (!room || !customWord) return;
    setGuessedLetters([]);
    setWordState({ revealed: Array(customWord.length).fill('_'), wrong: 0 });
    setAiWordState(null);
    aiDuelWord(room.id, customWord);
  }, [room, customWord, aiDuelWord]);

  const handleGuess = useCallback((letter: string) => {
    if (!room || !wordState || wordState.won || wordState.lost) return;
    if (guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);
    makeGuess(room.id, letter);
  }, [room, wordState, guessedLetters, makeGuess]);

  const handleAIGuess = useCallback(() => {
    if (!room || !aiWordState || aiWordState.won || aiWordState.lost) return;
    aiGuess(room.id);
  }, [room, aiWordState, aiGuess]);

  const handleRematch = useCallback(() => {
    if (!room) return;
    setGuessedLetters([]);
    setWordState(null);
    setAiWordState(null);
    setCustomWord('');
    rematch(room.id);
  }, [room, rematch]);

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500">Connecting to server...</p>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Multiplayer</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-400 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Room Code"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-400 outline-none text-center font-mono"
                maxLength={6}
              />
              <button onClick={handleJoinRoom} className="w-full p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                Join Room
              </button>
            </div>
            <div className="space-y-2">
              <button onClick={handleCreateRoom} className="w-full p-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                Create Room
              </button>
              <button onClick={() => { handleCreateRoom(); setMode('aiduel'); }} className="w-full p-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                AI Duel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {mode === 'aiduel' ? 'AI Duel' : 'Friend Mode'}
          {room && <span className="text-sm font-mono ml-2 text-gray-500">Room: {room.id}</span>}
        </h2>
        <div className="flex items-center gap-2">
          {timer > 0 && <span className="text-sm font-mono text-gray-500">⏱ {timer}s</span>}
          {room?.players.map((p, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{p.name}</span>
          ))}
        </div>
      </div>

      {!wordState && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-2">Enter a word for your opponent to guess</label>
          <input
            type="text"
            placeholder="Type a word..."
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-400 outline-none mb-3 font-mono"
          />
          <div className="flex gap-2">
            <button onClick={handleStartFriendGame} className="flex-1 p-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Start Friend Game
            </button>
            {mode === 'aiduel' && (
              <button onClick={handleStartAIDuel} className="flex-1 p-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                Start AI Duel
              </button>
            )}
          </div>
        </div>
      )}

      {wordState && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Your Opponent's Word</h3>
          <div className="flex justify-center gap-1.5 mb-4">
            {wordState.revealed.map((ch, i) => (
              <span key={i} className={`w-8 h-10 flex items-center justify-center text-lg font-bold rounded border-b-2 ${ch !== '_' ? 'text-primary-500 border-primary-400' : 'border-gray-300'}`}>{ch}</span>
            ))}
          </div>
          <div className="text-sm text-gray-500 mb-3">Wrong: {wordState.wrong}/8</div>
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => {
              const used = guessedLetters.includes(l);
              const correct = wordState.revealed.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => handleGuess(l)}
                  disabled={used || wordState.won || wordState.lost}
                  className={`w-7 h-8 text-xs rounded font-semibold ${correct ? 'bg-green-500 text-white' : ''} ${used && !correct ? 'bg-red-400 text-white' : ''} ${!used ? 'bg-gray-100 dark:bg-gray-700 hover:bg-primary-100' : ''} ${wordState.won || wordState.lost ? 'opacity-50' : ''}`}
                >
                  {l}
                </button>
              );
            })}
          </div>
          {wordState.won && <p className="text-green-500 font-bold text-center">🎉 Your opponent guessed the word!</p>}
          {wordState.lost && <p className="text-red-500 font-bold text-center">💀 Your opponent couldn't guess the word!</p>}
        </div>
      )}

      {mode === 'aiduel' && aiWordState && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">AI's Word (Ollama-Bot guessing)</h3>
          <div className="flex justify-center gap-1.5 mb-4">
            {aiWordState.revealed.map((ch, i) => (
              <span key={i} className={`w-8 h-10 flex items-center justify-center text-lg font-bold rounded border-b-2 ${ch !== '_' ? 'text-purple-500 border-purple-400' : 'border-gray-300'}`}>{ch}</span>
            ))}
          </div>
          <div className="text-sm text-gray-500 mb-3">AI Wrong: {aiWordState.wrong}/8</div>
          <button onClick={handleAIGuess} disabled={aiWordState.won || aiWordState.lost} className="w-full p-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 transition-colors">
            AI Move
          </button>
          {aiWordState.won && <p className="text-purple-500 font-bold text-center mt-2">🤖 AI guessed the word!</p>}
          {aiWordState.lost && <p className="text-green-500 font-bold text-center mt-2">🎉 You beat the AI!</p>}
        </div>
      )}

      <div className="flex gap-2 mt-4 justify-center">
        <button onClick={handleRematch} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Rematch
        </button>
        <button onClick={() => { leaveRoom(room?.id || ''); setMode('menu'); setWordState(null); setAiWordState(null); }} className="px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition-colors">
          Leave
        </button>
      </div>
    </motion.div>
  );
}
