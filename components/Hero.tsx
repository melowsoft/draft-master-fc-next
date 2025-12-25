import React from 'react';
import { ChevronRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <header 
      role="banner" 
      aria-label="Main hero section"
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/20 blur-[150px] -z-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge with semantic meaning */}
          <div 
            role="status" 
            aria-label="Achievement badge"
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium mb-8 animate-bounce"
          >
            <span 
              className="w-2 h-2 rounded-full bg-green-500 mr-2" 
              aria-hidden="true"
            ></span>
            <strong>UK'S #1 SQUAD ARCHITECT</strong> - JOIN 50K+ GAFFERS
          </div>

          {/* Main heading - Only one h1 per page */}
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
            THE ULTIMATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              FOOTBALL SQUAD BUILDER
            </span>
          </h1>

          {/* Subtitle with paragraph semantic */}
          <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mb-12 leading-relaxed">
            <strong>Draft your dream Starting XI</strong>, compare Premier League icons, 
            and settle every football debate with professional-grade tactical boards.
          </p>

          {/* Call to action buttons */}
          <nav 
            aria-label="Main actions"
            className="flex flex-col sm:flex-row items-center gap-6 mb-16"
          >
            <button 
              className="group relative px-8 py-4 bg-green-500 text-black font-black text-lg rounded-xl flex items-center gap-2 hover:bg-green-400 transition-all transform hover:scale-105 active:scale-95"
              aria-label="Build your football lineup"
            >
              BUILD YOUR LINEUP
              <ChevronRight 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                aria-hidden="true"
              />
            </button>
            <button 
              className="flex items-center gap-3 text-white font-bold text-lg hover:text-green-500 transition-colors"
              aria-label="Watch how the football squad builder works"
            >
              <div 
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-green-500"
                aria-hidden="true"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              </div>
              SEE HOW IT WORKS
            </button>
          </nav>

          {/* Social Proof Stats with semantic structure */}
          <section 
            aria-label="Platform statistics"
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 max-w-4xl w-full border-t border-zinc-900 pt-12"
          >
            <article className="flex flex-col items-center">
              <h2 className="sr-only">Squads Built Statistics</h2>
              <div className="text-4xl font-black mb-1" aria-label="100 thousand">
                100K+
              </div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">
                Squads Built in UK
              </div>
            </article>
            
            <article className="flex flex-col items-center">
              <h2 className="sr-only">Verified Statistics</h2>
              <div className="text-4xl font-black mb-1" aria-label="2 million">
                2M+
              </div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">
                Verified Opta Stats
              </div>
            </article>
            
            <article className="flex flex-col items-center">
              <h2 className="sr-only">Daily Challenges</h2>
              <div className="text-4xl font-black mb-1" aria-label="150 plus">
                150+
              </div>
              <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase text-center">
                Daily Tactical Challenges
              </div>
            </article>
          </section>
        </div>
      </div>
    </header>
  );
};

export default Hero;