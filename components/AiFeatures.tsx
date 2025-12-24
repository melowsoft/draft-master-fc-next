
import React from 'react';
import { Cpu, Brain, Sparkles } from 'lucide-react';

const AiFeatures: React.FC = () => {
  return (
    <section id="ai" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600/5 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            Next Generation
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">THE BRAIN BEHIND THE BOOT</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Our AI model doesn't just store data; it understands the beautiful game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
              <Brain className="text-black w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase">Tactical Auto-Fill</h3>
            <p className="text-zinc-400 leading-relaxed">
              "Build the best U23 Premier League lineup for under £100M." 
              Our AI processes current valuations and potential ratings to give you the perfect squad in seconds.
            </p>
          </div>

          <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Cpu className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase">Fantasy Duel Sim</h3>
            <p className="text-zinc-400 leading-relaxed">
              Wondering if the '09 Barca could beat the '14 Real Madrid? 
              Simulate 10,000 matches based on prime historical stats and tactical shapes.
            </p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-center">
            <div className="p-8 max-w-2xl w-full card-glass rounded-3xl text-center border-green-500/20">
                <p className="text-zinc-300 italic mb-4">"DraftMaster's AI suggested I swap Zidane for Modric to balance my 3-man midfield. My chemistry rating jumped 12 points. Genius."</p>
                <div className="font-bold text-green-500">@TacticsGeek_99</div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
