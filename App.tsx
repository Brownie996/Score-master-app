
import React, { useState, useEffect } from 'react';
import { View, Competition } from './types';
import { HomeView } from './views/HomeView';
import { SetupView } from './views/SetupView';
import { ScoringView } from './views/ScoringView';
import { SummaryView } from './views/SummaryView';
import { GeometricBackground } from './components/GeometricBackground';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'vibrant_score_master_match';

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [match, setMatch] = useState<Competition | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Load saved match on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedMatch = JSON.parse(saved);
        setMatch(parsedMatch);
      } catch (e) {
        console.error("Failed to parse saved match", e);
      }
    }
  }, []);

  // Persist match whenever it updates
  useEffect(() => {
    if (match) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    }
  }, [match]);

  // Handle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const startNewMatch = (newMatch: Competition) => {
    setMatch(newMatch);
    setView('SCORING');
  };

  const updateMatch = (updated: Competition) => {
    setMatch(updated);
  };

  const finishMatch = () => {
    if (match) {
      const finished = { ...match, isFinished: true };
      setMatch(finished);
      setView('SUMMARY');
    }
  };

  const resetMatch = () => {
    const confirmReset = window.confirm('確定要結束當前比賽並清空所有紀錄嗎？此動作無法復原。');
    if (confirmReset) {
      localStorage.removeItem(STORAGE_KEY);
      setMatch(null);
      setView('HOME');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">
      <GeometricBackground />
      
      {/* 降低 z-index 以免遮擋 Timer (Timer 將設為 z-50+) */}
      <header className="px-6 py-4 flex justify-between items-center z-30 sticky top-0 glass-morphism shadow-sm">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setView('HOME')}
        >
          <div className="w-8 h-8 bg-[#0AFFD6] rounded-lg flex items-center justify-center text-slate-900 font-black transform transition-transform shadow-lg shadow-[#0AFFD6]/20">S</div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            ScoreMaster
          </h1>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[#0AFFD6]" />}
        </button>
      </header>

      <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-lg md:max-w-4xl mx-auto w-full z-10">
        {view === 'HOME' && (
          <HomeView 
            hasActiveMatch={!!match} 
            onNewMatch={() => setView('SETUP')} 
            onResume={() => {
                if (match?.isFinished) setView('SUMMARY');
                else setView('SCORING');
            }} 
          />
        )}
        
        {view === 'SETUP' && (
          <SetupView onCancel={() => setView('HOME')} onStart={startNewMatch} />
        )}

        {view === 'SCORING' && match && (
          <ScoringView 
            match={match} 
            onUpdate={updateMatch} 
            onFinish={finishMatch} 
          />
        )}

        {view === 'SUMMARY' && match && (
          <SummaryView 
            match={match} 
            onRestart={resetMatch}
            onGoHome={() => setView('HOME')}
          />
        )}
      </main>

      <div className="pb-10"></div>
    </div>
  );
};

export default App;
