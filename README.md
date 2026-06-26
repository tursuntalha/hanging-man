# Hangman — Browser Word Guessing Game

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS Animations](https://img.shields.io/badge/CSS%20Animations-1572B6?style=for-the-badge&logo=css3&logoColor=white)

A classic hangman word guessing game with step-by-step animated SVG drawing, word categories, difficulty levels, and a local leaderboard.

---

## Gameplay

```
  ┌────┐
  │    │        Word: _ _ _ _ _ _ _ _
  │    O        Category: Technology
  │   /|\       Difficulty: Medium
  │    |
  │   / \       Wrong guesses: E, A, I
  ─────────     Remaining: 3 lives
```

Guess letters one by one. Each wrong guess adds a body part to the gallows. Solve the word before the drawing is complete to win.

---

## Planned Features

- **Animated SVG hangman** — step-by-step drawing as wrong guesses accumulate
- **Word categories** — Technology, Nature, Sports, Movies, Countries, Science
- **Difficulty levels:**
  - Easy — short words (4–5 letters), hints available
  - Medium — moderate words (6–8 letters), one hint
  - Hard — long words (9+ letters), no hints
- **Hint system** — reveal one random letter at the cost of a guess
- **Score tracking** — win streak, total score stored in LocalStorage
- **Multiplayer mode** — one player types a word, the other guesses it
- **Word of the day** — a daily challenge word shared across all players

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | CSS Modules + keyframe animations |
| Drawing | SVG (animated paths) |
| Persistence | LocalStorage |
| Deploy | GitHub Pages |

---

## Roadmap

| Phase | Task | Status |
|-------|------|--------|
| Phase 1 | Word bank (200+ words per category) and game logic | [ ] |
| Phase 2 | SVG hangman — incremental animated drawing | [ ] |
| Phase 3 | Letter keyboard component + win/lose detection | [ ] |
| Phase 4 | Category selection and difficulty system | [ ] |
| Phase 5 | Hint system | [ ] |
| Phase 6 | Score tracking and leaderboard (LocalStorage) | [ ] |
| Phase 7 | Multiplayer mode (custom word input) | [ ] |
| Phase 8 | Word of the day | [ ] |
| Phase 9 | Sound effects + responsive design | [ ] |
| Phase 10 | Deploy to GitHub Pages | [ ] |

---

## Getting Started (planned)

```bash
git clone https://github.com/tursuntalha/hanging-man.git
cd hanging-man
npm install
npm run dev
```
