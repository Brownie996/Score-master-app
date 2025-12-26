
import React from 'react';
import { PlusCircle, PlayCircle, Trophy } from 'lucide-react';

interface HomeViewProps {
  hasActiveMatch: boolean;
  onNewMatch: () => void;
  onResume: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ hasActiveMatch, onNewMatch, onResume }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative mb-12">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center">
          <Trophy className="w-20 h-20 text-indigo-500 mb-2" />
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">Pro Scorer</span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={onNewMatch}
          className="w-full group relative flex items-center justify-between p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-lg transition-all active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="flex items-center space-x-4">
            <PlusCircle className="w-8 h-8" />
            <div className="text-left">
              <div className="text-lg font-bold">創建比賽</div>
              <div className="text-xs opacity-70">建立新的隊伍與場次</div>
            </div>
          </div>
          <div className="text-2xl font-light opacity-30">01</div>
        </button>

        <button
          onClick={onResume}
          disabled={!hasActiveMatch}
          className={`w-full group relative flex items-center justify-between p-6 rounded-3xl shadow-lg transition-all overflow-hidden ${
            hasActiveMatch 
            ? "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95" 
            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50"
          }`}
        >
          <div className="flex items-center space-x-4">
            <PlayCircle className="w-8 h-8" />
            <div className="text-left">
              <div className="text-lg font-bold">當前比賽</div>
              <div className="text-xs opacity-70">{hasActiveMatch ? "繼續剛才的計分" : "目前沒有進行中的比賽"}</div>
            </div>
          </div>
          <div className="text-2xl font-light opacity-30">02</div>
        </button>
      </div>
    </div>
  );
};
