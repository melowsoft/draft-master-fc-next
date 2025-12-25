
import React from 'react';
import Link from 'next/link';
import { Trophy, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
               <img src="/icon.png" alt="DraftMaster FC" className="" />
              </div>
              <Link href="/" className="text-xl font-black tracking-tighter">DRAFTMASTER <span className="text-green-500">FC</span></Link>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
              The UK's ultimate football squad architect. 
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Legal</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link href="/terms" className="hover:text-green-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-green-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs font-medium">
          <p>© 2025 DRAFTMASTER FC UK. DEVELOPED FOR THE BEAUTIFUL GAME.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
