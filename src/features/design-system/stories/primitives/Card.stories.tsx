import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Primitives/Card",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScoreCard: Story = {
  render: () => (
    <article className="ds-card w-[24rem] max-w-full space-y-4">
      <p className="ds-overline">Repository score</p>
      <p className="ds-heading-3">84 / 100</p>
      <p className="ds-body">
        High merge velocity with consistent quality checks and strong AI leverage.
      </p>
      <div className="flex gap-2">
        <span className="rounded-sm bg-soft-indigo px-2 py-1 text-xs font-semibold text-navy">
          Impact 88
        </span>
        <span className="rounded-sm bg-soft-indigo px-2 py-1 text-xs font-semibold text-navy">
          Quality 82
        </span>
      </div>
    </article>
  ),
};
