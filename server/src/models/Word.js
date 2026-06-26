import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  category: {
    type: String,
    enum: ['technology', 'literature', 'science', 'geography', 'popculture', 'ottoman'],
    required: true,
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  language: { type: String, enum: ['en', 'tr'], default: 'en' },
  hint1: String,
  hint2: String,
  hint3: String,
  explanation: String,
  etymology: String,
});

export const Word = mongoose.model('Word', wordSchema);
