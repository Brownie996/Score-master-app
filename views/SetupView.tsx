
import React, { useState } from 'react';
import { Competition, Team, Round } from '../types';
import { DEFAULT_COLORS } from '../constants';
// Fixed: Removed UserGroupIcon which does not exist in lucide-react and other unused icons.
import { ArrowLeft, Check, Trophy } from 'lucide-react';

interface SetupViewProps {
  onCancel: () => void;
  onStart: (match: Competition) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onCancel, onStart }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('我的超級比賽');
  const [teamCount, setTeamCount] = useState(2);
  const [roundCount, setRoundCount] = useState(3);
  const [teams, setTeams] = useState<Team[]>(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: `team-${Date.now()}-${i}`,
      name: `隊伍 ${i + 1}`,
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

  const handleTeamNameChange = (id: string, name: string) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  };

  const handleTeamColorChange = (id: string, color: string) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, color } : t));
  };

  const handleRoundNameChange = (id: string, name: string) => {
    setRounds(prev => prev.map(r => r.id === id ? { ...r, name } : r));
  };

  const updateTeamCount = (val: number) => {
    const nextVal = Math.max(1, Math.min(10, val));
    setTeamCount(nextVal);
    if (nextVal > teams.length) {
      const added = Array.from({ length: nextVal - teams.length }, (_, i) => ({
        id: `team-${Date.now()}-${teams.length + i}`,
        name: `隊伍 ${teams.length + i + 1}`,
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
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-xl font-bold">創建比賽 {step}/3</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 flex items-center"><Trophy className="w-4 h-4 mr-2" /> 比賽名稱</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none shadow-sm transition-all"
                placeholder="輸入比賽名稱..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 flex items-center">隊伍數</label>
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm">
                  <button onClick={() => updateTeamCount(teamCount - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">-</button>
                  <span className="flex-1 text-center font-bold text-lg">{teamCount}</span>
                  <button onClick={() => updateTeamCount(teamCount + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 flex items-center">局/場次數</label>
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm">
                  <button onClick={() => updateRoundCount(roundCount - 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">-</button>
                  <span className="flex-1 text-center font-bold text-lg">{roundCount}</span>
                  <button onClick={() => updateRoundCount(roundCount + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <label className="text-sm font-bold text-slate-500">隊伍設定</label>
            {teams.map((team, idx) => (
              <div key={team.id} className="flex flex-col space-y-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-8" style={{ borderLeftColor: team.color }}>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-black text-slate-300">#{idx + 1}</span>
                  <input 
                    type="text" 
                    value={team.name}
                    onChange={e => handleTeamNameChange(team.id, e.target.value)}
                    className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-bold py-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map(c => (
                    <button 
                      key={c}
                      onClick={() => handleTeamColorChange(team.id, c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${team.color === c ? "border-slate-400 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <label className="text-sm font-bold text-slate-500">場次名稱</label>
            {rounds.map((round, idx) => (
              <div key={round.id} className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                 <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center rounded-xl text-indigo-600 font-bold">
                    {idx + 1}
                 </div>
                 <input 
                  type="text" 
                  value={round.name}
                  onChange={e => handleRoundNameChange(round.id, e.target.value)}
                  className="flex-1 bg-transparent outline-none font-bold"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Persistent Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent flex justify-center z-20">
        <button 
          onClick={step === 3 ? handleStartMatch : handleNext}
          className="w-full max-w-lg p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
        >
          <span>{step === 3 ? "開始比賽" : "下一步"}</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
