import { useState, useEffect, useMemo, useRef } from 'react';
import { STRINGS, TIME_CONFIG } from './data';
import { PROBLEMS, DIAGRAMS } from './problems';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PracticeView({ lang, mode, subtopicId, onBack, onProgressUpdate, currentProgress }) {
  const [qIndex, setQIndex] = useState(0);
  
  // Initialize questions using useMemo so it only shuffles once per session
  const questions = useMemo(() => {
    let list: any[] = [];
    if (subtopicId === 'mixed') {
      Object.keys(PROBLEMS).forEach(k => {
        list = list.concat(PROBLEMS[k].map(p => ({ ...p, subtopicId: k })));
      });
      list = shuffleArray(list).slice(0, 20); // Random 20 for mixed
    } else {
      list = (PROBLEMS[subtopicId] || []).map(p => ({ ...p, subtopicId }));
    }
    
    // Shuffle choices for each question
    return list.map(q => {
      const choiceIndices = shuffleArray([0, 1, 2, 3]);
      return {
        ...q,
        shuffledIndices: choiceIndices,
        answerIndex: choiceIndices.indexOf(q.answer)
      };
    });
  }, [subtopicId]);

  const currentQ = questions[qIndex];

  // Initialize timeLeft based on the first question to avoid the 0-start bug
  const initialTime = currentQ ? ((TIME_CONFIG as any)[mode][currentQ.diff] || 90) : 90;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const t = (key: any, ...args: any[]) => {
    const v = STRINGS[lang as 'en'|'jp'][key];
    return typeof v === 'function' ? v(...args) : v;
  };

  useEffect(() => {
    if (!currentQ) return;
    const time = (TIME_CONFIG as any)[mode][currentQ.diff] || 90;
    setTimeLeft(time);
    setSelectedChoice(null);
    setIsTimeUp(false);
    setIsInitialized(true);
  }, [currentQ, mode]);

  useEffect(() => {
    if (!isInitialized || selectedChoice !== null || isTimeUp) return;
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      handleAnswer(-1, true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(l => l - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selectedChoice, isTimeUp, isInitialized]);

  if (!currentQ) return <div>No problems available</div>;

  const handleAnswer = (choiceIdx: number, timeout = false) => {
    if (selectedChoice !== null || isTimeUp) return;
    setSelectedChoice(choiceIdx);
    
    const isCorrect = choiceIdx === currentQ.answerIndex;
    
    const p = currentProgress[currentQ.subtopicId] || { attempted: 0, correct: 0 };
    onProgressUpdate(currentQ.subtopicId, {
      attempted: p.attempted + 1,
      correct: p.correct + (isCorrect ? 1 : 0)
    });
  };

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const isCorrect = selectedChoice === currentQ.answerIndex;
  const hideAnswer = (mode === 'challenger') || (mode === 'intermediate' && subtopicId === 'mixed');

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 md:mb-6">
        <div className="w-full">
          <span className="text-indigo-600 font-bold text-[10px] md:text-xs lg:text-sm uppercase tracking-wider">Question {qIndex + 1} / {questions.length}</span>
          <h2 className="text-base md:text-xl font-medium text-slate-800 mt-1 leading-relaxed whitespace-pre-line">
            {currentQ.q[lang]}
          </h2>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 md:px-4 border border-slate-300 rounded-md text-[10px] md:text-sm font-medium hover:bg-slate-50 bg-white shadow-sm shrink-0 w-full sm:w-auto">
          {t('back')}
        </button>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm gap-2">
        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 md:px-3 rounded tracking-wider uppercase text-[9px] md:text-xs">{currentQ.diff}</span>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[9px] md:text-xs uppercase font-bold tracking-wider text-slate-500">Time Remaining</span>
          <span className={`font-mono text-base md:text-xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-slate-700'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {currentQ.diagram && DIAGRAMS[currentQ.diagram] && (
        <div className="w-full max-w-sm mx-auto h-40 md:h-56 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm relative mb-4 md:mb-6 p-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
             dangerouslySetInnerHTML={{ __html: DIAGRAMS[currentQ.diagram] }} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 flex-1 mb-6">
        {currentQ.shuffledIndices.map((originalIdx: number, currentIdx: number) => {
          const c = currentQ.choices[lang][originalIdx];
          let btnClass = "flex items-center p-3 md:p-4 bg-white border-2 border-slate-100 rounded-lg hover:border-indigo-300 transition-colors text-left";
          if (selectedChoice !== null || isTimeUp) {
            btnClass = "flex items-center p-3 md:p-4 bg-white border-2 border-slate-100 rounded-lg text-left opacity-50";
            if (currentIdx === currentQ.answerIndex && (!hideAnswer || isCorrect)) {
              btnClass = "flex items-center p-3 md:p-4 bg-white border-2 border-indigo-500 rounded-lg shadow-md text-left";
            } else if (currentIdx === selectedChoice) {
              btnClass = "flex items-center p-3 md:p-4 bg-red-50 border-2 border-red-300 rounded-lg text-left";
            }
          }

          return (
            <button key={currentIdx} disabled={selectedChoice !== null || isTimeUp} onClick={() => handleAnswer(currentIdx)} className={btnClass}>
              <span className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold mr-3 md:mr-4 shrink-0 text-xs md:text-base 
                ${(selectedChoice !== null || isTimeUp) && currentIdx === currentQ.answerIndex && (!hideAnswer || isCorrect) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {String.fromCharCode(65 + currentIdx)}
              </span>
              <span className="text-slate-800 text-xs md:text-base">{c}</span>
            </button>
          );
        })}
      </div>

      {(selectedChoice !== null || isTimeUp) && (
        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h3 className={`text-sm md:text-lg font-bold mb-1 md:mb-2 ${isCorrect ? 'text-indigo-600' : 'text-slate-600'}`}>
              {isCorrect ? t('correctLabel') : (isTimeUp ? t('timeUp') : t('wrongLabel'))}
            </h3>
            {(!hideAnswer || isCorrect) && (
              <p className="text-slate-600 text-xs md:text-base"><b>{t('explanation')}</b> {currentQ.exp[lang]}</p>
            )}
          </div>
          <button 
            onClick={() => {
              if (qIndex + 1 < questions.length) setQIndex(i => i + 1);
              else onBack();
            }}
            className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 md:px-12 py-2.5 md:py-3 rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors shrink-0 text-xs md:text-base">
            {qIndex + 1 < questions.length ? t('next') : t('finish')}
          </button>
        </div>
      )}
    </div>
  );
}
