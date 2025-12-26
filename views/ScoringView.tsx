
import React, { useState, useMemo } from 'react';
import { Competition } from '../types';
import { ChevronLeft, ChevronRight, Plus, Minus, Trophy, Flag } from 'lucide-react';

interface ScoringViewProps {
  match: Competition;
  onUpdate: (match: Competition) => void;
  onFinish: () => void;
}

export const ScoringView: React.FC<ScoringViewProps> = ({ match, onUpdate, onFinish }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  const currentRound = match.rounds[currentRoundIdx];

  const totalScores = useMemo(() => {
    const totals: Record<string, number> = {};
    match.teams.forEach(t => totals[t.id] = 0);
    match.rounds.forEach(r => {
      Object.entries(r.scores).forEach(([teamId, score]) => {
        totals[teamId] = (totals[teamId] || 0) + (score as number);
      });
    });
    return totals;
  }, [match]);

  const sortedTotals = useMemo(() => {
    return [...match.teams].sort((a, b) => totalScores[b.id] - totalScores[a.id]);
  }, [match.teams, totalScores]);

  const updateScore = (teamId: string, delta: number) => {
    const updatedRounds = [...match.rounds];
    const updatedScores = { ...updatedRounds[currentRoundIdx].scores };
    updatedScores[teamId] = (updatedScores[teamId] || 0) + delta;
    updatedRounds[currentRoundIdx] = { ...updatedRounds[currentRoundIdx], scores: updatedScores };
    onUpdate({ ...match, rounds: updatedRounds });
  };

  const handleScoreInput = (teamId: string, val: string) => {
    const num = parseInt(val) || 0;
    const updatedRounds = [...match.rounds];
    const updatedScores = { ...updatedRounds[currentRoundIdx].scores };
    updatedScores[teamId] = num;
    updatedRounds[currentRoundIdx] = { ...updatedRounds[currentRoundIdx], scores: updatedScores };
    onUpdate({ ...match, rounds: updatedRounds });
  };

  const isLastRound = currentRoundIdx === match.rounds.length - 1;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Real-time Total Header */}
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center">
            <Trophy className="w-3 h-3 mr-1" /> 總積分實況
          </span>
          <span className="text-xs font-bold text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTotals.map((team) => (
            <div key={team.id} className="flex flex-col items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl shadow-sm border-t-4 transition-colors" style={{ borderTopColor: team.color }}>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate max-w-[60px]">{team.name}</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-200">{totalScores[team.id]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Round Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentRoundIdx(Math.max(0, currentRoundIdx - 1))}
          disabled={currentRoundIdx === 0}
          className={`p-3 rounded-2xl transition-all ${currentRoundIdx === 0 ? "opacity-20 cursor-not-allowed" : "bg-white dark:bg-slate-800 shadow-md active:scale-90"}`}
        >
          <ChevronLeft className="w-6 h-6 dark:text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-black dark:text-white">{currentRound.name}</h2>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ROUND {currentRoundIdx + 1}</p>
        </div>
        <button 
          onClick={() => setCurrentRoundIdx(Math.min(match.rounds.length - 1, currentRoundIdx + 1))}
          disabled={isLastRound}
          className={`p-3 rounded-2xl transition-all ${isLastRound ? "opacity-20 cursor-not-allowed" : "bg-white dark:bg-slate-800 shadow-md active:scale-90"}`}
        >
          <ChevronRight className="w-6 h-6 dark:text-white" />
        </button>
      </div>

      {/* Team Score Cards */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-32 px-1">
        {match.teams.map((team) => (
          <div key={team.id} className="relative group">
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-lg transform group-hover:scale-[1.01] transition-all duration-300"></div>
            <div className="relative p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-10 rounded-full shadow-sm" style={{ backgroundColor: team.color }}></div>
                  <span className="text-xl font-extrabold truncate max-w-[140px] dark:text-white">{team.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase">本局得分</span>
                  <input 
                    type="number"
                    pattern="\d*"
                    value={currentRound.scores[team.id] || 0}
                    onChange={(e) => handleScoreInput(team.id, e.target.value)}
                    className="w-20 text-right font-black text-2xl bg-transparent outline-none focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <button onClick={() => updateScore(team.id, -1)} className="p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl flex items-center justify-center transition-all active:scale-90 dark:text-white">
                    <Minus className="w-5 h-5" />
                  </button>
                  <button onClick={() => updateScore(team.id, -5)} className="p-4 bg-slate-50 dark:bg-slate-900/50 text-xs font-black rounded-2xl flex items-center justify-center transition-all active:scale-90 dark:text-slate-400">
                    -5
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <button onClick={() => updateScore(team.id, 5)} className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-2xl flex items-center justify-center transition-all active:scale-90">
                    +5
                  </button>
                  <button onClick={() => updateScore(team.id, 1)} className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-md shadow-indigo-200 dark:shadow-none">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Area */}
      {isLastRound && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none">
          <button 
            onClick={onFinish}
            className="w-full max-w-lg p-5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 pointer-events-auto group"
          >
            <Flag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="text-lg">結束比賽 & 統計排名</span>
          </button>
        </div>
      )}
    </div>
  );
};
