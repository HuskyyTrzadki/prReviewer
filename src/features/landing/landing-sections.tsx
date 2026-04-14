import { DashboardPreviewSection } from "./sections/dashboard-preview-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { LandingFooter } from "./sections/landing-footer";
import { ScoringDimensionsSection } from "./sections/scoring-dimensions-section";
import { SocialProofSection } from "./sections/social-proof-section";

export const LandingSections = () => {
  return (
    <>
      <SocialProofSection />
      <HowItWorksSection />
      <ScoringDimensionsSection />
      <DashboardPreviewSection />
      <LandingFooter />
    </>
  );
};
