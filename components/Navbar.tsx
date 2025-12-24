'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Trophy } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Trophy className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">DRAFTMASTER <span className="text-green-500">FC</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#builder" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm tracking-wide">LINEUP BUILDER</Link>
            <Link href="/#versus" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm tracking-wide">VERSUS MODE</Link>
            <Link href="/#ai" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm tracking-wide">AI TACTICS</Link>
            <button className="px-6 py-2.5 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors text-sm">
              GET APP
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-900 py-8 px-4 flex flex-col gap-6 animate-in slide-in-from-top">
          <Link href="/#builder" onClick={() => setIsOpen(false)} className="text-xl font-bold">Lineup Builder</Link>
          <Link href="/#versus" onClick={() => setIsOpen(false)} className="text-xl font-bold">Versus Mode</Link>
          <Link href="/#ai" onClick={() => setIsOpen(false)} className="text-xl font-bold">AI Tactics</Link>
          <button className="w-full py-4 bg-green-500 text-black font-black rounded-xl">
            DOWNLOAD NOW
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
