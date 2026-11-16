"use client";

import PageWrapper from "./components/PageWrapper";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import WhyChooseUs from "./components/WhyChooseUs";
import CaseHighlights from "./components/CaseHighlights";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <Hero />

      {/* Why Us — animated orbital layout with city background */}
      <WhyUs />

      {/* Why Choose Us Trust cards with count stats */}
      <WhyChooseUs />

      {/* Masonry case results highlights */}
      <CaseHighlights />

      {/* Carousel fader for client quotes */}
      <Testimonials />
    </PageWrapper>
  );
}
