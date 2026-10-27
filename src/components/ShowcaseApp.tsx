"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FormationsSection from "./FormationsSection";
import MethodTimeline from "./MethodTimeline";
import WhyChooseUs from "./WhyChooseUs";
import FormatsSection from "./FormatsSection";
import FaqSection from "./FaqSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import { FormationData } from "./FormationModal";
import { FaqItemData } from "./FaqSection";

interface ShowcaseAppProps {
  formations: FormationData[];
  faqs: FaqItemData[];
  settings?: any;
}

export default function ShowcaseApp({
  formations,
  faqs,
  settings,
}: ShowcaseAppProps) {
  const [selectedFormation, setSelectedFormation] = useState<string>(
    formations[0]?.title || "Marketing digital"
  );

  const formationTitles = formations.map((f) => f.title);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FormationsSection
          formations={formations}
          onSelectFormation={(title) => setSelectedFormation(title)}
        />
        <MethodTimeline />
        <WhyChooseUs />
        <FormatsSection />
        <FaqSection faqs={faqs} />
        <ContactSection
          selectedFormation={selectedFormation}
          formationTitles={formationTitles}
          settings={settings}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
