import { v4 as uuidv4 } from 'uuid';

const rooms = new Map();
const TIMER_DURATION = 120;

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('create_room', ({ playerName }) => {
      const roomId = uuidv4().slice(0, 6);
      rooms.set(roomId, {
        id: roomId,
        players: [{ id: socket.id, name: playerName, isHost: true }],
        state: 'waiting',
        currentGame: null,
        timer: null,
      });
      socket.join(roomId);
      socket.emit('room_created', { roomId, players: rooms.get(roomId).players });
    });

    socket.on('join_room', ({ roomId, playerName }) => {
      const room = rooms.get(roomId);
      if (!room) return socket.emit('error', 'Room not found');
      if (room.players.length >= 2) return socket.emit('error', 'Room is full');
      room.players.push({ id: socket.id, name: playerName, isHost: false });
      socket.join(roomId);
      io.to(roomId).emit('room_joined', { players: room.players });
    });

    socket.on('start_game', ({ roomId, word }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const targetPlayer = room.players.find((p) => !p.isHost);
      if (targetPlayer) {
        io.to(targetPlayer.id).emit('game_started', {
          wordLength: word.length,
          category: 'Custom',
          difficulty: 'medium',
        });
        room.currentGame = { word: word.toUpperCase(), guesses: [], wrongCount: 0 };
        startRoomTimer(io, room, roomId);
      }
    });

    socket.on('ai_duel_word', ({ roomId, word }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.currentGame = { word: word.toUpperCase(), guesses: [], wrongCount: 0, aiTurn: true };
      const aiWord = wordBank[Math.floor(Math.random() * wordBank.length)].word;
      room.aiWord = aiWord;
      io.to(roomId).emit('ai_duel_start', { playerWordLength: word.length, aiWordLength: aiWord.length });
    });

    socket.on('guess', ({ roomId, letter }) => {
      const room = rooms.get(roomId);
      if (!room || !room.currentGame) return;
      const game = room.currentGame;
      if (game.guesses.includes(letter)) return;
      game.guesses.push(letter);
      const isCorrect = game.word.includes(letter);
      if (!isCorrect) game.wrongCount++;
      const revealed = game.word.split('').map((ch) => game.guesses.includes(ch) ? ch : '_');
      const won = revealed.every((ch) => ch !== '_');
      const lost = game.wrongCount >= 8;
      io.to(roomId).emit('guess_result', { letter, isCorrect, revealed, wrongCount: game.wrongCount, won, lost });
      if (won || lost) clearRoomTimer(room);
    });

    socket.on('ai_guess', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room || !room.currentGame || !room.currentGame.aiTurn) return;
      const game = room.currentGame;
      const freqOrder = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
      for (const ch of freqOrder) {
        if (!game.guesses.includes(ch)) {
          const letter = ch;
          game.guesses.push(letter);
          const isCorrect = game.aiWord.includes(letter);
          if (!isCorrect) game.wrongCount++;
          const revealed = game.aiWord.split('').map((ch) => game.guesses.includes(ch) ? ch : '_');
          const won = revealed.every((ch) => ch !== '_');
          const lost = game.wrongCount >= 8;
          io.to(roomId).emit('ai_guess_result', { letter, isCorrect, revealed, wrongCount: game.wrongCount, won, lost, aiName: 'Ollama-Bot' });
          if (won || lost) {
            clearRoomTimer(room);
            return;
          }
          break;
        }
      }
    });

    socket.on('rematch', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      room.currentGame = null;
      clearRoomTimer(room);
      io.to(roomId).emit('rematch_ready');
    });

    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
      const room = rooms.get(roomId);
      if (room) {
        room.players = room.players.filter((p) => p.id !== socket.id);
        if (room.players.length === 0) {
          rooms.delete(roomId);
          clearRoomTimer(room);
        } else {
          io.to(roomId).emit('player_left', { players: room.players });
        }
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        room.players = room.players.filter((p) => p.id !== socket.id);
        if (room.players.length === 0) {
          rooms.delete(roomId);
          clearRoomTimer(room);
        } else {
          io.to(roomId).emit('player_left', { players: room.players });
        }
      });
    });
  });
}

function startRoomTimer(io, room, roomId) {
  clearRoomTimer(room);
  room.timeLeft = TIMER_DURATION;
  room.timer = setInterval(() => {
    room.timeLeft--;
    io.to(roomId).emit('timer', { timeLeft: room.timeLeft });
    if (room.timeLeft <= 0) {
      clearRoomTimer(room);
      io.to(roomId).emit('time_up');
    }
  }, 1000);
}

function clearRoomTimer(room) {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }
}
