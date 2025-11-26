
import React, { useState, useEffect } from 'react';

interface MatchmakingEngineProps {
    params: any;
    onMatchesFound?: (matches: any[]) => void;
    autoRun?: boolean;
    compact?: boolean;
}

const MatchmakingEngine: React.FC<MatchmakingEngineProps> = ({ params, onMatchesFound, autoRun = false, compact = false }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [matches, setMatches] = useState<any[]>([]);

    const runMatchmaking = async () => {
        setIsSearching(true);
        // Mock matchmaking logic
        setTimeout(() => {
            const mockMatches = [
                {
                    type: 'baseline',
                    title: 'Primary Target Match',
                    location: params.region || 'Target Region',
                    score: 85,
                    incentives: '5-year tax holiday, infrastructure grants',
                    velocity: '18 months'
                },
                {
                    type: 'alternative',
                    title: 'Alternative Location 1',
                    location: 'Vietnam',
                    score: 88,
                    incentives: '10-year tax holiday, workforce training',
                    velocity: '12 months'
                },
                {
                    type: 'synergistic',
                    title: 'Tripartite Partnership',
                    location: 'Regional Hub',
                    partners: ['Local Government', 'University', 'Logistics Company'],
                    score: 92,
                    benefits: 'Integrated talent pipeline, streamlined logistics'
                }
            ];
            setMatches(mockMatches);
            if (onMatchesFound) onMatchesFound(mockMatches);
            setIsSearching(false);
        }, 2000);
    };

    useEffect(() => {
        if (autoRun && matches.length === 0) {
            runMatchmaking();
        }
    }, [autoRun]);

    return (
        <div className={`space-y-4 ${compact ? '' : 'space-y-6'}`}>
            {!compact && (
                <div className="bg-bronze-50 border border-bronze-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-bronze-900 mb-2">🎯 Multi-Layered Matchmaking Engine</h3>
                    <p className="text-sm text-bronze-800 mb-4">
                        Find the best opportunities beyond your initial idea. Our AI analyzes global data to identify superior alternatives and synergistic partnerships.
                    </p>
                    <button
                        onClick={runMatchmaking}
                        disabled={isSearching}
                        className="bg-bronze-600 text-white px-6 py-2.5 rounded-lg hover:bg-bronze-700 disabled:opacity-50 font-bold transition-colors flex items-center gap-2"
                    >
                        {isSearching ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Searching Global Index...
                            </>
                        ) : (
                            '🚀 Run Global Matchmaking'
                        )}
                    </button>
                </div>
            )}

            {/* Compact Header for Auto-Run Mode */}
            {compact && matches.length === 0 && isSearching && (
                <div className="flex items-center gap-3 text-bronze-600 p-4 bg-bronze-50 rounded-lg border border-bronze-100 animate-pulse">
                    <div className="w-4 h-4 border-2 border-bronze-200 border-t-bronze-600 rounded-full animate-spin"></div>
                    <span className="text-xs font-bold uppercase tracking-wider">Scanning Global Opportunities...</span>
                </div>
            )}

            {matches.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    {!compact && <h4 className="text-lg font-semibold text-gray-900">📊 Matchmaking Results</h4>}
                    <div className="grid gap-3">
                        {matches.map((match, index) => (
                            <div key={index} className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${compact ? 'p-4' : 'p-5'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className={`font-bold text-gray-900 ${compact ? 'text-sm' : 'text-lg'}`}>{match.title}</h5>
                                        <p className="text-xs text-gray-500">{match.location}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                        match.type === 'baseline' ? 'bg-green-100 text-green-800' :
                                        match.type === 'alternative' ? 'bg-bronze-100 text-bronze-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {match.type}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2 rounded mb-2">
                                    <div>
                                        <span className="block font-bold text-gray-400 uppercase text-[10px]">Score</span>
                                        <span className="text-green-600 font-bold">{match.score}/100</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-400 uppercase text-[10px]">Time</span>
                                        <span className="text-gray-800 font-medium">{match.velocity}</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-400 uppercase text-[10px]">Benefit</span>
                                        <span className="text-gray-800 font-medium truncate" title={match.incentives}>
                                            {match.incentives?.split(',')[0]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchmakingEngine;
