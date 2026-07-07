export const STRINGS = {
  en:{ topDesc:"Original practice problems mapped to every section of the official EJU physics syllabus — mechanics through atomic physics.",
       attempted:"Attempted", correct:"Correct", accuracy:"Accuracy",
       back:"← Back to syllabus", mixed:"Mixed Review — pull questions from every topic",
       mixedSub:"総合演習", problems:"problems",
       qCounter:(i,n)=>`Question ${i} / ${n}`, next:"Next question →", finish:"Finish → back to syllabus",
       correctLabel:"Correct", wrongLabel:"Not quite", explanation:"Explanation:",
       modeBeginner:"Beginner", modeIntermediate:"Intermediate", modeChallenger:"Challenger", timeUp:"Time's up!",
       modeSelectLabel:"Mode Selection",
       modeBeginnerDesc:"Relaxed timers. Correct answers are always revealed.",
       modeIntermediateDesc:"Standard EJU pace. Correct answers are revealed, except during Mixed Review.",
       modeChallengerDesc:"Exam-pressure pace. Correct answers are never revealed, in any section.",
       footer:"Problems are original and written for self-study — not reproduced from any textbook or past EJU paper.\nProgress is saved to this browser only." },
  jp:{ topDesc:"JASSO発表の物理シラバスの全項目に対応したオリジナル演習問題。力学から原子まで網羅。",
       attempted:"試行数", correct:"正解数", accuracy:"正答率",
       back:"← シラバスに戻る", mixed:"総合演習 — 全分野からランダム出題",
       mixedSub:"Mixed Review", problems:"問",
       qCounter:(i,n)=>`問題 ${i} / ${n}`, next:"次の問題 →", finish:"終了 → シラバスに戻る",
       correctLabel:"正解", wrongLabel:"不正解", explanation:"解説：",
       modeBeginner:"初級", modeIntermediate:"中級", modeChallenger:"上級", timeUp:"時間切れ！",
       modeSelectLabel:"モード選択",
       modeBeginnerDesc:"ゆったりとした制限時間。正解は常に表示されます。",
       modeIntermediateDesc:"標準的なEJUのペース。総合演習を除き正解が表示されます。",
       modeChallengerDesc:"本番同様の厳しい制限時間。どのセクションでも正解は一切表示されません。",
       footer:"問題はすべてオリジナルで、自習用に作成したものです。教科書や過去のEJU問題からの転載ではありません。\n進捗はこのブラウザにのみ保存されます。" }
};

export const SYLLABUS = [
  { roman:"I", name:"Mechanics", jp:"力学", subtopics:[
      { id:"m1", name:"Motion & Force", jp:"運動と力" },
      { id:"m2", name:"Energy & Momentum", jp:"エネルギーと運動量" },
      { id:"m3", name:"Circular Motion, SHM & Gravitation", jp:"円運動・単振動・万有引力" },
  ]},
  { roman:"II", name:"Heat", jp:"熱", subtopics:[
      { id:"h1", name:"Heat & Temperature", jp:"熱と温度" },
      { id:"h2", name:"Gas Properties", jp:"気体の性質" },
  ]},
  { roman:"III", name:"Waves", jp:"波", subtopics:[
      { id:"w1", name:"Wave Properties", jp:"波の性質" },
      { id:"w2", name:"Sound", jp:"音" },
      { id:"w3", name:"Light", jp:"光" },
  ]},
  { roman:"IV", name:"Electricity & Magnetism", jp:"電気と磁気", subtopics:[
      { id:"e1", name:"Electric Field", jp:"電場" },
      { id:"e2", name:"Current", jp:"電流" },
      { id:"e3", name:"Current & Magnetic Field", jp:"電流と磁場" },
      { id:"e4", name:"EM Induction & AC", jp:"電磁誘導と電磁波" },
  ]},
  { roman:"V", name:"Atomic Physics", jp:"原子", subtopics:[
      { id:"a1", name:"Electrons & Light", jp:"電子と光" },
      { id:"a2", name:"Atoms & Nuclei", jp:"原子と原子核" },
  ]},
];

export const TIME_CONFIG = {
  beginner:     { Easy:90, Medium:135, Hard:180 },
  intermediate: { Easy:60, Medium:90,  Hard:120 },
  challenger:   { Easy:36, Medium:54,  Hard:72  }
};
