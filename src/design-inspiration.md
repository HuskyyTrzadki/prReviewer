# Design System Inspired by Passport Photo Online

## 1. Visual Direction

The system should feel trustworthy, calm, efficient, and premium. The visual language combines editorial serif headlines with clean sans-serif UI, creating a balance between institutional credibility and modern SaaS clarity. The palette is built around deep navy text, indigo-violet CTAs, and very light cool backgrounds. The interface should feel light, spacious, and flat, with minimal decoration and strong emphasis on readability, whitespace, and confidence.

### Core characteristics
- Deep navy text with indigo-violet CTAs
- Cool near-white backgrounds with subtle section alternation
- PT Serif for display headings, Inter for all body/UI text
- Generous whitespace and low visual noise
- Flat design with almost no shadows
- Consistent `8px` radius for most rectangular components
- Strong hierarchy through typography, spacing, and section rhythm

---

## 2. Color Palette

### Primary
- **Navy:** `#1D243A` — default text, headings, nav, core copy
- **Navy Alt:** `#1D253B` — can be treated as equivalent to Navy

### Accent
- **Indigo Violet:** `#4D42E0` — primary CTA, interactive highlights
- **Indigo Violet Hover:** `#3D34C4`
- **Royal Blue:** `#0060FA` — secondary interactive accent if needed
- **Amber:** `#FF9500` — attention highlights, stars, timers

### Neutral / UI
- **Dark Slate:** `#4B5163` — secondary text
- **Cool Gray:** `#9399B4` — tertiary text, placeholders, disabled states
- **White:** `#FFFFFF` — main surface
- **Silver:** `#DCDCE6` — borders, dividers, inputs

### Background surfaces
- **Ice Blue:** `#F3F9FB` — hero / alternating sections
- **Lavender Mist:** `#F9F6FE` — subtle branded section background
- **Soft Indigo:** `#E6EBFE` — light accent background

### Semantic
- **Success Green:** `#00B67A`
- **Error Red:** `#E53935`

---

## 3. Typography

### Font families
- **Display / headings:** `'PT Serif', Georgia, 'Times New Roman', serif`
- **Body / UI:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

### Type scale
- **H1:** PT Serif, `72px`, `700`, `80px`, slight negative tracking
- **H2:** PT Serif, `40px`, `700`, `46px`
- **H3:** Inter, `32px`, `600`, `38px`
- **H4:** Inter, `18px`, `600`, `25px`
- **Body Large:** Inter, `24px`, `500`, `30px`
- **Body:** Inter, `16px`, `500`, `22px`
- **Body Secondary:** Inter, `16px`, `400`
- **Button Large:** Inter, `16px`, `500`
- **Button Small:** Inter, `14px`, `500`
- **Caption:** Inter, `14px`, `400`
- **Overline:** Inter, `12px`, `600`

### Typography rules
- Use **PT Serif only for H1 and H2**
- Use **Inter everywhere else**
- Body text should not go below `16px`
- Hierarchy should be obvious, with large jumps between heading levels
- Serif headings can use italic selectively for editorial emphasis

---

## 4. Core Components

### Primary Button
- Background: `#4D42E0`
- Text: `#FFFFFF`
- Font: Inter `16px` / `500`
- Padding: `10px 24px`
- Radius: `8px`
- No shadow
- Hover: `#3D34C4`
- Active: slightly darker + subtle scale down

### Small CTA Button
- Same as primary, but `14px` and `8px 20px`

### Secondary Button
- Transparent background
- Navy text
- `1px solid #DCDCE6`
- Radius `8px`
- Hover background: `#F3F9FB`

### Text Input
- Background: `#FFFFFF`
- Text: `#1D243A`
- Placeholder: `#9399B4`
- Border: `1px solid #DCDCE6`
- Padding: `12px 16px`
- Radius: `8px`
- Focus border: `#4D42E0`
- Focus ring allowed, but subtle
- Error border: `#E53935`

### Feature / Content Card
- Background: `#FFFFFF`
- Padding: `32px`
- Radius: `8px`
- No shadow by default
- Heading: Inter `32px` / `600`
- Description: Inter `16px` / `400`, Dark Slate

### Navigation
- White background
- Height: `72px`
- Bottom border: `1px solid #DCDCE6`
- Links: Inter `16px` / `500`, Navy
- Hover: Indigo Violet
- One visible primary CTA button on the right

### Trust / Logo Bar
- White background
- Vertical padding: `32px`
- Top and bottom border: `1px solid #DCDCE6`
- Muted label text
- Logos evenly spaced, grayscale if needed

---

## 5. Layout Rules

### Spacing scale
Use a strict `4px` base grid.

Preferred values:
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `40px`
- `48px`
- `64px`

### Containers and sections
- Max container width: `1280px`
- Horizontal padding:
    - desktop: `40px`
    - tablet: `24px`
    - mobile: `16px`

### Section rhythm
Use full-width section bands with centered content containers.

Preferred pattern:
- `#FFFFFF`
- `#F3F9FB`
- `#FFFFFF`
- `#F9F6FE`

Desktop vertical section padding: `64px`

### Border radius scale
- `0px` — links / ghost elements
- `4px` — small badges
- `8px` — buttons, cards, inputs, containers
- `50%` — circular elements only

---

## 6. Depth and Shadows

The design is mostly flat.

### Default rule
- Buttons, cards, inputs, nav: **no shadow**

### Use shadows only when necessary
- Small floating elements: `0 1px 3px rgba(29, 36, 58, 0.08)`
- Floating buttons / overlays: `0 2px 8px rgba(29, 36, 58, 0.16)`
- Modals / larger overlays: `0 4px 16px rgba(29, 36, 58, 0.20)`

Prefer hierarchy through:
- background contrast
- spacing
- typography

Not through heavy elevation.

---

## 7. Responsive Behavior

### Breakpoints
- **Mobile:** `< 640px`
- **Tablet:** `640px – 1023px`
- **Desktop:** `1024px+`

### Responsive rules
- Hero stacks vertically on mobile
- H1 scales from `72px` → `56px` → `40px`
- H2 scales from `40px` → `32px` → `28px`
- Body Large scales from `24px` → `20px` → `18px`
- Section padding reduces from `64px` → `48px` → `32px`
- Feature grid collapses from 3 columns → 2 → 1
- Mobile tap targets should be at least `44px`

---

## 8. Do / Don’t

### Do
- Use PT Serif only for high-level display headings
- Keep CTAs in Indigo Violet
- Use Navy as the default text color
- Keep components flat and clean
- Preserve generous whitespace
- Alternate section backgrounds for rhythm
- Use `8px` radius consistently
- Keep navigation minimal and structured
- Show trust elements near main CTAs

### Don’t
- Don’t use serif for body/UI text
- Don’t introduce extra accent colors
- Don’t add gradients or heavy shadows
- Don’t use pure black for regular body copy
- Don’t shrink text below `16px` for readable content
- Don’t break the spacing scale
- Don’t use arbitrary border radii
- Don’t create dark sections; the system should stay light and airy

---

## 9. Agent Instructions

Recreate the visual language of passport-photo.online as closely as practical, but adapt the content to a PR review / AI repository analysis product.

Priority order:
1. Match typography, colors, spacing, and section rhythm
2. Build a minimal reusable UI system from these tokens
3. Keep the result clean, light, flat, and high-trust
4. Do not invent additional colors, shadows, or decorative patterns
5. Reuse the same design language across both landing page and dashboard