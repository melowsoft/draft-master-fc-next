
import React from 'react';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';

const ComparisonPreview: React.FC = () => {
  const stats = [
    { label: "Finishing", p1: 98, p2: 95 },
    { label: "Pace", p1: 89, p2: 87 },
    { label: "Dribbling", p1: 99, p2: 85 },
    { label: "Passing", p1: 96, p2: 88 },
    { label: "Longevity", p1: 100, p2: 92 },
  ];

  return (
    <div className="relative p-6 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl">
      <div className="flex justify-between items-end mb-12">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-4 border-green-500 p-1 mb-3">
            <Image src="https://picsum.photos/seed/messi/200" alt="Messi" width={200} height={200} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="font-black text-xl">MESSI</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">Peak 2012</div>
        </div>
        
        <div className="px-4 py-1 bg-zinc-900 rounded-full text-xs font-black mb-12">VS</div>

        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-4 border-zinc-700 p-1 mb-3">
            <Image src="https://picsum.photos/seed/ronaldo/200" alt="Ronaldo" width={200} height={200} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="font-black text-xl">RONALDO</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">Peak 2014</div>
        </div>
      </div>

      <div className="space-y-6">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs font-bold uppercase mb-2">
              <span className={s.p1 > s.p2 ? "text-green-500" : "text-zinc-400"}>{s.p1}</span>
              <span className="text-zinc-500 tracking-widest">{s.label}</span>
              <span className={s.p2 > s.p1 ? "text-green-500" : "text-zinc-400"}>{s.p2}</span>
            </div>
            <div className="flex h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${s.p1 > s.p2 ? 'bg-green-500' : 'bg-zinc-700'}`} 
                style={{ width: `${(s.p1 / (s.p1 + s.p2)) * 100}%` }}
              ></div>
              <div 
                className={`h-full transition-all duration-1000 ${s.p2 > s.p1 ? 'bg-green-500' : 'bg-zinc-700'}`} 
                style={{ width: `${(s.p2 / (s.p1 + s.p2)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-900 flex justify-center gap-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-sm font-bold text-zinc-300 hover:text-white transition-colors">
          <TrendingUp className="w-4 h-4 text-green-500" />
          GENERATE GRAPHIC
        </button>
      </div>
    </div>
  );
};

export default ComparisonPreview;
