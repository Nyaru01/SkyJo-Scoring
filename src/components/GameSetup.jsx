import { useState } from 'react';
import { Plus, X, User, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useGameStore } from '../store/gameStore';
import { cn } from '../lib/utils';

// Couleurs uniques pour chaque joueur
const PLAYER_COLORS = [
    { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-100' },
    { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-100' },
    { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-100' },
    { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-100' },
    { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-100' },
    { bg: 'bg-cyan-500', text: 'text-cyan-700', light: 'bg-cyan-100' },
    { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-100' },
    { bg: 'bg-pink-500', text: 'text-pink-700', light: 'bg-pink-100' },
];

export default function GameSetup() {
    const [playerNames, setPlayerNames] = useState(['', '']);
    const [threshold, setThreshold] = useState(100);
    const setConfiguration = useGameStore(state => state.setConfiguration);

    const addPlayer = () => {
        if (playerNames.length < 8) {
            setPlayerNames([...playerNames, '']);
        }
    };

    const removePlayer = (index) => {
        if (playerNames.length > 2) {
            const newNames = [...playerNames];
            newNames.splice(index, 1);
            setPlayerNames(newNames);
        }
    };

    const updateName = (index, value) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const handleStart = () => {
        // Filter out empty names or default them
        const finalNames = playerNames.map((n, i) => n.trim() || `Joueur ${i + 1}`);
        setConfiguration(finalNames, threshold);
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header Premium */}
            <div className="text-center mb-8 glass-premium p-6 rounded-3xl shadow-xl relative overflow-hidden">
                {/* Effet shimmer subtil */}
                <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-winner flex items-center justify-center shadow-glow-emerald animate-float">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-sm">
                        Skyjo Score
                    </h1>
                    <p className="text-slate-700 font-semibold mt-2">Configuration de la partie</p>
                </div>
            </div>

            {/* Carte Joueurs */}
            <Card className="glass-premium shadow-xl card-hover-lift">
                <CardHeader>
                    <CardTitle className="text-emerald-900 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Joueurs
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {playerNames.map((name, index) => {
                        const color = PLAYER_COLORS[index];
                        return (
                            <div
                                key={index}
                                className="flex gap-2 animate-scale-in"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className="relative flex-1">
                                    {/* Pastille de couleur du joueur */}
                                    <div className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm",
                                        color.bg
                                    )}>
                                        {index + 1}
                                    </div>
                                    <Input
                                        placeholder={`Joueur ${index + 1}`}
                                        value={name}
                                        onChange={(e) => updateName(index, e.target.value)}
                                        className={cn(
                                            "pl-12 bg-white/60 border-white/40 focus:bg-white/90 focus:border-emerald-300 transition-all shadow-sm",
                                            name && "font-medium"
                                        )}
                                    />
                                </div>
                                {playerNames.length > 2 && (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => removePlayer(index)}
                                        className="shrink-0 text-red-600 hover:bg-red-100/70 hover:text-red-700 bg-white/60 border-white/40 transition-all"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}

                    {playerNames.length < 8 && (
                        <Button
                            variant="outline"
                            className="w-full mt-2 border-dashed border-emerald-400/60 text-emerald-800 hover:bg-emerald-50/60 hover:border-emerald-500 bg-white/30 transition-all card-hover-lift"
                            onClick={addPlayer}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Ajouter un joueur
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Carte Seuil */}
            <Card className="glass-premium shadow-xl card-hover-lift">
                <CardHeader>
                    <CardTitle className="text-emerald-900">🎯 Fin de partie</CardTitle>
                </CardHeader>
                <CardContent>
                    <label className="text-sm font-semibold text-emerald-800 mb-3 block">
                        Score maximum (Seuil)
                    </label>
                    <Input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value) || 100)}
                        className="text-2xl font-bold text-center bg-white/60 border-white/40 focus:bg-white/90 focus:border-emerald-300 shadow-sm h-14"
                    />
                    <p className="text-xs text-emerald-800/70 mt-3 font-medium text-center">
                        La partie se termine lorsqu'un joueur atteint ce score.
                    </p>
                </CardContent>
            </Card>

            {/* Bouton Démarrer */}
            <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 text-white font-bold shadow-xl shadow-emerald-900/25 border border-white/20 h-14 text-lg animate-pulse-glow card-hover-lift"
                onClick={handleStart}
            >
                🚀 Commencer la partie
            </Button>
        </div>
    );
}
