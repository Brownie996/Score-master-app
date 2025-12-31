
import React, { useMemo, useEffect, useRef } from 'react';
import { Team } from '../types';
import { X, Trophy, Plus, Minus, Timer as TimerIcon, Play, Pause, RotateCcw, Gamepad2, Flag, Crown, Medal, TrendingUp } from 'lucide-react';

interface MiniGameOverlayProps {
  teams: Team[];
  miniScores: Record<string, number>;
  setMiniScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  miniTimeLeft: number;
  setMiniTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isMiniActive: boolean;
  setIsMiniActive: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (results: Record<string, number>) => void;
  onClose: () => void;
}

export const MiniGameOverlay: React.FC<MiniGameOverlayProps> = ({ 
  teams, miniScores, setMiniScores, miniTimeLeft, setMiniTimeLeft, isMiniActive, setIsMiniActive, onFinish, onClose 
}) => {
  const timerRef = useRef<number | null>(null);

  // 計時器邏輯
  useEffect(() => {
    if (isMiniActive && miniTimeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setMiniTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (miniTimeLeft === 0) {
      setIsMiniActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isMiniActive, miniTimeLeft]);

  const updateScore = (id: string, delta: number) => {
    setMiniScores(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => (miniScores[b.id] || 0) - (miniScores[a.id] || 0));
  }, [teams, miniScores]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (delta: number) => {
    setMiniTimeLeft(prev => Math.max(0, prev + delta));
  };

  const isTimeCritical = miniTimeLeft <= 10 && miniTimeLeft > 0;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-purple-950 text-white animate-in fade-in slide-in-from-bottom duration-300">
      
      {/* 1. 全寬計時器 - 位於 Header (64px) 之下 */}
      <div className={`fixed top-[64px] left-0 right-0 z-[160] px-4 py-3 shadow-2xl transition-all duration-300 ${
        isTimeCritical ? "bg-rose-600 text-white animate-pulse" : miniTimeLeft === 0 ? "bg-slate-900 text-slate-400" : "bg-[#FFD60A] text-slate-900"
      }`}>
        <div className="max-w-lg mx-auto flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TimerIcon className={`w-5 h-5 ${isTimeCritical ? "animate-bounce" : ""}`} />
              <span className="text-4xl font-black font-mono tracking-tighter tabular-nums">{formatTime(miniTimeLeft)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsMiniActive(!isMiniActive)} className={`p-3 rounded-2xl transition-all active:scale-95 shadow-lg ${isMiniActive ? "bg-white text-slate-900" : "bg-black text-white"}`}>
                {isMiniActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>
              <button onClick={() => { setIsMiniActive(false); setMiniTimeLeft(60); }} className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all active:scale-90"><RotateCcw className="w-5 h-5" /></button>
              <button onClick={onClose} title="返回計分介面" className="p-3 bg-black/20 hover:bg-black/40 rounded-2xl transition-all ml-2 border border-black/10 flex items-center justify-center">
                <X className="w-5 h-5" />
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

      {/* 2. 可滾動的主內容區 */}
      <div className="flex-1 overflow-y-auto mt-[175px] pb-40">
        
        {/* 榮譽排行榜 (Podium) - 增加內容高度確保隊名不被遮擋 */}
        <div className="px-4 py-8 bg-purple-900/30 backdrop-blur-sm border-b border-purple-800/50 shadow-[inset_0_-4px_20px_rgba(168,85,247,0.1)]">
          <div className="flex items-end justify-center space-x-3 h-52">
            {/* 銀牌 - 2nd */}
            {sortedTeams[1] && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-500 delay-100">
                <div className="relative">
                   <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-400 shadow-[0_0_15px_rgba(226,232,240,0.5)]">
                      <span className="text-slate-900 font-black text-xl">2</span>
                   </div>
                   <Medal className="w-5 h-5 text-slate-400 absolute -top-1 -right-1" />
                </div>
                <div className="bg-slate-300 w-20 h-20 mt-3 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-lg">
                  <span className="text-[11px] font-black text-slate-950 truncate w-full text-center leading-tight mb-1">{sortedTeams[1].name}</span>
                  <span className="text-xl font-black text-slate-900">{miniScores[sortedTeams[1].id] || 0}</span>
                </div>
              </div>
            )}
            {/* 金牌 - 1st */}
            {sortedTeams[0] && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-700">
                <div className="relative mb-2">
                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center border-4 border-amber-600 shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-110">
                      <span className="text-amber-950 font-black text-3xl italic">1</span>
                   </div>
                   <Crown className="w-10 h-10 text-amber-500 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-lg" />
                </div>
                <div className="bg-[#0AFFD6] w-28 h-28 rounded-t-3xl flex flex-col items-center justify-center p-3 shadow-[0_0_20px_rgba(10,255,214,0.3)] border-x-4 border-t-4 border-white/20">
                  <span className="text-[11px] font-black text-slate-900 truncate w-full text-center uppercase tracking-tight mb-1">{sortedTeams[0].name}</span>
                  <span className="text-3xl font-black text-slate-950">{miniScores[sortedTeams[0].id] || 0}</span>
                </div>
              </div>
            )}
            {/* 銅牌 - 3rd - 增加高度 (h-16) 以防止名稱遮擋 */}
            {sortedTeams[2] && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-500 delay-200">
                <div className="relative">
                   <div className="w-14 h-14 rounded-full bg-amber-800 flex items-center justify-center border-4 border-amber-900 shadow-[0_0_15px_rgba(146,64,14,0.4)]">
                      <span className="text-amber-100 font-black text-xl">3</span>
                   </div>
                   <Medal className="w-5 h-5 text-amber-700 absolute -top-1 -right-1" />
                </div>
                <div className="bg-amber-800 w-20 h-16 mt-3 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-lg">
                  <span className="text-[11px] font-black text-amber-100 truncate w-full text-center leading-tight mb-1">{sortedTeams[2].name}</span>
                  <span className="text-xl font-black text-amber-50">{miniScores[sortedTeams[2].id] || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. 全排名快訊區 (非前三名) */}
        {sortedTeams.length > 3 && (
          <div className="p-4 bg-purple-900/10">
            <div className="flex items-center space-x-2 mb-3 px-1">
               <TrendingUp className="w-3 h-3 text-purple-400" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">目前完整站位</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedTeams.slice(3).map((team, idx) => (
                <div key={team.id} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center space-x-2">
                  <span className="text-[9px] font-black text-purple-300">#{idx + 4}</span>
                  <span className="text-xs font-bold truncate max-w-[80px]">{team.name}</span>
                  <span className="text-xs font-black text-[#0AFFD6]">{miniScores[team.id] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 隊伍計分清單 */}
        <div className="px-4 space-y-3 pt-6">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center">
              <Gamepad2 className="w-3 h-3 mr-2" /> 隊伍操作面板
            </h3>
            <span className="text-[10px] bg-purple-800 px-2 py-0.5 rounded-full font-bold text-purple-200 uppercase">Interactive List</span>
          </div>
          
          {teams.map((team) => {
            const rank = sortedTeams.findIndex(t => t.id === team.id) + 1;
            return (
              <div key={team.id} className="flex items-center justify-between p-4 bg-purple-900/40 rounded-3xl border border-purple-800/50 shadow-sm hover:bg-purple-900/60 transition-colors">
                <div className="flex items-center space-x-4 max-w-[60%]">
                  <div className="relative flex-shrink-0">
                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                       <span className="text-[8px] font-black text-purple-900">{rank}</span>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-sm font-black block truncate">{team.name}</span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase block truncate">
                      {team.members || "無人員紀錄"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <button onClick={() => updateScore(team.id, -1)} className="w-10 h-10 flex items-center justify-center bg-purple-800 hover:bg-purple-700 rounded-xl transition-all active:scale-90"><Minus className="w-5 h-5" /></button>
                  <div className="w-10 text-center"><span className="text-2xl font-black text-[#0AFFD6] tabular-nums">{miniScores[team.id] || 0}</span></div>
                  <button onClick={() => updateScore(team.id, 1)} className="w-12 h-12 flex items-center justify-center bg-[#0AFFD6] text-slate-900 rounded-2xl shadow-lg shadow-[#0AFFD6]/10 transition-all active:scale-90"><Plus className="w-6 h-6" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 結算按鈕 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-purple-950 via-purple-950/90 to-transparent flex justify-center z-[110]">
         <button 
          onClick={() => onFinish(miniScores)}
          className="w-full max-w-lg p-5 bg-white text-purple-900 rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center space-x-2 transition-all active:scale-95 group"
        >
          <Flag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="text-xl uppercase tracking-tight">結算本局遊戲並加成積分</span>
        </button>
      </div>

    </div>
  );
};
