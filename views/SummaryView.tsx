
import React, { useMemo } from 'react';
import { Competition } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Trophy, Home, Crown, Medal, Users } from 'lucide-react';

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
    <div className="flex flex-col h-full space-y-8 pb-40 animate-in fade-in duration-500 overflow-visible max-w-4xl mx-auto w-full">
      <div className="text-center space-y-2 pt-4">
        <h2 className="text-3xl font-black tracking-tight dark:text-white uppercase">{match.title}</h2>
        <div className="inline-block px-4 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">比賽總結</div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center space-x-2 pt-8">
        {winners[1] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-300 dark:border-slate-600 mb-2 flex items-center justify-center bg-white dark:bg-slate-800 shadow-md">
              <span className="text-lg font-bold dark:text-white">{winners[1].name.charAt(0)}</span>
            </div>
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-t-2xl flex flex-col items-center justify-center p-2 relative">
                <Medal className="w-5 h-5 text-slate-400 absolute -top-2.5" />
                <span className="text-[10px] font-bold text-center truncate w-full dark:text-slate-200">{winners[1].name}</span>
                <span className="text-lg font-black dark:text-white">{winners[1].total}</span>
            </div>
          </div>
        )}

        {winners[0] && (
          <div className="flex flex-col items-center z-10 scale-110">
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 mb-2 flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl shadow-amber-500/10">
              <span className="text-xl font-black dark:text-white">{winners[0].name.charAt(0)}</span>
              <Crown className="w-5 h-5 text-amber-500 absolute -top-4" />
            </div>
            <div className="w-24 h-28 bg-indigo-600 text-white rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-2xl">
                <span className="text-[10px] font-black uppercase mb-1 opacity-80">Winner</span>
                <span className="text-[11px] font-bold text-center truncate w-full">{winners[0].name}</span>
                <span className="text-2xl font-black">{winners[0].total}</span>
            </div>
          </div>
        )}

        {winners[2] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-4 border-amber-700/50 mb-2 flex items-center justify-center bg-white dark:bg-slate-800 shadow-md">
              <span className="text-lg font-bold dark:text-white">{winners[2].name.charAt(0)}</span>
            </div>
            <div className="w-20 h-16 bg-amber-700/10 dark:bg-amber-900/30 rounded-t-2xl flex flex-col items-center justify-center p-2 relative">
                <Medal className="w-5 h-5 text-amber-700 absolute -top-2.5" />
                <span className="text-[10px] font-bold text-center truncate w-full dark:text-slate-200">{winners[2].name}</span>
                <span className="text-lg font-black dark:text-white">{winners[2].total}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rankings Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center px-1">
            <Users className="w-4 h-4 mr-2" /> 隊伍表現與成員
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teamStats.map((team, idx) => (
            <div key={team.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className={`text-xs font-black w-5 text-center ${idx < 3 ? "text-indigo-600" : "text-slate-300"}`}>{idx + 1}</span>
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }}></div>
                <div className="truncate">
                  <span className="font-bold text-sm dark:text-white block truncate">{team.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
                    {team.members || "無人員紀錄"}
                  </span>
                </div>
              </div>
              <span className="text-xl font-black dark:text-white ml-4 flex-shrink-0">{team.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center px-1">
            <Trophy className="w-4 h-4 mr-2" /> 積分成長曲線
        </h3>
        <div className="bg-white dark:bg-slate-900 p-4 pt-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-[300px] min-w-0" style={{ minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke={isDark ? "#475569" : "#94a3b8"} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} stroke={isDark ? "#475569" : "#94a3b8"} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f1f5f9' : '#1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '9px', fontWeight: 'bold' }} />
              {match.teams.map((team) => (
                <Line 
                  key={team.id} 
                  type="monotone" 
                  dataKey={team.name} 
                  stroke={team.color} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#0f172a' : 'white' }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons - Restart removed, only Go Home left */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 bg-gradient-to-t from-white dark:from-slate-950 via-white/90 dark:via-slate-950/90 to-transparent flex justify-center">
        <div className="w-full max-w-lg">
          <button 
            onClick={onGoHome} 
            className="w-full p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            <Home className="w-6 h-6" />
            <span className="text-lg">返回首頁</span>
          </button>
        </div>
      </div>
    </div>
  );
};
