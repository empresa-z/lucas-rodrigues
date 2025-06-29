import Footer from '@/components/footer';
import ContactForm from '@/components/form';
import Header from '@/components/header';
import JourneyCTA from '@/components/journey';
import SolutionSection from '@/components/painpoints';
import { PageViewTracker } from '@/components/PageViewTracker';
import React, { Suspense } from 'react';

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      <PageViewTracker pageTitle="Lucas Rodrigues - Psicólogo" />
      <main>
        <Header />
        <SolutionSection />
        <JourneyCTA />
        <Suspense>
          <ContactForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
