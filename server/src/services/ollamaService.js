const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

function buildWordPrompt(category, difficulty, language) {
  const lang = language || 'en';
  return `You are a word game master for a hangman game. Generate ONE word matching these criteria:
- Category: ${category}
- Difficulty: ${difficulty} (easy=short common words, medium=moderate, hard=long/obscure)
- Language: ${lang === 'tr' ? 'Turkish' : 'English'}

Return ONLY valid JSON with these fields:
{
  "word": "THEWORD",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "language": "${lang}",
  "hint1": "A very vague hint",
  "hint2": "A medium-specific hint",
  "hint3": "A very obvious hint that nearly gives it away",
  "explanation": "Brief educational explanation about the word",
  "etymology": "The origin of the word"
}

Rules:
- The word must be a real ${lang === 'tr' ? 'Turkish' : 'English'} word
- Word must be between 4-10 letters
- Hints should be educational and interesting
- No special characters, only A-Z${lang === 'tr' ? ' and Turkish letters' : ''}`;
}

function buildHintPrompt(word, category, hintLevel, previousHints) {
  return `You are a hangman hint system. The word is "${word}" in category "${category}".
Generate hint level ${hintLevel} (1=vague, 2=medium, 3=specific/obvious).
Previous hints: ${previousHints.join(', ') || 'none yet'}
Return ONLY the hint text, no JSON, no quotes.`;
}

function buildExplanationPrompt(word, category, language) {
  return `Explain the word "${word}" (category: ${category}) in ${language === 'tr' ? 'Turkish' : 'English'}.
Include: meaning, origin/etymology, interesting facts, usage example.
Keep it under 100 words. Educational tone.`;
}

async function generateWord(category, difficulty, language) {
  try {
    const prompt = buildWordPrompt(category, difficulty, language);
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false, temperature: 0.8 }),
    });
    const data = await response.json();
    return JSON.parse(data.response.trim().replace(/```json|```/g, '').trim());
  } catch (err) {
    console.warn('Ollama generation failed, fallback to static bank:', err.message);
    return null;
  }
}

async function generateHint(word, category, hintLevel, previousHints) {
  try {
    const prompt = buildHintPrompt(word, category, hintLevel, previousHints);
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false, temperature: 0.7 }),
    });
    const data = await response.json();
    return data.response.trim().replace(/^["']|["']$/g, '');
  } catch (err) {
    console.warn('Ollama hint failed:', err.message);
    return null;
  }
}

async function generateExplanation(word, category, language) {
  try {
    const prompt = buildExplanationPrompt(word, category, language);
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false, temperature: 0.5 }),
    });
    const data = await response.json();
    return data.response.trim().replace(/^["']|["']$/g, '');
  } catch (err) {
    console.warn('Ollama explanation failed:', err.message);
    return null;
  }
}

export { generateWord, generateHint, generateExplanation };
