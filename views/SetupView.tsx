
import React, { useState } from 'react';
import { Competition, Team, Round } from '../types';
import { DEFAULT_COLORS, PRESET_TEAMS } from '../constants';
import { ArrowLeft, Check, Trophy, Users } from 'lucide-react';

interface SetupViewProps {
  onCancel: () => void;
  onStart: (match: Competition) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onCancel, onStart }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('團體積分賽');
  const [teamCount, setTeamCount] = useState(8);
  const [roundCount, setRoundCount] = useState(3);
  
  const [teams, setTeams] = useState<Team[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `team-${Date.now()}-${i}`,
      name: PRESET_TEAMS[i]?.name || `隊伍 ${i + 1}`,
      members: PRESET_TEAMS[i]?.members || "",
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length]
    }));
  });

  const [rounds, setRounds] = useState<Round[]>(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `round-${Date.now()}-${i}`,
      name: `第 ${i + 1} 局`,
      scores: {}
    }));
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : onCancel();

  const handleTeamChange = (id: string, field: keyof Team, value: string) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const updateTeamCount = (val: number) => {
    const nextVal = Math.max(1, Math.min(10, val));
    setTeamCount(nextVal);
    if (nextVal > teams.length) {
      const added = Array.from({ length: nextVal - teams.length }, (_, i) => ({
        id: `team-${Date.now()}-${teams.length + i}`,
        name: PRESET_TEAMS[teams.length + i]?.name || `隊伍 ${teams.length + i + 1}`,
        members: PRESET_TEAMS[teams.length + i]?.members || "",
        color: DEFAULT_COLORS[(teams.length + i) % DEFAULT_COLORS.length]
      }));
      setTeams([...teams, ...added]);
    } else {
      setTeams(teams.slice(0, nextVal));
    }
  };

  const updateRoundCount = (val: number) => {
    const nextVal = Math.max(1, Math.min(20, val));
    setRoundCount(nextVal);
    if (nextVal > rounds.length) {
      const added = Array.from({ length: nextVal - rounds.length }, (_, i) => ({
        id: `round-${Date.now()}-${rounds.length + i}`,
        name: `第 ${rounds.length + i + 1} 局`,
        scores: {}
      }));
      setRounds([...rounds, ...added]);
    } else {
      setRounds(rounds.slice(0, nextVal));
    }
  };

  const handleStartMatch = () => {
    const match: Competition = {
      id: `match-${Date.now()}`,
      title,
      teams,
      rounds: rounds.map(r => {
        const initialScores: Record<string, number> = {};
        teams.forEach(t => initialScores[t.id] = 0);
        return { ...r, scores: initialScores };
      }),
      isFinished: false,
      createdAt: Date.now(),
    };
    onStart(match);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 max-w-2xl mx-auto w-full">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-xl font-bold">創建比賽 {step}/3</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 space-y-6 px-1">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 flex items-center"><Trophy className="w-4 h-4 mr-2" /> 比賽名稱</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none shadow-sm transition-all dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">隊伍數量</label>
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                  <button onClick={() => updateTeamCount(teamCount - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 font-bold">-</button>
                  <span className="flex-1 text-center font-bold text-lg dark:text-white">{teamCount}</span>
                  <button onClick={() => updateTeamCount(teamCount + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 font-bold">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">比賽局數</label>
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm border border-slate-100 dark:border-slate-700">
                  <button onClick={() => updateRoundCount(roundCount - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 font-bold">-</button>
                  <span className="flex-1 text-center font-bold text-lg dark:text-white">{roundCount}</span>
                  <button onClick={() => updateRoundCount(roundCount + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <label className="text-sm font-bold text-slate-500">隊伍與名單設定</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, idx) => (
                <div key={team.id} className="flex flex-col space-y-3 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border-l-8 transition-all" style={{ borderLeftColor: team.color }}>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-300">#{idx + 1}</span>
                    <input 
                      type="text" 
                      placeholder="隊伍名稱"
                      value={team.name}
                      onChange={e => handleTeamChange(team.id, 'name', e.target.value)}
                      className="flex-1 bg-transparent border-b border-slate-100 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold py-1 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="隊員名單 (例如：王小明, 李小華)"
                      value={team.members}
                      onChange={e => handleTeamChange(team.id, 'members', e.target.value)}
                      className="flex-1 bg-transparent text-xs outline-none dark:text-slate-300"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {DEFAULT_COLORS.map(c => (
                      <button 
                        key={c}
                        onClick={() => handleTeamChange(team.id, 'color', c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${team.color === c ? "border-slate-400 scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <label className="text-sm font-bold text-slate-500">自訂場次名稱</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rounds.map((round, idx) => (
                <div key={round.id} className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                   <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center rounded-xl text-indigo-600 dark:text-indigo-400 font-black">
                      {idx + 1}
                   </div>
                   <input 
                    type="text" 
                    value={round.name}
                    onChange={e => setRounds(prev => prev.map(r => r.id === round.id ? { ...r, name: e.target.value } : r))}
                    className="flex-1 bg-transparent outline-none font-bold dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent flex justify-center z-50">
        <button 
          onClick={step === 3 ? handleStartMatch : handleNext}
          className="w-full max-w-lg p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <span>{step === 3 ? "立即開始比賽" : "下一步"}</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
