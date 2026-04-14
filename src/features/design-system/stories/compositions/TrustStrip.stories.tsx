import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const publications = [
  "Bloomberg",
  "The New York Times",
  "Forbes",
  "Business Insider",
  "USA Today",
  "Inc.",
  "HuffPost",
  "CNN",
];

const meta = {
  title: "Design System/Compositions/Trust Strip",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogosRow: Story = {
  render: () => (
    <section className="ds-trust-bar">
      <div className="ds-container">
        <div className="grid gap-6 text-center text-navy sm:grid-cols-4 lg:grid-cols-9 lg:text-left">
          <p className="ds-caption lg:col-span-1 lg:self-center">As seen in</p>
          {publications.map((name) => (
            <p
              key={name}
              className="text-sm font-semibold text-navy/85 grayscale transition-opacity hover:opacity-100"
            >
              {name}
            </p>
          ))}
        </div>
      </div>
    </section>
  ),
};
