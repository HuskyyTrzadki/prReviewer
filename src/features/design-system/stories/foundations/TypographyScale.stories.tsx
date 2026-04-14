import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Foundations/Typography",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="ds-container ds-section space-y-8 bg-white">
      <section className="space-y-4">
        <p className="ds-overline">Display</p>
        <h1 className="ds-display-1">Repository reviews with confidence</h1>
        <h2 className="ds-display-2">
          Faster PR scoring for engineering teams
        </h2>
      </section>

      <section className="space-y-4">
        <p className="ds-overline">Headings</p>
        <h3 className="ds-heading-3">Three score dimensions, one clear signal</h3>
        <h4 className="ds-heading-4">Impact, AI-Leverage, and Quality</h4>
      </section>

      <section className="space-y-4">
        <p className="ds-overline">Body</p>
        <p className="ds-body-lg">
          Analyze merged pull requests and surface measurable engineering outcomes.
        </p>
        <p className="ds-body">
          The UI style intentionally stays clean and flat, with hierarchy driven by
          spacing and typography instead of heavy effects.
        </p>
        <p className="ds-body-secondary">
          Use this scale for both marketing sections and dashboard annotations.
        </p>
        <p className="ds-caption">Caption text, metadata labels, and subtle hints.</p>
      </section>
    </div>
  ),
};
