'use client';

import React from 'react';
import { ChevronLeft, ShieldCheck, Fingerprint } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <section className="pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-green-500 font-bold mb-12 hover:text-green-400 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </button>

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
            <p>
              At DraftMaster FC, we are committed to protecting your privacy and ensuring your personal data is handled in a transparent and secure manner. This policy outlines how we collect, use, and safeguard your information in compliance with the UK General Data Protection Regulation (UK GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">02.</span> Information We Collect
            </h2>
            <p className="mb-4">
              We collect information to provide a better experience for all our "Gaffers". This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li><strong>Account Information:</strong> Name, email address, and username when you register.</li>
              <li><strong>App Data:</strong> Saved lineups, squad configurations, and draft history.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, and usage patterns.</li>
              <li><strong>Communications:</strong> Any feedback or support requests you send us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">03.</span> How We Use Your Data
            </h2>
            <p className="mb-4">
              Your data allows us to provide, maintain, and improve the DraftMaster FC experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li>To personalize your "Manager Profile" and save your custom tactics.</li>
              <li>To facilitate live snake-drafting lobbies with other users.</li>
              <li>To analyze app performance and fix "tactical" bugs.</li>
              <li>To send you updates on new features or community challenges (you can opt-out anytime).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">04.</span> Cookies and Tracking
            </h2>
            <p>
              We use essential cookies to keep you logged in and functional cookies to remember your pitch preferences. We do not use intrusive tracking cookies for third-party advertising. You can manage cookie settings through your browser at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">05.</span> Third-Party Sharing
            </h2>
            <p>
              We do not sell your personal data. We only share information with service providers (like database hosting or analytics tools) that help us run the app. Our player stats are powered by Opta; no personal user data is shared with them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">06.</span> Your Rights (UK GDPR)
            </h2>
            <p className="mb-4">
              As a UK-based user, you have specific rights regarding your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li><strong>Right to Access:</strong> Request a copy of the data we hold on you.</li>
              <li><strong>Right to Rectification:</strong> Ask us to correct inaccurate information.</li>
              <li><strong>Right to Erasure:</strong> Request that we delete your account and all associated data.</li>
              <li><strong>Right to Object:</strong> Object to our processing of your data for direct marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-green-500">07.</span> Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or your data, please contact our Data Protection Officer at: <span className="text-white font-bold">privacy@draftmasterfc.com</span>
            </p>
          </section>

          <div className="pt-12 border-t border-zinc-900">
            <div className="flex items-center gap-4 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <ShieldCheck className="text-blue-500 w-8 h-8 flex-shrink-0" />
              <p className="text-sm text-zinc-400">
                Your tactical genius is private. We use industry-standard encryption to ensure your data stays on your side of the pitch.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-8">
             <button 
              onClick={onBack}
              className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800"
            >
              CLOSE PRIVACY POLICY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPage;
