import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Design System/Layout/Container Section",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rhythm: Story = {
  render: () => (
    <div>
      <section className="ds-section bg-white">
        <div className="ds-container">
          <div className="ds-surface p-6">
            <p className="ds-overline">Section 01</p>
            <h2 className="ds-display-2 mt-2">White base band</h2>
          </div>
        </div>
      </section>
      <section className="ds-section ds-section-muted">
        <div className="ds-container">
          <div className="ds-surface p-6">
            <p className="ds-overline">Section 02</p>
            <h2 className="ds-display-2 mt-2">Ice Blue alternating band</h2>
          </div>
        </div>
      </section>
      <section className="ds-section ds-section-brand">
        <div className="ds-container">
          <div className="ds-surface p-6">
            <p className="ds-overline">Section 03</p>
            <h2 className="ds-display-2 mt-2">Lavender accent band</h2>
          </div>
        </div>
      </section>
    </div>
  ),
};
