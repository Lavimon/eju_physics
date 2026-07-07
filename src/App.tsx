import { useState, useEffect } from 'react';
import { STRINGS, SYLLABUS, TIME_CONFIG } from './data';
import PracticeView from './PracticeView';
import Dashboard from './Dashboard';
import { Facebook, Mail } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'en'|'jp'>('en');
  const [mode, setMode] = useState<'beginner'|'intermediate'|'challenger'>('intermediate');
  const [progress, setProgress] = useState<Record<string, {attempted:number, correct:number}>>({});
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      const pData = localStorage.getItem('eju-physics-progress');
      if (pData) setProgress(JSON.parse(pData));
      const lData = localStorage.getItem('eju-physics-lang');
      if (lData) setLang(JSON.parse(lData));
      const mData = localStorage.getItem('eju-physics-mode');
      if (mData) setMode(JSON.parse(mData));
    } catch(e) {}
  }, []);

  const handleProgressUpdate = (topicId: string, newP: any) => {
    const newProgress = { ...progress, [topicId]: newP };
    setProgress(newProgress);
    localStorage.setItem('eju-physics-progress', JSON.stringify(newProgress));
  };

  const t = (key: keyof typeof STRINGS.en, ...args: any[]) => {
    const v = STRINGS[lang][key];
    return typeof v === 'function' ? v(...args) : v;
  };

  return (
    <div className={`w-full h-[100vh] flex flex-col bg-slate-50 text-slate-900 select-none overflow-hidden ${lang === 'jp' ? 'font-eju' : 'font-sans'}`}>
      <header className="bg-white border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-6 py-3 lg:py-0 lg:h-14 shrink-0 gap-3 lg:gap-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-indigo-600 text-white font-bold px-1.5 py-0.5 md:px-2 md:py-0.5 lg:px-3 lg:py-1 rounded text-[10px] md:text-xs lg:text-sm">EJU</div>
            <h1 className="text-sm md:text-base lg:text-lg font-semibold tracking-tight text-slate-700 truncate">Physics Practice</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 lg:gap-8">
          <div className="flex flex-wrap items-center gap-2">
            <select disabled={activeSubtopic !== null} className="px-1.5 py-1 md:px-2 md:py-1.5 border border-slate-300 rounded-md text-[10px] md:text-xs lg:text-sm font-medium disabled:opacity-50" title={mode === 'beginner' ? t('modeBeginnerDesc') : mode === 'intermediate' ? t('modeIntermediateDesc') : t('modeChallengerDesc')} value={mode} onChange={e => {
              setMode(e.target.value as any);
              localStorage.setItem('eju-physics-mode', JSON.stringify(e.target.value));
            }}>
              <option value="beginner" title={t('modeBeginnerDesc')}>{t('modeBeginner')}</option>
              <option value="intermediate" title={t('modeIntermediateDesc')}>{t('modeIntermediate')}</option>
              <option value="challenger" title={t('modeChallengerDesc')}>{t('modeChallenger')}</option>
            </select>
            <div className="flex border border-slate-300 rounded-md overflow-hidden">
              <button className={`px-1.5 py-1 md:px-2 md:py-1 lg:px-3 lg:py-1.5 text-[10px] md:text-xs lg:text-sm font-medium ${lang === 'en' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`} onClick={() => { setLang('en'); localStorage.setItem('eju-physics-lang', JSON.stringify('en')); }}>EN</button>
              <button className={`px-1.5 py-1 md:px-2 md:py-1 lg:px-3 lg:py-1.5 text-[10px] md:text-xs lg:text-sm font-medium ${lang === 'jp' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}`} onClick={() => { setLang('jp'); localStorage.setItem('eju-physics-lang', JSON.stringify('jp')); }}>JP</button>
            </div>
            <button className="px-2 py-1 md:px-3 md:py-1 lg:px-4 lg:py-1.5 bg-slate-800 text-white rounded-md text-[10px] md:text-xs lg:text-sm font-medium" onClick={() => setShowResetConfirm(true)}>
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        <aside className={`w-full md:w-72 lg:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-col shrink-0 md:overflow-y-auto ${activeSubtopic ? 'hidden' : 'flex'} order-2 md:order-1`}>
          {SYLLABUS.map((section, sidx) => (
            <div key={sidx} className="p-3 md:p-4 border-b border-slate-100">
              <h3 className="text-[10px] md:text-xs font-bold uppercase text-slate-400 mb-2 md:mb-3">{section.roman}. {lang === 'en' ? section.name : section.jp}</h3>
              <div className="flex flex-col gap-1.5 md:gap-2">
                {section.subtopics.map(st => {
                  const p = progress[st.id] || { attempted: 0, correct: 0 };
                  const pct = p.attempted ? Math.round((p.correct/p.attempted)*100) : 0;
                  return (
                    <button key={st.id} onClick={() => setActiveSubtopic(st.id)} className={`p-2.5 md:p-3 bg-slate-50 border rounded-lg text-left transition-colors ${activeSubtopic === st.id ? 'border-indigo-500 shadow-sm' : 'border-slate-200 hover:border-indigo-300'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs md:text-sm font-medium text-slate-700">{lang === 'en' ? st.name : st.jp}</span>
                        <span className="text-[10px] md:text-xs font-bold text-indigo-600">{p.correct}/{p.attempted}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{width: `${pct}%`}}></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="p-3 md:p-4 mt-auto">
            <button onClick={() => setActiveSubtopic('mixed')} className="w-full py-2.5 md:py-3 bg-indigo-600 text-white text-xs md:text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700">{t('mixed')}</button>
          </div>
          <div className="hidden md:block h-14 shrink-0"></div>
          <div className="md:hidden flex flex-wrap items-center justify-center gap-3 md:gap-4 p-3 md:p-4 bg-white border-t border-slate-100 text-[10px] md:text-[11px] text-slate-500 shrink-0">
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="text-slate-400">Brought to you by</span>
              <a href="#" className="hover:text-indigo-600 font-medium transition-colors flex items-center gap-1.5">
                <Facebook className="w-3 h-3" />
                Facebook Page
              </a>
            </div>
            <a href="mailto:email@example.com" className="hover:text-indigo-600 font-medium transition-colors flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              Email
            </a>
          </div>
        </aside>

        <main className="flex-none md:flex-1 flex flex-col p-4 md:p-6 lg:p-8 md:overflow-y-auto bg-slate-50 order-1 md:order-2 md:pb-16">
          {activeSubtopic ? (
            <PracticeView 
              lang={lang} 
              mode={mode} 
              subtopicId={activeSubtopic} 
              onBack={() => setActiveSubtopic(null)}
              currentProgress={progress}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : (
            <Dashboard progress={progress} lang={lang} />
          )}
        </main>
      </div>

      <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 py-3 justify-center items-center gap-8 text-sm text-slate-500 z-40">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Brought to you by</span>
          <a href="#" className="hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            EJU Physics
          </a>
        </div>
        <a href="mailto:email@example.com" className="hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
          <Mail className="w-4 h-4" />
          lavimonyyt.2001@gmail.com
        </a>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset Progress</h3>
            <p className="text-slate-500 mb-6 text-sm">Are you sure you want to reset all your progress? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                onClick={() => {
                  setProgress({});
                  localStorage.removeItem('eju-physics-progress');
                  setShowResetConfirm(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
