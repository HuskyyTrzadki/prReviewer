import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Primitives/Input",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[32rem] max-w-full space-y-3">
      <label className="ds-overline block">Repository URL</label>
      <input
        className="ds-input"
        defaultValue="https://github.com/vercel/next.js"
        type="url"
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-[32rem] max-w-full space-y-2">
      <label className="ds-overline block">Repository URL</label>
      <input
        aria-invalid="true"
        className="ds-input ds-input-error"
        defaultValue="github.com/repo"
        type="text"
      />
      <p className="ds-caption text-error-red">Use a full public GitHub repository URL.</p>
    </div>
  ),
};
