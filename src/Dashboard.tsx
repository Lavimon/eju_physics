import { useMemo, useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SYLLABUS, STRINGS } from './data';

interface DashboardProps {
  progress: Record<string, { attempted: number, correct: number }>;
  lang: 'en' | 'jp';
}

export default function Dashboard({ progress, lang }: DashboardProps) {
  const t = (key: keyof typeof STRINGS.en) => STRINGS[lang][key];

  const chartData = useMemo(() => {
    return SYLLABUS.map(section => {
      let sectionAttempted = 0;
      let sectionCorrect = 0;

      section.subtopics.forEach(st => {
        const p = progress[st.id];
        if (p) {
          sectionAttempted += p.attempted;
          sectionCorrect += p.correct;
        }
      });

      const accuracy = sectionAttempted > 0 ? Math.round((sectionCorrect / sectionAttempted) * 100) : 0;

      return {
        subject: lang === 'en' ? section.name : section.jp,
        A: accuracy,
        fullMark: 100,
      };
    });
  }, [progress, lang]);

  let totalAttempted = 0;
  let totalCorrect = 0;
  Object.values(progress).forEach((p: any) => { 
    totalAttempted += p.attempted; 
    totalCorrect += p.correct; 
  });
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      <div className="text-center mb-6 md:mb-8 mt-4 md:mt-0">
        <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-2 md:mb-4">{t('topDesc')}</h2>
        <p className="text-xs md:text-base text-slate-500">
          {lang === 'en' 
            ? "Select a topic from the left sidebar to begin practice, or start a Mixed Review to test all areas." 
            : "左側のサイドバーからトピックを選択して演習を始めるか、総合演習を開始して全範囲をテストしてください。"}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 w-full">
        <div className="flex justify-between items-center mb-2 md:mb-6">
          <h3 className="text-sm md:text-lg font-bold text-slate-800">
            {lang === 'en' ? 'Performance Breakdown' : '成績分析'}
          </h3>
          <div className="text-right">
            <div className="text-xl md:text-3xl font-bold text-indigo-600">{overallAccuracy}%</div>
            <div className="text-[9px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {t('accuracy')} ({totalCorrect}/{totalAttempted})
            </div>
          </div>
        </div>

        <div className="w-full h-[240px] md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "55%" : "70%"} data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: isMobile ? 10 : 12, fontWeight: 600 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={false}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md shadow-lg text-sm font-bold">
                        {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Radar
                name={lang === 'en' ? 'Accuracy' : '正答率'}
                dataKey="A"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {totalAttempted === 0 && (
          <div className="text-center mt-4 text-sm text-slate-400 italic">
            {lang === 'en' 
              ? "Complete some problems to see your weaknesses here."
              : "問題を解くと、ここに苦手分野が表示されます。"}
          </div>
        )}
      </div>
    </div>
  );
}
