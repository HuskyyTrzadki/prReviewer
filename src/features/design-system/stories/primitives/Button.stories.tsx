import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Primitives/Button",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <button className="ds-button-primary" type="button">
        Analyze repository
      </button>
      <button className="ds-button-secondary" type="button">
        View sample report
      </button>
      <button className="ds-button-small" type="button">
        Small CTA
      </button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <button className="ds-button-primary" disabled type="button">
        Analyze repository
      </button>
      <button className="ds-button-secondary" disabled type="button">
        View sample report
      </button>
    </div>
  ),
};
