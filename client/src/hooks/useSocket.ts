import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room } from '../types';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const s = io('/', { transports: ['websocket', 'polling'] });
    socketRef.current = s;
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    return () => { s.disconnect(); };
  }, []);

  const createRoom = useCallback((playerName: string) => {
    socketRef.current?.emit('create_room', { playerName });
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    socketRef.current?.emit('join_room', { roomId, playerName });
  }, []);

  const startGame = useCallback((roomId: string, word: string) => {
    socketRef.current?.emit('start_game', { roomId, word });
  }, []);

  const aiDuelWord = useCallback((roomId: string, word: string) => {
    socketRef.current?.emit('ai_duel_word', { roomId, word });
  }, []);

  const makeGuess = useCallback((roomId: string, letter: string) => {
    socketRef.current?.emit('guess', { roomId, letter });
  }, []);

  const aiGuess = useCallback((roomId: string) => {
    socketRef.current?.emit('ai_guess', { roomId });
  }, []);

  const rematch = useCallback((roomId: string) => {
    socketRef.current?.emit('rematch', { roomId });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketRef.current?.emit('leave_room', { roomId });
    setRoom(null);
  }, []);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    s.on('room_created', (data) => setRoom({ id: data.roomId, players: data.players, state: 'waiting' }));
    s.on('room_joined', (data) => setRoom((prev) => prev ? { ...prev, players: data.players } : prev));
    s.on('game_started', (data) => setRoom((prev) => prev ? { ...prev, state: 'playing' } : prev));
    s.on('player_left', (data) => setRoom((prev) => prev ? { ...prev, players: data.players } : prev));
    s.on('timer', (data) => setTimer(data.timeLeft));
    s.on('time_up', () => setRoom((prev) => prev ? { ...prev, state: 'waiting' } : prev));
    s.on('rematch_ready', () => setRoom((prev) => prev ? { ...prev, state: 'waiting', currentGame: null } : prev));
  }, []);

  return { socket: socketRef.current, connected, room, timer, createRoom, joinRoom, startGame, aiDuelWord, makeGuess, aiGuess, rematch, leaveRoom };
}
