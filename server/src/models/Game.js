import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  word: { type: String, required: true },
  category: String,
  difficulty: String,
  state: { type: String, enum: ['in_progress', 'won', 'lost'], default: 'in_progress' },
  wrongGuesses: { type: [String], default: [] },
  correctGuesses: { type: [String], default: [] },
  revealedLetters: { type: [String], default: [] },
  maxWrong: { type: Number, default: 8 },
  playerId: String,
  hintsUsed: { type: Number, default: 0 },
  hintsRevealed: { type: [String], default: [] },
  startedAt: { type: Date, default: Date.now },
  finishedAt: Date,
  isMultiplayer: { type: Boolean, default: false },
  roomId: String,
});

gameSchema.methods.guess = function (letter) {
  letter = letter.toUpperCase();
  if (this.state !== 'in_progress') return { error: 'Game is over' };
  if (this.wrongGuesses.includes(letter) || this.correctGuesses.includes(letter)) {
    return { error: 'Letter already guessed' };
  }
  if (this.word.includes(letter)) {
    this.correctGuesses.push(letter);
    this.revealedLetters = this.word.split('').map((ch) =>
      this.correctGuesses.includes(ch) ? ch : '_'
    );
    if (this.revealedLetters.every((ch) => ch !== '_')) {
      this.state = 'won';
      this.finishedAt = new Date();
    }
    return { correct: true, revealedLetters: this.revealedLetters };
  } else {
    this.wrongGuesses.push(letter);
    if (this.wrongGuesses.length >= this.maxWrong) {
      this.state = 'lost';
      this.finishedAt = new Date();
    }
    return { correct: false, wrongCount: this.wrongGuesses.length };
  }
};

export const Game = mongoose.model('Game', gameSchema);
