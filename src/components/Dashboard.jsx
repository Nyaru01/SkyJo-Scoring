import { useState, useEffect } from 'react';
import { Settings, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, selectPlayers, selectRounds, selectThreshold, selectGameStatus } from '../store/gameStore';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import ScoreInput from './ScoreInput';
import RoundHistory from './RoundHistory';
import GameOver from './GameOver';
import GameSetup from './GameSetup';
import BottomNav from './BottomNav';

// Variants d'animation pour les transitions de pages
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const pageTransition = {
    type: "tween",
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94]
};

export default function Dashboard() {
    const players = useGameStore(selectPlayers);
    const rounds = useGameStore(selectRounds);
    const threshold = useGameStore(selectThreshold);
    const gameStatus = useGameStore(selectGameStatus);
    const addRound = useGameStore(state => state.addRound);
    const resetGame = useGameStore(state => state.resetGame);
    const [activeTab, setActiveTab] = useState('game');

    // Auto-switch to 'game' tab when the game starts
    useEffect(() => {
        if (gameStatus === 'PLAYING') {
            setActiveTab('game');
        }
    }, [gameStatus]);

    // Calculate totals
    const playerTotals = players.map(p => ({
        ...p,
        score: rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0)
    })).sort((a, b) => a.score - b.score);

    const leadingPlayer = playerTotals[0];

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                if (gameStatus === 'SETUP') {
                    return (
                        <motion.div
                            key="setup"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={pageTransition}
                            className="flex flex-col items-center justify-center min-h-[60vh]"
                        >
                            <GameSetup />
                        </motion.div>
                    );
                }
                return (
                    <motion.div
                        key="home"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="space-y-6"
                    >
                        <Card className="glass-premium shadow-xl card-hover-lift">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-900 drop-shadow-sm">
                                    <Settings className="h-5 w-5" /> Menu Principal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-slate-700 font-medium">
                                    <p>Partie en cours avec <strong>{players.length} joueurs</strong>.</p>
                                    <p>Seuil de fin : <strong>{threshold} points</strong>.</p>
                                </div>

                                <Button
                                    variant="danger"
                                    onClick={() => { if (confirm('Voulez-vous vraiment quitter et réinitialiser la partie ?')) resetGame(); }}
                                    className="w-full justify-start"
                                >
                                    Arrêter la partie
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-emerald-900 font-bold uppercase tracking-wider flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                        En tête
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-800">{leadingPlayer?.name}</div>
                                </div>
                                <div className="text-4xl font-black text-emerald-600 drop-shadow-sm">{leadingPlayer?.score}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );

            case 'history':
                return (
                    <motion.div
                        key="history"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                    >
                        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" /> Historique complet
                        </h2>
                        <RoundHistory rounds={rounds} players={players} isFullPage={true} />
                        {rounds.length === 0 && (
                            <div className="text-center py-10 text-slate-400 font-medium">
                                Aucune manche jouée.
                            </div>
                        )}
                    </motion.div>
                );

            case 'game':
            default:
                return (
                    <motion.div
                        key="game"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="space-y-6 pb-20"
                    >
                        {/* Main Game Container with glassmorphism */}
                        <Card className="glass-premium shadow-2xl overflow-hidden">
                            {/* Header with Stop Game */}
                            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/30">
                                <h2 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-teal-600" />
                                    Partie en cours
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50/80 border-red-300 bg-white/50"
                                    onClick={() => { if (confirm('Arrêter et réinitialiser la partie ?')) resetGame(); }}
                                >
                                    Arrêter
                                </Button>
                            </div>

                            {/* History List */}
                            {rounds.length > 0 && (
                                <div className="p-4 border-b border-white/20">
                                    <h3 className="text-sm font-semibold text-slate-600 mb-3">Manches précédentes</h3>
                                    <RoundHistory rounds={rounds} players={players} isFullPage={false} showHeader={false} />
                                </div>
                            )}

                            {/* Embedded Score Input - Always visible for continuous entry */}
                            <div className="p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50/80 px-3 py-1 rounded-full">
                                        Nouvelle Manche {rounds.length + 1}
                                    </span>
                                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                                </div>

                                <ScoreInput
                                    key={rounds.length} // Force reset when round increases
                                    players={playerTotals}
                                    rounds={rounds}
                                    isEmbedded={true}
                                    onSave={(scores, finisher) => {
                                        addRound(scores, finisher);
                                        setTimeout(() => {
                                            document.getElementById('score-input-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                />
                            </div>
                        </Card>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto p-4 pb-24">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
                {gameStatus === 'FINISHED' && <GameOver />}
            </div>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

