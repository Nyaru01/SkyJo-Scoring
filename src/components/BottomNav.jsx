import { Home, Gamepad2, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { useGameStore } from '../store/gameStore';

export default function BottomNav({ activeTab, onTabChange }) {
    const gameStatus = useGameStore(state => state.gameStatus);

    const tabs = [
        { id: 'home', label: 'Accueil', icon: Home, alwaysEnabled: true },
        { id: 'game', label: 'Partie', icon: Gamepad2, alwaysEnabled: false },
        { id: 'history', label: 'Historique', icon: History, alwaysEnabled: true },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 glass-premium safe-area-bottom z-40 shadow-xl"
            role="tablist"
            aria-label="Navigation principale"
        >
            <div className="flex justify-around items-center h-16 pb-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isDisabled = !tab.alwaysEnabled && gameStatus === 'SETUP';

                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            aria-label={tab.label}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onTabChange(tab.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 active:scale-95",
                                isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600",
                                isDisabled && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            {/* Effet glow derrière l'icône active */}
                            {isActive && (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-500/15 rounded-full blur-lg animate-pulse" />
                            )}
                            {/* Indicateur supérieur */}
                            {isActive && (
                                <span className="absolute top-0 w-10 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-b-lg shadow-glow-emerald animate-scale-in" />
                            )}
                            <Icon
                                className={cn(
                                    "h-5 w-5 transition-all duration-300 relative z-10",
                                    isActive && "fill-emerald-100 stroke-emerald-600 drop-shadow-sm"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn(
                                "text-[9px] font-bold tracking-wide transition-colors pt-0.5 relative z-10",
                                isActive ? "text-emerald-700" : "text-slate-400"
                            )}>
                                {tab.label.toUpperCase()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
