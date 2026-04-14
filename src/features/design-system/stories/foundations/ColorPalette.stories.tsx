import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type Swatch = {
  name: string;
  className: string;
  hex: string;
  textClassName?: string;
};

const palette: Record<string, Swatch[]> = {
  Primary: [
    { name: "Navy", className: "bg-navy", hex: "#1D243A", textClassName: "text-white" },
    { name: "Navy Alt", className: "bg-navy-alt", hex: "#1D253B", textClassName: "text-white" },
  ],
  Accent: [
    { name: "Indigo Violet", className: "bg-indigo-violet", hex: "#4D42E0", textClassName: "text-white" },
    { name: "Indigo Hover", className: "bg-indigo-violet-hover", hex: "#3D34C4", textClassName: "text-white" },
    { name: "Royal Blue", className: "bg-royal-blue", hex: "#0060FA", textClassName: "text-white" },
    { name: "Amber", className: "bg-amber", hex: "#FF9500" },
  ],
  UI: [
    { name: "Dark Slate", className: "bg-dark-slate", hex: "#4B5163", textClassName: "text-white" },
    { name: "Cool Gray", className: "bg-cool-gray", hex: "#9399B4" },
    { name: "Silver", className: "bg-silver", hex: "#DCDCE6" },
    { name: "White", className: "bg-white", hex: "#FFFFFF" },
  ],
  Surfaces: [
    { name: "Ice Blue", className: "bg-ice-blue", hex: "#F3F9FB" },
    { name: "Lavender Mist", className: "bg-lavender-mist", hex: "#F9F6FE" },
    { name: "Soft Indigo", className: "bg-soft-indigo", hex: "#E6EBFE" },
  ],
  Semantic: [
    { name: "Success", className: "bg-success-green", hex: "#00B67A", textClassName: "text-white" },
    { name: "Error", className: "bg-error-red", hex: "#E53935", textClassName: "text-white" },
  ],
};

const meta = {
  title: "Design System/Foundations/Colors",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="ds-container ds-section space-y-8">
      {Object.entries(palette).map(([group, swatches]) => (
        <section key={group} className="space-y-3">
          <h2 className="ds-heading-4">{group}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {swatches.map((swatch) => (
              <div key={swatch.name} className="ds-surface overflow-hidden">
                <div className={`h-24 ${swatch.className} ${swatch.textClassName ?? "text-navy"} p-4`}>
                  <p className="text-sm font-semibold">{swatch.name}</p>
                </div>
                <div className="p-4">
                  <p className="ds-caption">{swatch.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
