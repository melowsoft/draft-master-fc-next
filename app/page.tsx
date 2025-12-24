import { CheckCircle2, Smartphone, Zap } from 'lucide-react';
import AiFeatures from '../components/AiFeatures';
import ComparisonPreview from '../components/ComparisonPreview';
import FeatureGrid from '../components/FeatureGrid';
import Hero from '../components/Hero';
import PitchPreview from '../components/PitchPreview';
import SocialViralSection from '../components/SocialViralSection';

export default function Page() {
  return (
    <>
      <Hero />

      <section id="builder" className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-green-900/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">DRAFT YOUR SQUAD</h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
              The most advanced drag-and-drop squad builder in the game. Place your players anywhere, experiment with tactics, and export your genius.
            </p>
          </div>
          <PitchPreview />
        </div>
      </section>

      <FeatureGrid />

      <section id="versus" className="py-24 bg-black border-y border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold mb-6 border border-green-500/20">
                <Zap className="w-4 h-4 mr-2" />
                VERSUS MODE
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">SETTLE THE DEBATE ONCE AND FOR ALL</h2>
              <p className="text-zinc-400 text-xl mb-8 leading-relaxed">
                Prime Neymar vs Prime Salah? Maldini vs Ramos? Compare stats across eras, leagues, and positions with verified data points.
              </p>
              <div className="space-y-4">
                {[
                  'Historical stat mapping across eras',
                  'Radar charts for tactical comparison',
                  "Shareable 'Who Wins?' poll graphics",
                  "Custom 'Prime Year' selection",
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <ComparisonPreview />
            </div>
          </div>
        </div>
      </section>

      <SocialViralSection />

      <AiFeatures />

      <section className="py-24 bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-8">READY TO DRAFT YOUR LEGACY?</h2>
          <p className="text-green-100 text-xl mb-12 max-w-2xl mx-auto">
            Join 50,000+ football tacticians building the future of the beautiful game.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-10 py-5 bg-black text-white rounded-xl font-bold text-lg hover:bg-zinc-900 transition-all flex items-center justify-center gap-3">
              <Smartphone className="w-6 h-6" />
              GET THE APP
            </button>
            <button className="px-10 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-100 transition-all">
              JOIN THE WAITLIST
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
