import type { Metadata } from "next";
import { LandingHero } from "@/features/landing/landing-hero";
import { LandingSections } from "@/features/landing/landing-sections";

export const metadata: Metadata = {
  title: "Review Pull Requests",
  description:
    "Analyze public GitHub repositories and review pull requests with clearer engineering signals.",
};

const HomePage = () => (
  <main id="main-content">
    <LandingHero />
    <LandingSections />
  </main>
);

export default HomePage;
