
import React from 'react';
import { ChevronRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/20 blur-[150px] -z-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium mb-8 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            UK'S #1 SQUAD ARCHITECT - JOIN 50K+ GAFFERS
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
            THE ULTIMATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">FOOTBALL SQUAD BUILDER</span>
          </h1>

          <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mb-12 leading-relaxed">
            Draft your dream Starting XI, compare Premier League icons, and settle every football debate with professional-grade tactical boards.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
            <button className="group relative px-8 py-4 bg-green-500 text-black font-black text-lg rounded-xl flex items-center gap-2 hover:bg-green-400 transition-all transform hover:scale-105 active:scale-95">
              BUILD YOUR LINEUP
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-3 text-white font-bold text-lg hover:text-green-500 transition-colors">
              <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-green-500">
                <Play className="w-5 h-5 fill-current" />
              </div>
              SEE HOW IT WORKS
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 max-w-4xl w-full border-t border-zinc-900 pt-12">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black mb-1">100K+</div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">Squads Built in UK</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black mb-1">2M+</div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">Verified Opta Stats</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black mb-1">150+</div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">Daily Tactical Challenges</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
