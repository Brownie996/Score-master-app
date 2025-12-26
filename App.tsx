
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
    // Initial check for dark mode
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Load match from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMatch(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved match", e);
      }
    }
  }, []);

  // Sync match to storage
  useEffect(() => {
    if (match) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    }
  }, [match]);

  // Dark mode toggle effect
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
    localStorage.removeItem(STORAGE_KEY);
    setMatch(null);
    setView('HOME');
  };

  return (
    <div className="min-h-screen flex flex-col relative dark:bg-slate-900 transition-colors duration-300">
      <GeometricBackground />
      
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-50 sticky top-0 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md border-b border-white/10 dark:border-white/5">
        <h1 
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent cursor-pointer"
          onClick={() => setView('HOME')}
        >
          ScoreMaster
        </h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-white/40 dark:bg-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-700/80 transition-all active:scale-90 shadow-sm"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full z-10">
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

      {/* Footer Branding */}
      <footer className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
        &copy; 2024 VIBRANT SCORE MASTER
      </footer>
    </div>
  );
};

export default App;
