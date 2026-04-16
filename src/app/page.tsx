import type { Metadata } from "next";
import { BackToTopButton } from "@/features/landing/back-to-top-button";
import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNav } from "@/features/landing/landing-nav";
import { LandingSections } from "@/features/landing/landing-sections";

export const metadata: Metadata = {
  title: "Review Pull Requests",
  description:
    "Analyze public GitHub repositories and review pull requests with clearer engineering signals.",
};

const HomePage = () => (
  <>
    <LandingNav />
    <main id="main-content">
      <LandingHero />
      <LandingSections />
    </main>
    <BackToTopButton />
  </>
);

export default HomePage;
