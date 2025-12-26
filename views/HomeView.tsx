
import React from 'react';
import { PlusCircle, PlayCircle, Trophy, Sparkles } from 'lucide-react';

interface HomeViewProps {
  hasActiveMatch: boolean;
  onNewMatch: () => void;
  onResume: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ hasActiveMatch, onNewMatch, onResume }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-12 animate-in fade-in duration-500">
      <div className="relative">
        <div className="relative glass-morphism p-10 rounded-[3rem] shadow-xl flex flex-col items-center border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">Pro Scorer</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <h2 className="mt-2 text-2xl font-black dark:text-white">即時計分系統</h2>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onNewMatch}
          className="w-full group relative flex items-center justify-between p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-xl shadow-indigo-500/10 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <PlusCircle className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black uppercase tracking-tight">新比賽</div>
              <div className="text-xs opacity-70 font-medium">建立隊伍與名單</div>
            </div>
          </div>
        </button>

        <button
          onClick={onResume}
          disabled={!hasActiveMatch}
          className={`w-full group relative flex items-center justify-between p-6 rounded-3xl shadow-lg transition-all ${
            hasActiveMatch 
            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white active:scale-[0.98] border border-slate-100 dark:border-slate-700" 
            : "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed opacity-50"
          }`}
        >
          <div className="flex items-center space-x-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasActiveMatch ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-slate-200 dark:bg-slate-800"}`}>
              <PlayCircle className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black uppercase tracking-tight">繼續</div>
              <div className="text-xs opacity-60 font-medium">{hasActiveMatch ? "恢復計分進度" : "目前無紀錄"}</div>
            </div>
          </div>
        </button>
      </div>
      
      {hasActiveMatch && (
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          資料已自動儲存於此瀏覽器
        </p>
      )}
    </div>
  );
};
