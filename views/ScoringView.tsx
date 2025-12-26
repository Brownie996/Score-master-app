
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Competition } from '../types';
import { ChevronLeft, ChevronRight, Plus, Minus, Trophy, Flag, Shuffle, ChevronUp, ChevronDown, Play, Pause, RotateCcw, Timer as TimerIcon, Bell } from 'lucide-react';

interface ScoringViewProps {
  match: Competition;
  onUpdate: (match: Competition) => void;
  onFinish: () => void;
}

export const ScoringView: React.FC<ScoringViewProps> = ({ match, onUpdate, onFinish }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [displayOrder, setDisplayOrder] = useState<string[]>(match.teams.map(t => t.id));

  // Timer State
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (delta: number) => {
    setTimeLeft(prev => Math.max(0, prev + delta));
  };

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

  const shuffleOrder = () => {
    const shuffled = [...displayOrder].sort(() => Math.random() - 0.5);
    setDisplayOrder(shuffled);
  };

  const moveOrder = (id: string, dir: 'up' | 'down') => {
    const idx = displayOrder.indexOf(id);
    const newOrder = [...displayOrder];
    if (dir === 'up' && idx > 0) {
      [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
    } else if (dir === 'down' && idx < newOrder.length - 1) {
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
    }
    setDisplayOrder(newOrder);
  };

  const isLastRound = currentRoundIdx === match.rounds.length - 1;
  const isTimeCritical = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex flex-col h-full space-y-4 max-w-4xl mx-auto w-full relative">
      
      {/* 凍結置頂的計時器 - 改為黃色 #FFD60A */}
      <div className={`fixed top-[64px] left-0 right-0 z-50 px-4 py-3 shadow-2xl transition-all duration-300 ${
        isTimeCritical 
        ? "bg-rose-600 text-white animate-pulse" 
        : timeLeft === 0 
          ? "bg-slate-900 text-slate-400" 
          : "bg-[#FFD60A] text-slate-900"
      }`}>
        <div className="max-w-lg mx-auto flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TimerIcon className={`w-5 h-5 ${isTimeCritical ? "animate-bounce" : ""}`} />
              <span className="text-4xl font-black font-mono tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`p-3 rounded-2xl transition-all active:scale-95 shadow-lg ${
                  isActive ? "bg-white text-slate-900" : "bg-black text-white"
                }`}
              >
                {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>
              <button 
                onClick={() => { setIsActive(false); setTimeLeft(180); }}
                className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all active:scale-90"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-black/5 rounded-xl p-1">
            <div className="flex items-center space-x-1">
              <span className="opacity-60 ml-2 text-slate-800">Min</span>
              <button onClick={() => adjustTime(-60)} className="p-1.5 hover:bg-black/10 rounded-lg"><Minus className="w-3 h-3" /></button>
              <button onClick={() => adjustTime(60)} className="p-1.5 hover:bg-black/10 rounded-lg"><Plus className="w-3 h-3" /></button>
            </div>
            <div className="w-[1px] bg-black/10 h-4 mx-2"></div>
            <div className="flex items-center space-x-1">
              <span className="opacity-60 text-slate-800">Sec</span>
              <button onClick={() => adjustTime(-10)} className="p-1.5 hover:bg-black/10 rounded-lg"><Minus className="w-3 h-3" /></button>
              <button onClick={() => adjustTime(10)} className="p-1.5 hover:bg-black/10 rounded-lg"><Plus className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[100px]"></div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center">
            <Trophy className="w-3 h-3 mr-1" /> 總積分實況
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-900 bg-[#0AFFD6] px-2 py-0.5 rounded-full">REAL-TIME</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTotals.map((team) => (
            <div key={team.id} className="flex flex-col items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 transition-colors" style={{ borderTop: `3px solid ${team.color}` }}>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate max-w-[60px]">{team.name}</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-200">{totalScores[team.id]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <button 
          onClick={() => setCurrentRoundIdx(Math.max(0, currentRoundIdx - 1))}
          disabled={currentRoundIdx === 0}
          className={`p-3 rounded-2xl transition-all ${currentRoundIdx === 0 ? "opacity-20 cursor-not-allowed" : "bg-white dark:bg-slate-800 shadow-md active:scale-90"}`}
        >
          <ChevronLeft className="w-6 h-6 dark:text-white" />
        </button>
        
        <div className="text-center flex flex-col items-center">
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">{currentRound.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
             <button onClick={shuffleOrder} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-[#0AFFD6]/20 active:scale-90 transition-all flex items-center border border-transparent hover:border-[#0AFFD6]/40">
                <Shuffle className="w-3 h-3 mr-1" />
                <span className="text-[10px] font-black uppercase tracking-tighter">隨機排列</span>
             </button>
          </div>
        </div>

        <button 
          onClick={() => setCurrentRoundIdx(Math.min(match.rounds.length - 1, currentRoundIdx + 1))}
          disabled={isLastRound}
          className={`p-3 rounded-2xl transition-all ${isLastRound ? "opacity-20 cursor-not-allowed" : "bg-white dark:bg-slate-800 shadow-md active:scale-90"}`}
        >
          <ChevronRight className="w-6 h-6 dark:text-white" />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-40 px-1 pt-2">
        {displayOrder.map((teamId) => {
          const team = match.teams.find(t => t.id === teamId)!;
          return (
            <div key={team.id} className="relative group">
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:border-[#0AFFD6]/40 transition-all"></div>
              <div className="relative p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col space-y-1">
                      <button onClick={() => moveOrder(team.id, 'up')} className="p-1 text-slate-300 hover:text-[#0AFFD6]"><ChevronUp className="w-4 h-4" /></button>
                      <div className="w-3 h-6 rounded-full mx-auto" style={{ backgroundColor: team.color }}></div>
                      <button onClick={() => moveOrder(team.id, 'down')} className="p-1 text-slate-300 hover:text-[#0AFFD6]"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <div>
                      <span className="text-lg font-black dark:text-white block">{team.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-[150px] font-bold uppercase tracking-wider">{team.members}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">Score</span>
                    <input 
                      type="number"
                      pattern="\d*"
                      value={currentRound.scores[team.id] || 0}
                      onChange={(e) => handleScoreInput(team.id, e.target.value)}
                      className="w-20 text-right font-black text-3xl bg-transparent outline-none focus:text-emerald-500 transition-colors dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <button onClick={() => updateScore(team.id, -1)} className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl flex items-center justify-center transition-all active:scale-90 dark:text-white border border-slate-100 dark:border-slate-700">
                      <Minus className="w-5 h-5" />
                    </button>
                    <button onClick={() => updateScore(team.id, -5)} className="p-4 bg-white dark:bg-slate-900 text-xs font-black rounded-2xl flex items-center justify-center transition-all active:scale-90 text-slate-400 border border-slate-100 dark:border-slate-800">
                      -5
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <button onClick={() => updateScore(team.id, 5)} className="p-4 bg-[#0AFFD6]/10 text-slate-800 dark:text-[#0AFFD6] text-xs font-black rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-[#0AFFD6]/20">
                      +5
                    </button>
                    <button onClick={() => updateScore(team.id, 1)} className="p-4 bg-[#0AFFD6] hover:brightness-110 text-slate-900 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-[#0AFFD6]/20">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLastRound && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent">
          <button 
            onClick={onFinish}
            className="w-full max-w-lg p-5 bg-[#0AFFD6] hover:brightness-110 text-slate-900 rounded-[2rem] font-black shadow-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 pointer-events-auto group"
          >
            <Flag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="text-xl uppercase tracking-tight">結束比賽 & 查看結果</span>
          </button>
        </div>
      )}
    </div>
  );
};
