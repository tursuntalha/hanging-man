# 🧠 LinguaAI — AI-Powered Multilingual Word Game

![Status](https://img.shields.io/badge/Status-Complete-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

> **"Kelime oyunu değil, dil öğretmeni."**

---

## The Problem

Classic hangman is static and forgettable. The word list is fixed, hints don't teach you anything, and you either win or lose with no insight. You've guessed "PYTHON" but have no idea why it's in the "Technology" category or where the word came from.

## The Solution

**LinguaAI** is a hangman-style word game where a **local LLM is the game master**. It picks contextually interesting words, generates progressive hints that teach you something real, adapts difficulty to your performance, and explains every word after the game — like a language teacher, not a random word picker.

---

## Game Modes

| Mode | Description |
|------|-------------|
| 🎮 **Classic** | Standard hangman — AI picks thematic words with smart hints |
| 🤖 **AI Duel** | You guess AI's word, then AI tries to guess yours (AI uses letter frequency analysis) |
| 🇹🇷 **Turkish NLP** | Turkish words only — AI teaches etymology, Ottoman roots, usage examples |
| ⚡ **Speed Mode** | 30-second rounds, AI drops progressive hints to help you win fast |

---

## AI Hint System

Unlike static hints, LinguaAI's hints teach:

```
Word: _ _ _ _ _ _ _ _ (8 letters)
Category: Technology

Hint 1: "Bu kelime İngilizce'de bir inşaat terimi olarak doğdu, 
         sonra programlamaya geçti."

Hint 2: "Bir şeyi tekrar tekrar yapmanın sistematik yolu."

Hint 3: "Python'da 'for' döngüsü bununla başlar."

Word revealed: ITERATION

Post-game explanation:
"'Iteration' Latince 'iterare' (tekrarlamak) kökünden gelir.
 Programlamada bir döngünün her turu bir iteration'dır.
 Agile metodolojide sprint döngüleri de iteration olarak adlandırılır."
```

---

## Architecture

```
┌────────────────────────────────────────────────────┐
│                 React Client                       │
│   Game Board | Keyboard | Hint Panel | SVG Drawing │
└──────────────────────┬─────────────────────────────┘
                       │  REST + WebSocket
┌──────────────────────▼─────────────────────────────┐
│              Node.js Backend                       │
│   Game session management | Score tracking          │
└────────┬──────────────────────────┬────────────────┘
         │                          │
┌────────▼──────────┐    ┌──────────▼──────────────┐
│  Ollama (local)   │    │     Socket.io            │
│  qwen2.5:7b       │    │  Multiplayer rooms        │
│  Word generation  │    │  AI Duel move sync        │
│  Hint generation  │    │  Live opponent state      │
│  Post-game explain│    └─────────────────────────┘
└───────────────────┘
```

---

## SVG Hangman Animation

The gallows drawing is built from 8 animated SVG paths, each revealed on a wrong guess:

```
Step 0: Empty gallows frame
Step 1: Head (circle)
Step 2: Body (vertical line)
Step 3: Left arm
Step 4: Right arm
Step 5: Left leg
Step 6: Right leg
Step 7: Face expression changes (😐 → 😨) via SVG path morphing
Step 8: Game over — full figure with Framer Motion shake
```

---

## Word Categories & AI Generation

Instead of a static word list, the AI generates **contextually appropriate words** per category on-demand:

| Category | AI Word Style |
|----------|--------------|
| Technology | Programming terms, CS concepts, tools |
| Turkish Literature | Words from Nazım Hikmet, Orhan Pamuk era |
| Science | Biology, physics, chemistry terms |
| Geography | Cities, rivers, mountains — with location hints |
| Pop Culture | Movie titles, game characters, tech brands |
| Ottoman Roots | Words derived from Arabic/Persian via Ottoman Turkish |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion (SVG morphing, transitions) |
| AI Game Master | Ollama (qwen2.5:7b — local) |
| Multiplayer | Socket.io |
| Backend | Node.js + Express |
| Persistence | LocalStorage (stats) + MongoDB (leaderboard) |

---

## Implementation Roadmap

### Phase 1 — Core Game Logic
- [x] Word schema: { word, category, difficulty, language }
- [x] Seed static word bank (200 words × 6 categories) as fallback
- [x] Game state machine: in_progress | won | lost
- [x] Wrong guess counter, revealed letters array
- [x] Win/lose detection logic

### Phase 2 — SVG Hangman + UI
- [x] 8-step animated SVG component (Framer Motion path reveal)
- [x] Keyboard component (26 letter buttons, disabled after used)
- [x] Word display (blanks + revealed letters)
- [x] Category badge + difficulty indicator
- [x] Responsive layout (mobile keyboard remap)

### Phase 3 — Ollama AI Game Master
- [x] Ollama backend proxy (Express endpoint `/api/word`, `/api/hint`, `/api/explain`)
- [x] Word generation prompt (category + difficulty → word + metadata)
- [x] Progressive hint generation (3 hints, increasingly specific)
- [x] Post-game explanation (etymology + usage example in Turkish)
- [x] Difficulty adaptation: track win rate → adjust word complexity

### Phase 4 — Multiplayer (AI Duel + Friend Mode)
- [x] Socket.io rooms (create room → share link)
- [x] Friend mode: Player A types word → Player B guesses
- [x] AI Duel: AI guesses your word using letter frequency + Ollama reasoning
- [x] Live opponent state sync (which letters they guessed)
- [x] Room timer + rematch button

### Phase 5 — Stats + Polish
- [x] Player stats dashboard (win rate, avg guesses, best category)
- [x] Global leaderboard (MongoDB, top 10 per category)
- [x] Sound effects (correct guess ding, wrong guess thud, win fanfare)
- [x] Dark/light theme
- [x] Turkish NLP mode: word + full Ottoman etymology chain
- [x] Deploy to Vercel (frontend) + Railway (backend)

---

## Getting Started (once Phase 1 is complete)

```bash
# Prerequisites: Node.js 18+, Ollama
ollama pull qwen2.5:7b

git clone https://github.com/tursuntalha/hanging-man.git
cd hanging-man

# Backend
cd server && npm install && npm start

# Frontend
cd ../client && npm install && npm run dev
```

---

> LinguaAI turns "I guessed the wrong letter" into "I just learned what iteration means in Ottoman-influenced Turkish computing terminology."
