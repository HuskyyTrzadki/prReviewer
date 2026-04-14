import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Compositions/Hero",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PassportInspired: Story = {
  render: () => (
    <section className="ds-section ds-section-muted overflow-hidden">
      <div className="ds-container grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="ds-display-1 max-w-[16ch]">Score Pull Requests With Confidence</h1>
          <p className="ds-body-lg max-w-[44ch]">
            Analyze merged PRs with AI and get actionable repository quality signals
            across impact, leverage, and engineering standards.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="ds-button-primary" type="button">
              Analyze repository
            </button>
            <button className="ds-button-secondary" type="button">
              See sample report
            </button>
          </div>
          <p className="ds-caption">
            Trusted by engineering leads evaluating team-level delivery quality.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem]">
          <div className="absolute -right-8 -top-6 h-32 w-32 rounded-md border border-silver bg-white p-2">
            <div className="h-full w-full rounded-sm bg-soft-indigo" />
          </div>
          <div className="relative rounded-md border border-silver bg-white p-3">
            <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-soft-indigo to-ice-blue" />
          </div>
          <div className="absolute -bottom-8 -left-8 rounded-full bg-success-green px-4 py-2 text-sm font-semibold text-white">
            +31 PRs analyzed
          </div>
        </div>
      </div>
    </section>
  ),
};
