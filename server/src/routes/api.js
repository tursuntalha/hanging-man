import { Router } from 'express';
import { wordBank } from '../services/wordBank.js';
import { generateWord, generateHint, generateExplanation } from '../services/ollamaService.js';
import { Game } from '../models/Game.js';
import { PlayerStats } from '../models/PlayerStats.js';

export const apiRouter = Router();

function pickFromBank(category, difficulty) {
  let pool = wordBank;
  if (category) pool = pool.filter((w) => w.category === category);
  if (difficulty) pool = pool.filter((w) => w.difficulty === difficulty);
  if (pool.length === 0) pool = wordBank;
  return pool[Math.floor(Math.random() * pool.length)];
}

apiRouter.post('/word', async (req, res) => {
  try {
    const { category, difficulty, language } = req.body;
    let wordData;
    if (process.env.OLLAMA_URL && process.env.USE_OLLAMA !== 'false') {
      wordData = await generateWord(category || 'technology', difficulty || 'medium', language || 'en');
    }
    if (!wordData) {
      wordData = pickFromBank(category, difficulty);
    }
    res.json(wordData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/hint', async (req, res) => {
  try {
    const { word, category, hintLevel, previousHints } = req.body;
    let hintText;
    if (process.env.OLLAMA_URL && process.env.USE_OLLAMA !== 'false') {
      hintText = await generateHint(word, category, hintLevel, previousHints || []);
    }
    if (!hintText) {
      const wordEntry = wordBank.find((w) => w.word === word);
      hintText = wordEntry ? wordEntry[`hint${hintLevel}`] : `Hint: It starts with "${word[0]}" and has ${word.length} letters.`;
    }
    res.json({ hint: hintText, level: hintLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/explain', async (req, res) => {
  try {
    const { word, category, language } = req.body;
    let explanation;
    if (process.env.OLLAMA_URL && process.env.USE_OLLAMA !== 'false') {
      explanation = await generateExplanation(word, category, language || 'en');
    }
    if (!explanation) {
      const wordEntry = wordBank.find((w) => w.word === word);
      explanation = wordEntry ? `${wordEntry.explanation} (${wordEntry.etymology})` : `The word "${word}" belongs to the ${category} category.`;
    }
    res.json({ word, explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/game', async (req, res) => {
  try {
    const { word, category, difficulty, playerId } = req.body;
    const game = new Game({
      word: word.toUpperCase(),
      category,
      difficulty,
      playerId,
      revealedLetters: Array(word.length).fill('_'),
    });
    await game.save();
    res.json({ gameId: game._id, revealedLetters: game.revealedLetters, wordLength: word.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/game/:id/guess', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    const { letter } = req.body;
    const result = game.guess(letter);
    await game.save();
    res.json({ ...result, state: game.state, wrongCount: game.wrongGuesses.length, correctCount: game.correctGuesses.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/game/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/stats', async (req, res) => {
  try {
    const { playerId, playerName, won, guesses } = req.body;
    let stats = await PlayerStats.findOne({ playerId });
    if (!stats) {
      stats = new PlayerStats({ playerId, playerName });
    }
    stats.gamesPlayed++;
    if (won) {
      stats.gamesWon++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.winStreak) stats.winStreak = stats.currentStreak;
    } else {
      stats.gamesLost++;
      stats.currentStreak = 0;
    }
    stats.totalGuesses += guesses;
    stats.avgGuesses = Math.round((stats.totalGuesses / stats.gamesPlayed) * 100) / 100;
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/leaderboard', async (_req, res) => {
  try {
    const leaders = await PlayerStats.find().sort({ gamesWon: -1 }).limit(10);
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/categories', (_req, res) => {
  const categories = [...new Set(wordBank.map((w) => w.category))];
  res.json(categories);
});
