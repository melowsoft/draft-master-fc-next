
import React from 'react';
import { 
  Trophy, 
  Zap, 
  Share2, 
  Cpu, 
  BarChart3, 
  Flame
} from 'lucide-react';

const FeatureGrid: React.FC = () => {
  const features = [
    {
      title: "Era-Defying Drafts",
      desc: "Draft players from the 1950s to today. Pelé, Maradona, Messi, and Haaland on the same pitch.",
      icon: <Trophy className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Lineup Canva",
      desc: "Download high-definition squad graphics perfect for TikTok, X, and Instagram stories.",
      icon: <Share2 className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Versus Analytics",
      desc: "Compare player stats across eras using our proprietary legacy-normalization algorithm.",
      icon: <BarChart3 className="w-8 h-8 text-green-500" />
    },
    {
      title: "Snake Drafting",
      desc: "Join live lobbies with friends or randoms for timed 11-round snake drafts.",
      icon: <Zap className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Daily Challenges",
      desc: "Compete in 'Budget XI' or 'One Nation' challenges to climb the global leaderboard.",
      icon: <Flame className="w-8 h-8 text-orange-500" />
    },
    {
      title: "AI Tactical Balance",
      desc: "Our AI analyzes your lineup and suggests tactical shifts or bench options.",
      icon: <Cpu className="w-8 h-8 text-cyan-500" />
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">BUILT FOR THE MODERN FAN</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Everything you need to visualize your football takes, win every debate, and build legendary squads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-green-500/50 transition-all hover:-translate-y-2">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
