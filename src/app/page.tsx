import type { Metadata } from "next";
import { LandingHero } from "@/features/landing/landing-hero";

export const metadata: Metadata = {
  title: "Review Pull Requests",
  description:
    "Analyze public GitHub repositories and review pull requests with clearer engineering signals.",
};

const HomePage = () => (
  <main>
    <LandingHero />
  </main>
);

export default HomePage;
