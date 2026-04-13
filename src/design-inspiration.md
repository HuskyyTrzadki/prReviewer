# Design System Inspired by Passport Photo Online

## 1. Visual Theme & Atmosphere

This design system embodies professional trustworthiness with a clean, modern SaaS aesthetic. The visual personality blends authoritative serif typography for headlines with a crisp sans-serif body font, creating a sense of institutional credibility balanced by approachable digital polish. The palette centers on deep navy text and vibrant indigo-violet CTAs set against cool, icy blue-white backgrounds — evoking the formality of government documents while maintaining the friendliness of a consumer-facing technology product. The overall atmosphere is calm, confidence-inspiring, and efficiency-focused, reflecting the brand's promise of speed (30 seconds), AI precision, and guaranteed compliance. Generous whitespace, subtle surface color shifts, and minimal ornamentation keep the interface feeling light and uncluttered, reinforcing that the product removes complexity rather than adding it.

**Key Characteristics**
- Deep navy and indigo-violet as dominant brand colors, projecting trust and authority
- Cool-toned, near-white backgrounds that feel clinical yet inviting
- Serif display headings (PT Serif) paired with geometric sans-serif body text (Inter) for a professional-yet-modern dual-font system
- Generous whitespace and minimal visual noise — content breathes
- Flat design with almost no shadows, relying on color shifts and spacing for hierarchy
- Rounded but restrained border radii (`8px`) — approachable without being playful
- Strong CTA presence with saturated violet-indigo buttons that pop against light surfaces
- Editorial-quality typography hierarchy with distinct weight and size jumps

## 2. Color Palette & Roles

### Primary
- **Navy** (`#1D243A`): Primary text color, headings, navigation items, and all core body copy. The anchor of the entire palette.
- **Navy Alt** (`#1D253B`): Near-identical variant used for specific dark contexts; treat as interchangeable with Navy.

### Accent Colors
- **Indigo Violet** (`#4D42E0`): Primary brand accent and CTA color. Used for buttons, interactive highlights, and branded elements.
- **Royal Blue** (`#0060FA`): Secondary accent for links in content, informational badges, and interactive affordances.
- **Amber** (`#FF9500`): Warm accent for attention-drawing elements — star ratings, badges, countdown timers, and decorative sparkle icons.

### Interactive
- **Link Blue** (`#0000EE`): Default hyperlink color following browser convention. Used for inline text links and underlined references.
- **Indigo Violet** (`#4D42E0`): Button backgrounds and primary interactive states.
- **Indigo Violet Hover** (`#3D34C4`): Inferred darker hover state for primary buttons.
- **Royal Blue Hover** (`#004FD4`): Inferred hover state for secondary blue interactive elements.

### Neutral Scale
- **Black** (`#000000`): Used sparingly for icon buttons, close icons, and maximum-contrast small text.
- **Dark Slate** (`#4B5163`): Secondary body text, descriptions, and supporting copy.
- **Cool Gray** (`#9399B4`): Tertiary text, placeholders, meta information, and disabled states.
- **White** (`#FFFFFF`): Primary surface color for cards, navigation bars, and page backgrounds.

### Surface & Borders
- **Ice Blue** (`#F3F9FB`): Hero section background, alternating content sections, and light surface areas.
- **Lavender Mist** (`#F9F6FE`): Subtle purple-tinted surface for feature highlights and branded sections.
- **Soft Indigo** (`#E6EBFE`): Light accent surface for badges, tags, and hover states on light backgrounds.
- **Silver** (`#DCDCE6`): Border color for dividers, input fields, table rules, and horizontal separators.

### Semantic / Status
- **Success Green** (`#00B67A`): Trustpilot-style success indicators, verification checkmarks, and compliance badges (inferred from Trustpilot integration).
- **Amber** (`#FF9500`): Warnings, timer indicators, and attention-drawing notifications.
- **Error Red** (`#E53935`): Form validation errors, rejection indicators, and destructive action alerts (inferred).

## 3. Typography Rules

### Font Family
- **Primary (Display/Headings):** `'PT Serif', Georgia, 'Times New Roman', serif`
- **Secondary (Body/UI):** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | PT Serif | `72px` | `700` | `80px` | `-0.5px` | Hero headlines, page titles. Italic style used for editorial emphasis. |
| H2 | PT Serif | `40px` | `700` | `46px` | `-0.3px` | Section headings, major content dividers. Often italic. |
| H3 | Inter | `32px` | `600` | `38px` | `-0.2px` | Subsection titles, feature headings, card titles. |
| H4 | Inter | `18px` | `600` | `25.2px` | `0px` | Component headings, list titles, small section labels. |
| Body Large | Inter | `24px` | `500` | `30px` | `0px` | Hero subtitles, lead paragraphs, prominent descriptions. |
| Body | Inter | `16px` | `500` | `22px` | `0px` | Standard paragraph text, navigation items, card descriptions. |
| Body Regular | Inter | `16px` | `400` | `18.4px` | `0px` | Links, secondary body text, lighter-weight paragraphs. |
| Button Large | Inter | `16px` | `500` | `20px` | `0px` | Hero CTA buttons, primary action buttons. |
| Button Small | Inter | `14px` | `500` | `24px` | `0px` | Navigation CTA, secondary and compact buttons. |
| Caption | Inter | `14px` | `400` | `20px` | `0px` | Footnotes, legal text, trust badges, meta information. |
| Overline | Inter | `12px` | `600` | `16px` | `0.5px` | Labels, category tags, uppercase section markers. |
| Code | `'SF Mono', 'Fira Code', 'Fira Mono', monospace` | `14px` | `400` | `20px` | `0px` | Inline code references if needed. |

### Principles
- **Dual-font personality:** Serif headlines convey authority and editorial weight; sans-serif body text provides digital clarity and readability
- **Weight restraint:** Headlines use bold (`700`), subheadings use semi-bold (`600`), and body text uses medium (`500`) or regular (`400`) — no ultra-bold or thin weights
- **Generous line heights:** All text has comfortable leading (1.1× to 1.4× of font size) ensuring readability in content-heavy pages
- **Size jumps are significant:** The scale leaps from `72px` → `40px` → `32px` → `24px` → `18px` → `16px` → `14px`, creating unmistakable hierarchy
- **Italic usage on display type:** PT Serif italic is used for hero headings to add editorial sophistication

## 4. Component Stylings

### Buttons

**Primary Button (Large / Hero CTA)**
- `background-color`: `#4D42E0`
- `color`: `#FFFFFF`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `16px`
- `font-weight`: `500`
- `line-height`: `20px`
- `padding`: `10px 24px`
- `border-radius`: `8px`
- `border`: `none`
- `box-shadow`: `none`
- `cursor`: `pointer`
- `transition`: `background-color 0.2s ease, transform 0.1s ease`
- **Hover:** `background-color: #3D34C4`
- **Active:** `background-color: #3229A8; transform: scale(0.98)`
- **Focus:** `outline: 2px solid #4D42E0; outline-offset: 2px`

**Primary Button (Small / Navigation CTA)**
- `background-color`: `#4D42E0`
- `color`: `#FFFFFF`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `14px`
- `font-weight`: `500`
- `line-height`: `24px`
- `padding`: `8px 20px`
- `border-radius`: `8px`
- `border`: `none`
- `box-shadow`: `none`
- **Hover:** `background-color: #3D34C4`

**Secondary Button**
- `background-color`: `transparent`
- `color`: `#1D243A`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `16px`
- `font-weight`: `500`
- `line-height`: `20px`
- `padding`: `10px 24px`
- `border-radius`: `8px`
- `border`: `1px solid #DCDCE6`
- `box-shadow`: `none`
- **Hover:** `background-color: #F3F9FB; border-color: #9399B4`
- **Active:** `background-color: #E6EBFE`

**Ghost Button / Icon Button**
- `background-color`: `transparent`
- `color`: `#000000`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `padding`: `0px`
- `border-radius`: `0px`
- `border`: `none`
- `height`: `24px`
- `width`: `24px`
- **Hover:** `color: #4D42E0; opacity: 0.8`

### Cards & Containers

**Feature Card (How It Works Steps)**
- `background-color`: `#FFFFFF`
- `padding`: `32px`
- `border-radius`: `8px`
- `border`: `none`
- `box-shadow`: `none`
- **Icon area:** `margin-bottom: 24px`
- **Heading:** `font-size: 32px; font-weight: 600; color: #1D243A; font-family: 'Inter', sans-serif; margin-bottom: 16px`
- **Description:** `font-size: 16px; font-weight: 400; color: #4B5163; line-height: 24px`

**Content Section (Alternating Background)**
- **Light variant:** `background-color: #F3F9FB; padding: 64px 0`
- **White variant:** `background-color: #FFFFFF; padding: 64px 0`
- **Lavender variant:** `background-color: #F9F6FE; padding: 64px 0`

**Trust Bar / Logo Strip**
- `background-color`: `#FFFFFF`
- `padding`: `32px 0`
- `border-top`: `1px solid #DCDCE6`
- `border-bottom`: `1px solid #DCDCE6`
- **Label text:** `font-size: 14px; font-weight: 400; color: #9399B4`
- **Logo display:** grayscale filter, evenly distributed with `gap: 48px`

### Inputs & Forms

**Text Input**
- `background-color`: `#FFFFFF`
- `color`: `#1D243A`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `22px`
- `padding`: `12px 16px`
- `border-radius`: `8px`
- `border`: `1px solid #DCDCE6`
- `box-shadow`: `none`
- `transition`: `border-color 0.2s ease`
- **Placeholder:** `color: #9399B4`
- **Focus:** `border-color: #4D42E0; outline: none; box-shadow: 0 0 0 3px rgba(77, 66, 224, 0.12)`
- **Error:** `border-color: #E53935`

**Select / Dropdown**
- Same base styles as Text Input
- **Chevron icon:** `color: #9399B4; right: 16px`

### Navigation

**Top Navigation Bar**
- `background-color`: `#FFFFFF`
- `padding`: `0 40px`
- `height`: `72px`
- `border-bottom`: `1px solid #DCDCE6`
- `display`: `flex; align-items: center; justify-content: space-between`

**Nav Link**
- `color`: `#1D243A`
- `font-family`: `'Inter', sans-serif`
- `font-size`: `16px`
- `font-weight`: `500`
- `line-height`: `22px`
- `padding`: `12px 16px`
- `text-decoration`: `none`
- **Hover:** `color: #4D42E0`
- **Dropdown chevron:** `margin-left: 4px; color: #9399B4`

**Nav Dropdown Item**
- `padding`: `12px 16px`
- `font-size`: `16px`
- `font-weight`: `400`
- `color`: `#4B5163`
- **Hover:** `background-color: #F3F9FB; color: #1D243A`

### Badges & Tags

**Trust Badge (Trustpilot-style)**
- `background-color`: `#00B67A`
- `color`: `#FFFFFF`
- `font-size`: `14px`
- `font-weight`: `600`
- `padding`: `4px 8px`
- `border-radius`: `4px`
- Displayed inline with star icons

**Timer Badge (3s Indicator)**
- `background-color`: `#00B67A`
- `color`: `#FFFFFF`
- `font-size`: `14px`
- `font-weight`: `700`
- `width`: `40px`
- `height`: `40px`
- `border-radius`: `50%`
- `display`: `flex; align-items: center; justify-content: center`

### Inline Links

**Default Text Link**
- `color`: `#0000EE`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `18.4px`
- `text-decoration`: `underline`
- **Hover:** `color: #3D34C4; text-decoration: underline`
- **Visited:** `color: #551A8B`

### Back to Top Button

- `background-color`: `#4D42E0`
- `color`: `#FFFFFF`
- `width`: `48px`
- `height`: `48px`
- `border-radius`: `50%`
- `border`: `none`
- `box-shadow`: `0 2px 8px rgba(29, 36, 58, 0.16)`
- `position`: `fixed; bottom: 32px; right: 32px`
- **Hover:** `background-color: #3D34C4; box-shadow: 0 4px 12px rgba(29, 36, 58, 0.24)`

## 5. Layout Principles

### Spacing System
- **Base unit:** `4px`
- `4px` — Tight inline spacing (icon-to-text micro gaps)
- `8px` — Compact internal padding (small badges, tag padding)
- `12px` — Input internal vertical padding, small component gaps
- `16px` — Standard gap between related elements, nav link padding
- `20px` — Button horizontal padding (compact), small section padding
- `24px` — Standard gap between content blocks, button padding (large), icon margins
- `32px` — Card internal padding, medium section spacing
- `40px` — Navigation horizontal padding, section vertical padding
- `44px` — Content group vertical margins
- `48px` — Large content gaps, logo strip spacing
- `56px` — Section-to-section vertical margins
- `64px` — Major section padding (top/bottom of full-width content blocks)

### Grid & Container
- **Max container width:** `1280px`
- **Container horizontal padding:** `40px` (desktop), `24px` (tablet), `16px` (mobile)
- **Column strategy:** Flexible 12-column grid. Feature cards use 3-column equal layout with `24px` gutters. Hero uses asymmetric 50/50 split. Content sections use centered single-column (`max-width: 720px`) for long-form text.
- **Section pattern:** Full-width colored bands containing centered max-width containers. Alternating between white (`#FFFFFF`), ice blue (`#F3F9FB`), and lavender mist (`#F9F6FE`).

### Whitespace Philosophy
Whitespace is the primary hierarchy tool. Sections are separated by generous `64px` vertical padding rather than heavy borders or shadows. Cards rely on spatial grouping rather than outlined containers. The design breathes — content density is intentionally low to build trust and reduce cognitive load, fitting the use case of a service that must feel reliable and simple.

### Border Radius Scale
- `0px` — Ghost buttons, nav links, text links (no rounding)
- `4px` — Small badges, tags, trust indicators
- `8px` — Buttons, input fields, cards, containers (standard component radius)
- `50%` / `9999px` — Circular elements (timer badge, back-to-top button, avatars)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | `box-shadow: none` | Default state for buttons, cards, inputs, navigation. The dominant treatment across the entire interface. |
| Level 1 (Subtle) | `box-shadow: 0 1px 3px rgba(29, 36, 58, 0.08)` | Dropdown menus, tooltips, floating cookie banner. |
| Level 2 (Moderate) | `box-shadow: 0 2px 8px rgba(29, 36, 58, 0.16)` | Back-to-top FAB, floating action elements, photo card overlays. |
| Level 3 (Elevated) | `box-shadow: 0 4px 16px rgba(29, 36, 58, 0.20)` | Modal dialogs, image preview overlays, expanded dropdowns. |
| Level 4 (Prominent) | `box-shadow: 0 8px 32px rgba(29, 36, 58, 0.24)` | Full-screen overlays, hero image floating cards (the passport photo preview stack). |

The shadow philosophy is **deliberately minimal**. The vast majority of components sit at Level 0 with no shadow at all. Depth is communicated primarily through background color shifts (white card on ice-blue section) rather than elevation shadows. When shadows do appear, they use the navy brand color (`#1D243A`) as the shadow base tint rather than pure black, keeping shadows warm and cohesive with the brand palette. This creates a flat, trustworthy, document-like feel.

## 7. Do's and Don'ts

### Do
- Use PT Serif **only** for H1 and H2 display headings — it is the premium editorial voice
- Maintain the alternating section background pattern (white → ice blue → white → lavender) to create rhythm
- Keep CTAs in Indigo Violet (`#4D42E0`) — it is the single most important interactive color
- Use Navy (`#1D243A`) as the default text color for nearly all content
- Apply `8px` border radius consistently across all interactive components (buttons, inputs, cards)
- Pair large serif headlines with generous whitespace above and below
- Use Cool Gray (`#9399B4`) for all placeholder, disabled, and tertiary text
- Keep the navigation clean with only text links and a single colored CTA button
- Show trust signals (reviews, press logos, verification badges) prominently near CTAs
- Use the `16px` body size as the minimum for any readable text

### Don't
- Don't use PT Serif for body text, UI labels, or buttons — it is reserved for display headings only
- Don't introduce additional accent colors outside the defined palette — the indigo-navy-blue triad is intentional
- Don't add heavy shadows or gradients — the design language is deliberately flat
- Don't use pure black (`#000000`) for body text; always use Navy (`#1D243A`) instead
- Don't reduce CTA button padding below the defined minimums — generous click targets are essential
- Don't place dark backgrounds behind content sections — the brand language is light and airy
- Don't use more than two background surface colors in sequence without a white break
- Don't underline text that isn't a link — link blue (`#0000EE`) with underline is the sole link treatment
- Don't mix serif and sans-serif within the same heading level
- Don't use border-radius values other than `0px`, `4px`, `8px`, or `50%`

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | `< 640px` | Single column layout. H1 drops to `40px`. Hero stacks vertically (text above image). Navigation collapses to hamburger menu. Container padding becomes `16px`. Feature cards stack vertically with `32px` gaps. |
| Tablet | `640px – 1023px` | Two-column grid for feature cards. H1 drops to `56px`. Hero uses stacked or 60/40 split. Container padding becomes `24px`. Navigation may partially collapse. |
| Desktop | `1024px – 1279px` | Full three-column feature grid. Full horizontal navigation. Hero in 50/50 split. Standard `40px` container padding. |
| Wide | `≥ 1280px` | Max container width locks at `1280px` and centers. All layouts at full designed width. Generous outer margins auto-calculated. |

### Touch Targets
- **Minimum button height:** `44px` (aligns with Apple HIG and WCAG 2.5.5)
- **Minimum tap target size:** `44px × 44px` for all interactive elements
- **Icon buttons:** Minimum `24px` icon within `44px` tap area (10px padding per side)
- **Navigation links on mobile:** Full-width with `48px` minimum height and `16px` horizontal padding
- **Spacing between adjacent targets:** Minimum `8px` gap to prevent mis-taps

### Collapsing Strategy
- **Hero section:** On mobile, the photo illustration stack moves below the headline/CTA text block. The CTA button becomes full-width.
- **Feature grid (How It Works):** Collapses from 3 columns → 2 columns (tablet) → 1 column (mobile), maintaining `24px` gap.
- **Trust logo bar:** Switches from single-row horizontal scroll to a 2×4 grid on mobile, or uses horizontal overflow scroll with fade edges.
- **Navigation:** Collapses to a hamburger icon on mobile with a slide-in drawer containing full menu items. The CTA button remains visible in the mobile nav header.
- **Typography scaling:** H1 scales `72px` → `56px` → `40px`. H2 scales `40px` → `32px` → `28px`. Body Large scales `24px` → `20px` → `18px`.
- **Section padding:** Reduces from `64px` vertical → `48px` (tablet) → `32px` (mobile).

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Indigo Violet (`#4D42E0`)
- **CTA Hover:** Indigo Violet Dark (`#3D34C4`)
- **Background (primary):** White (`#FFFFFF`)
- **Background (alternate):** Ice Blue (`#F3F9FB`)
- **Background (accent):** Lavender Mist (`#F9F6FE`)
- **Heading text:** Navy (`#1D243A`)
- **Body text:** Navy (`#1D243A`)
- **Secondary text:** Dark Slate (`#4B5163`)
- **Tertiary/placeholder text:** Cool Gray (`#9399B4`)
- **Links:** Link Blue (`#0000EE`)
- **Borders/dividers:** Silver (`#DCDCE6`)
- **Accent surface:** Soft Indigo (`#E6EBFE`)
- **Success/trust:** Green (`#00B67A`)
- **Warning/attention:** Amber (`#FF9500`)

### Iteration Guide

1. **Always start with the Navy-on-White base.** Set `color: #1D243A` and `background: #FFFFFF` as your default body styles. This single decision establishes 80% of the visual identity.

2. **Use PT Serif Bold exclusively for H1 and H2.** Everything else — H3, H4, body, buttons, labels, nav — uses Inter. Never mix this rule.

3. **The only colored button is Indigo Violet (`#4D42E0`).** All primary CTAs use this color with white text, `8px` radius, and `padding: 10px 24px` (large) or `8px 20px` (small). No gradients, no shadows on buttons.

4. **Create section rhythm with background alternation.** Use `#FFFFFF` → `#F3F9FB` → `#FFFFFF` → `#F9F6FE` pattern. Each section gets `64px` top and bottom padding on desktop.

5. **Border radius is always `8px` for rectangular components** (buttons, cards, inputs). Use `50%` only for circular avatars, badges, and FABs. Use `4px` only for tiny inline badges.

6. **The design is flat by default — no shadows.** Only add `box-shadow` for floating overlays (dropdowns, modals, FAB). Cards and buttons sit at elevation 0.

7. **Spacing follows the `4px` base grid strictly.** Common values: `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`. Do not use values outside this scale.

8. **Navigation pattern:** Horizontal bar on white background, logo left, text nav links center-left with `12px 16px` padding, single Indigo Violet CTA button right. Links are `500` weight, `16px`, Navy color with Indigo Violet on hover.

9. **Trust signals belong near CTAs.** Place Trustpilot ratings, press logos, or verification badges within `