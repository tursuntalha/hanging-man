import mongoose from 'mongoose';

const playerStatsSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  playerName: String,
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  totalGuesses: { type: Number, default: 0 },
  avgGuesses: { type: Number, default: 0 },
  bestCategory: String,
  winStreak: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
});

export const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);
