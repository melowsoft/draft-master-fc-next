import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, Fingerprint, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for DraftMaster FC.',
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return (
    <section className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-green-500 font-bold mb-12 hover:text-green-400 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <Fingerprint className="text-black w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">PRIVACY POLICY</h1>
        </div>

        <p className="text-zinc-500 mb-12 text-lg">Last updated: October 24, 2024</p>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">01.</span> Introduction
            </h2>
            <p>At DraftMaster FC, we are committed to protecting your privacy in compliance with UK GDPR.</p>
          </section>

          <div className="pt-12 border-t border-zinc-900">
            <div className="flex items-center gap-4 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <ShieldCheck className="text-blue-500 w-8 h-8 flex-shrink-0" />
              <p className="text-sm text-zinc-400">Your tactical genius is private. We use industry-standard encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
