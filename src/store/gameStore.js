import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateRoundScore, checkStrictlyLowest } from '../lib/scoreUtils';

/**
 * Calculate total scores for all players across all rounds
 * @param {Array} players - Array of player objects with id
 * @param {Array} rounds - Array of round objects with scores
 * @returns {Object} Map of player id to total score
 */
const calculateTotals = (players, rounds) => {
    const totals = {};
    players.forEach(p => totals[p.id] = 0);
    rounds.forEach(r => {
        players.forEach(p => {
            totals[p.id] += r.scores[p.id] || 0;
        });
    });
    return totals;
};

/**
 * Check if any player has reached or exceeded the threshold
 */
const checkGameOver = (totals, threshold) => {
    return Object.values(totals).some(score => score >= threshold);
};

export const useGameStore = create(
    persist(
        (set, get) => ({
            // MOCK DATA FOR TESTING - Remove after testing!
            players: [
                { id: 'test-p1', name: 'Alice' },
                { id: 'test-p2', name: 'Bob' },
                { id: 'test-p3', name: 'Charlie' }
            ],
            threshold: 100,
            rounds: [
                {
                    id: 'r1',
                    rawScores: { 'test-p1': 12, 'test-p2': 25, 'test-p3': -5 },
                    scores: { 'test-p1': 12, 'test-p2': 25, 'test-p3': -5 },
                    finisherId: 'test-p3',
                    isStrictlyLowest: true
                },
                {
                    id: 'r2',
                    rawScores: { 'test-p1': 8, 'test-p2': 15, 'test-p3': 20 },
                    scores: { 'test-p1': 8, 'test-p2': 15, 'test-p3': 40 }, // doubled because not lowest
                    finisherId: 'test-p3',
                    isStrictlyLowest: false
                },
                {
                    id: 'r3',
                    rawScores: { 'test-p1': -2, 'test-p2': 0, 'test-p3': 10 },
                    scores: { 'test-p1': -2, 'test-p2': 0, 'test-p3': 10 },
                    finisherId: 'test-p1',
                    isStrictlyLowest: true
                }
            ],
            gameStatus: 'PLAYING', // Start in PLAYING mode with mock data

            setConfiguration: (names, threshold) => {
                const players = names.map((name, index) => ({
                    id: `p${Date.now()}-${index}`,
                    name: name || `Player ${index + 1}`
                }));
                set({
                    players,
                    threshold: Number(threshold) || 100,
                    rounds: [],
                    gameStatus: 'PLAYING'
                });
            },

            addRound: (rawScores, finisherId) => {
                const { rounds, players, threshold } = get();

                const isStrictlyLowest = checkStrictlyLowest(finisherId, rawScores);

                const finalScores = {};
                players.forEach(p => {
                    const raw = rawScores[p.id];
                    const isFinisher = p.id === finisherId;
                    finalScores[p.id] = calculateRoundScore(raw, isFinisher, isStrictlyLowest);
                });

                const newRound = {
                    id: `r${Date.now()}`,
                    rawScores,
                    scores: finalScores,
                    finisherId,
                    isStrictlyLowest
                };

                const nextRounds = [...rounds, newRound];
                const totals = calculateTotals(players, nextRounds);
                const isGameOver = checkGameOver(totals, threshold);

                set({
                    rounds: nextRounds,
                    gameStatus: isGameOver ? 'FINISHED' : 'PLAYING'
                });
            },

            deleteRound: (roundId) => {
                const { rounds, threshold, players } = get();
                const nextRounds = rounds.filter(r => r.id !== roundId);
                const totals = calculateTotals(players, nextRounds);
                const isGameOver = checkGameOver(totals, threshold);

                set({
                    rounds: nextRounds,
                    gameStatus: isGameOver ? 'FINISHED' : 'PLAYING'
                });
            },

            resetGame: () => {
                set({
                    gameStatus: 'SETUP',
                    rounds: [],
                    players: []
                });
            },

            rematch: () => {
                set({
                    gameStatus: 'PLAYING',
                    rounds: []
                });
            }
        }),
        {
            name: 'skyjo-storage',
        }
    )
);

// Computed selectors for optimized re-renders
export const selectPlayers = (state) => state.players;
export const selectRounds = (state) => state.rounds;
export const selectThreshold = (state) => state.threshold;
export const selectGameStatus = (state) => state.gameStatus;

/**
 * Selector for player totals - use with shallow comparison
 */
export const selectPlayerTotals = (state) => {
    return state.players.map(p => ({
        ...p,
        score: state.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0)
    })).sort((a, b) => a.score - b.score);
};
