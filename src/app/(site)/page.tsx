// src/app/(site)/page.tsx

import Hero from "@/components/home/Hero";
import Collections from "@/components/home/Collections";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OurStoryPreview from "@/components/home/OurStoryPreview";
import CustomerFeedback from "@/components/home/CustomerFeedback";

export default function Home() {
  return (
    <main>
      <Hero />
      <Collections />
      <WhyChooseUs />
      <OurStoryPreview />
      <CustomerFeedback />
    </main>
  );
}
