import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, ScrollText, ShieldCheck } from 'lucide-react';
import StructuredData from '@/components/StructuredData'; 

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for DraftMaster FC.',
  alternates: { canonical: '/terms' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const structuredData = [
  // WebPage schema
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    description: 'Terms of service for DraftMaster FC.',
    dateModified: '2025-12-24',
    mainEntity: {
      '@type': 'CreativeWork',
      name: 'Terms of Service',
      datePublished: '2025-12-24'
    }
  },
  // Breadcrumbs schema
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://draftmasterfc.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Terms of Service',
        item: 'https://draftmasterfc.com/terms'
      }
    ]
  }
];

export default function Page() {
  return (
    <main>
       <StructuredData data={structuredData} />
    <section className="pt-32 pb-24 bg-black min-h-screen">
         <div className="container mx-auto px-4 max-w-4xl">
           <Link href="/" className="flex items-center gap-2 text-green-500 font-bold mb-12 hover:text-green-400 transition-colors group">
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             BACK TO HOME
           </Link>
   
          <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <ScrollText className="text-black w-7 h-7" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">TERMS OF SERVICE</h1>
            <p className="text-zinc-500 mt-2 text-sm sr-only">
              Terms and conditions for using DraftMaster FC - Last updated: December 24, 2025
            </p>
          </div>
        </div>
           
           <p className="text-zinc-500 mb-12 text-lg">Last updated: December 24, 2025</p>
   
           <div className="space-y-12 text-zinc-300 leading-relaxed">
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">01.</span> Acceptance of Terms
               </h2>
               <p>
                 By accessing or using DraftMaster FC ("the App"), you agree to be bound by these Terms of Service and all applicable laws and regulations in the United Kingdom. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
               </p>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">02.</span> Use License
               </h2>
               <p className="mb-4">
                 Permission is granted to temporarily download one copy of the materials (information or software) on DraftMaster FC's website for personal, non-commercial transitory viewing only.
               </p>
               <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                 <li>Modify or copy the tactical board templates for commercial resale.</li>
                 <li>Use the materials for any commercial purpose without explicit written consent.</li>
                 <li>Attempt to decompile or reverse engineer any software contained on the platform.</li>
                 <li>Remove any copyright or other proprietary notations from the materials.</li>
               </ul>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">03.</span> User Generated Content
               </h2>
               <p>
                 When you create lineups, squads, or custom player comparisons ("Content"), you grant DraftMaster FC a non-exclusive, royalty-free, worldwide license to use, display, and distribute this content for marketing and community engagement purposes. You represent that you own all rights to the takes and tactical configurations you submit.
               </p>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">04.</span> Account Security
               </h2>
               <p>
                 "Gaffers" (users) are responsible for maintaining the confidentiality of their account and password. DraftMaster FC cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
               </p>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">05.</span> Fair Play & Drafting Rules
               </h2>
               <p>
                 Users must not engage in any activity that disrupts the drafting lobbies or snake-draft mechanics. Use of automated scripts or "bots" to secure high-rating players is strictly prohibited and will result in an immediate permanent ban from the platform.
               </p>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">06.</span> Accuracy of Data
               </h2>
               <p>
                 While we strive to provide the most accurate Opta and historical statistics, DraftMaster FC does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the player database at any time without notice.
               </p>
             </section>
   
             <section>
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-green-500">07.</span> Governing Law
               </h2>
               <p>
                 These terms and conditions are governed by and construed in accordance with the laws of England and Wales and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
               </p>
             </section>
   
             <div className="pt-12 border-t border-zinc-900">
               <div className="flex items-center gap-4 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                 <ShieldCheck className="text-green-500 w-8 h-8 flex-shrink-0" />
                 <p className="text-sm text-zinc-400">
                   We take your privacy seriously. By using DraftMaster FC, you also agree to our <Link href="/privacy" className="text-white font-bold cursor-pointer hover:underline">Privacy Policy</Link>.
                 </p>
               </div>
             </div>
             
            <div className="flex justify-center pt-8">
              <Link 
                href="/"
                className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800 inline-block"
              >
                I UNDERSTAND, TAKE ME BACK
              </Link>
            </div>
           </div>
         </div>
      </section>
      </main>
  );
}
