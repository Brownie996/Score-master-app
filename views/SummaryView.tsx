
import React, { useMemo } from 'react';
import { Competition } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Trophy, Home, RotateCcw, Crown, Medal } from 'lucide-react';

interface SummaryViewProps {
  match: Competition;
  onRestart: () => void;
  onGoHome: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ match, onRestart, onGoHome }) => {
  const isDark = document.documentElement.classList.contains('dark');

  const teamStats = useMemo(() => {
    const stats = match.teams.map(team => {
      let total = 0;
      const history = match.rounds.map((r) => {
        const roundScore = r.scores[team.id] || 0;
        total += roundScore;
        return { round: r.name, score: total };
      });
      return { 
        ...team, 
        total, 
        history 
      };
    });
    return stats.sort((a, b) => b.total - a.total);
  }, [match]);

  const chartData = useMemo(() => {
    return match.rounds.map((r, rIdx) => {
      const entry: any = { name: r.name };
      match.teams.forEach(t => {
        let cumulative = 0;
        for (let i = 0; i <= rIdx; i++) {
          cumulative += match.rounds[i].scores[t.id] || 0;
        }
        entry[t.name] = cumulative;
      });
      return entry;
    });
  }, [match]);

  const winners = teamStats.slice(0, 3);

  return (
    <div className="flex flex-col h-full space-y-8 pb-32 animate-in fade-in duration-700 overflow-visible">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight dark:text-white">{match.title}</h2>
        <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest">比賽結束</div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center space-x-2 pt-8">
        {/* 2nd Place */}
        {winners[1] && (
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 mb-2 relative flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 shadow-md">
              <span className="text-xl font-bold dark:text-slate-200">{winners[1].name.charAt(0)}</span>
              <div className="absolute inset-0" style={{ backgroundColor: winners[1].color, opacity: 0.15 }}></div>
            </div>
            <div className="w-20 h-24 bg-slate-200 dark:bg-slate-700 rounded-t-2xl flex flex-col items-center justify-center p-2 relative shadow-inner">
                <Medal className="w-6 h-6 text-slate-400 absolute -top-3" />
                <span className="text-[10px] font-bold text-center truncate w-full dark:text-slate-300">{winners[1].name}</span>
                <span className="text-lg font-black dark:text-white">{winners[1].total}</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {winners[0] && (
          <div className="flex flex-col items-center z-10 scale-110">
            <div className="w-20 h-20 rounded-full border-4 border-yellow-400 mb-2 relative flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20">
              <span className="text-2xl font-black dark:text-white">{winners[0].name.charAt(0)}</span>
              <div className="absolute inset-0" style={{ backgroundColor: winners[0].color, opacity: 0.15 }}></div>
              <Crown className="w-6 h-6 text-yellow-500 absolute -top-1 animate-bounce" />
            </div>
            <div className="w-24 h-32 bg-gradient-to-b from-yellow-400 to-amber-600 text-white rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-xl">
                <span className="text-xs font-black uppercase mb-1">Champion</span>
                <span className="text-[11px] font-bold text-center truncate w-full">{winners[0].name}</span>
                <span className="text-2xl font-black">{winners[0].total}</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {winners[2] && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-amber-700 mb-2 relative flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 shadow-md">
              <span className="text-xl font-bold dark:text-slate-200">{winners[2].name.charAt(0)}</span>
              <div className="absolute inset-0" style={{ backgroundColor: winners[2].color, opacity: 0.15 }}></div>
            </div>
            <div className="w-20 h-20 bg-amber-700/20 dark:bg-amber-700/40 rounded-t-2xl flex flex-col items-center justify-center p-2 relative shadow-inner">
                <Medal className="w-5 h-5 text-amber-700 absolute -top-3" />
                <span className="text-[10px] font-bold text-center truncate w-full dark:text-slate-300">{winners[2].name}</span>
                <span className="text-lg font-black dark:text-white">{winners[2].total}</span>
            </div>
          </div>
        )}
      </div>

      {/* All Rankings */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center dark:text-white">
            <Medal className="w-5 h-5 mr-2 text-indigo-500" /> 最終排名
        </h3>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700">
          {teamStats.map((team, idx) => (
            <div key={team.id} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-50 dark:border-slate-700 transition-colors">
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-black w-6 text-center ${idx < 3 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-600"}`}>{idx + 1}</span>
                <div className="w-2 h-8 rounded-full shadow-sm" style={{ backgroundColor: team.color }}></div>
                <span className="font-bold dark:text-slate-200">{team.name}</span>
              </div>
              <span className="text-lg font-black dark:text-white">{team.total} <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">PTS</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center dark:text-white">
            <Trophy className="w-5 h-5 mr-2 text-indigo-500" /> 分數趨勢
        </h3>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-3xl shadow-lg h-[300px] border border-slate-100 dark:border-slate-700">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
              <XAxis 
                dataKey="name" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                stroke={isDark ? "#94a3b8" : "#64748b"}
              />
              <YAxis 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                stroke={isDark ? "#94a3b8" : "#64748b"}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#1e293b'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend 
                verticalAlign="top" 
                iconType="circle" 
                wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} 
              />
              {match.teams.map((team) => (
                <Line 
                  key={team.id} 
                  type="monotone" 
                  dataKey={team.name} 
                  stroke={team.color} 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#1e293b' : 'white' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fixed Bottom Footer for Buttons - Ensuring it's above everything */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/90 dark:via-slate-900/90 to-transparent flex justify-center pointer-events-none">
        <div className="w-full max-w-lg grid grid-cols-2 gap-4 pointer-events-auto">
          <button 
            onClick={onGoHome}
            className="p-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 rounded-2xl font-bold shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>回首頁</span>
          </button>
          <button 
            onClick={onRestart}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>重啟新賽</span>
          </button>
        </div>
      </div>
    </div>
  );
};
