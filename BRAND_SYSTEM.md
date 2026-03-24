# PCSAI BRAND SYSTEM

**Document Control:** PCSAI-BRAND-2026-001
**Classification:** RESTRICTED — INTERNAL USE ONLY
**Revision:** 1.0
**Date:** 2026.03.21

---

## 0. GOVERNING PRINCIPLE

This brand system serves the Pontifical Commission on Sacred Asset Infrastructure (PCSAI), a fictional institution that operates the HOLY_OPS relic exchange terminal. Every design decision answers one question: does this feel like a classified corporate report from a shadowy institution? If it feels warm, friendly, or nostalgic — it is wrong. If it feels cold, precise, and slightly sinister — it is correct.

The visual language draws from three real-world registers: Swiss modernist corporate identity (Neue Grafik, NASA Graphics Standards Manual), 1980s institutional computing hardware (Bloomberg, Bell Atlantic, military HUD), and contemporary brutalist typography. It is not retro. It is not themed. It is designed.

---

## 1. COLOR SYSTEM

### 1.1 Corporate Register

The document palette. Used for all print-format materials, the GDD, onboarding documents, and any screen that is not the in-game terminal.

| Token | Hex | Usage |
|-------|-----|-------|
| `--corp-white` | `#F0F0F2` | Page background. Cool fluorescent-lit paper. |
| `--corp-grey-100` | `#E4E4E8` | Secondary background. Sidebar, callout fills. |
| `--corp-grey-200` | `#C8C8CE` | Borders, rules, structural lines. |
| `--corp-grey-300` | `#9898A0` | Tertiary text, captions, timestamps. |
| `--corp-grey-400` | `#686870` | Secondary text, labels, metadata. |
| `--corp-black` | `#18181C` | Primary text. Near-black with a cool cast. |
| `--corp-accent` | `#2A4BD7` | Classification stamps, section markers, active states. Institutional blue — sharp, cold, authoritative. |
| `--corp-accent-muted` | `#2A4BD714` | Accent at 8% opacity. Callout box backgrounds. |

No warm colors appear in this register. No cream, no ivory, no warm grey. The background is not white — it is the color of paper under fluorescent tubes. The accent blue is chosen for its institutional authority: it is the blue of a government stamp, not a hyperlink.

### 1.2 Terminal Register

The in-game palette. Used for the HOLY_OPS terminal interface — the BSP grid, ticker, feed, and all gameplay surfaces.

| Token | Hex | Usage |
|-------|-----|-------|
| `--term-bg` | `#0A0C10` | Terminal background. Near-black with blue undertone. |
| `--term-surface` | `#12141A` | Elevated surfaces. Cell backgrounds, panels. |
| `--term-border` | `#1E2028` | Panel borders, structural dividers. |
| `--term-text` | `#C8CAD0` | Primary terminal text. Cool light grey. |
| `--term-text-dim` | `#6E7078` | Secondary text, timestamps, metadata. |
| `--term-amber` | `#D4A017` | Data readout, currency, primary values. Phosphor amber — the color of instrument panel LEDs. |
| `--term-green` | `#2EAA4A` | Positive state. Winning bid, profit, acquired. LED green — not neon, not lime. |
| `--term-red` | `#D43030` | Negative state. Outbid, loss, danger. LED red — saturated but not glowing. |
| `--term-cyan` | `#3AA8C8` | System data, market information, classification. CRT cyan — informational, not decorative. |
| `--term-blue` | `#2A5FD7` | Structural borders, active element highlight. |

These colors are derived from hardware, not aesthetics. Amber is phosphor P3 (the amber used in monochrome CRTs and LED segment displays). Green is the LED indicator on a Bloomberg keyboard. Red is a warning lamp. Cyan is the text color of a Bell Atlantic terminal. They are sharp and precise. They do not glow. They do not bloom. They are LED segments, not CRT phosphor wash.

### 1.3 Sect Colors (Terminal Register Only)

| Sect | Hex | Rationale |
|------|-----|-----------|
| Flagellants | `#D43030` | Red — blood, penance, alarm. |
| Cathari | `#3AA8C8` | Cyan — cold purity, detachment. |
| Gnostic Order | `#9B5FC8` | Violet — esoteric, hidden knowledge. |
| Bogomils | `#5AAA40` | Green — growth heresy, material rejection. |
| Waldensians | `#D48A20` | Amber — commercial disruption, market warning. |

### 1.4 Color Rules

- Corporate register uses ONLY greyscale + the single accent blue. No exceptions.
- Terminal register uses the functional color set above. Color is information, never decoration.
- No gradients. Ever. Flat fills only.
- No color fills behind text blocks (no "highlight" backgrounds). Use left-border accent for callouts.
- No opacity below 60% on text. Readability is non-negotiable.

---

## 2. TYPOGRAPHY

### 2.1 Type Stack

| Role | Family | Fallback | Usage |
|------|--------|----------|-------|
| Primary sans | DM Sans | system-ui, -apple-system, sans-serif | Corporate register body, headings, UI labels. |
| Monospace | IBM Plex Mono | 'SF Mono', 'Consolas', monospace | Terminal register, data tables, classification marks, code, document control numbers. |

DM Sans is chosen for its geometric construction and neutral tone. At the specified weights and tracking, it reads as institutional rather than friendly. It is not Inter (too humanist), not Helvetica Neue (too ubiquitous), not a display face. It is a workhorse that disappears into the system.

IBM Plex Mono is the monospace standard. It has the right density for terminal simulation and the right authority for classification stamps.

No third typeface is permitted. Display impact is achieved through scale and spacing of these two families.

### 2.2 Corporate Register Type Scale

| Level | Family | Weight | Size | Tracking | Transform |
|-------|--------|--------|------|----------|-----------|
| Page title | IBM Plex Mono | 600 | 32px | +0.08em | uppercase |
| Section heading (H2) | IBM Plex Mono | 600 | 14px | +0.12em | uppercase |
| Sub-heading (H3) | DM Sans | 500 | 14px | +0.04em | uppercase |
| Body | DM Sans | 400 | 14px | +0.01em | — |
| Caption / metadata | IBM Plex Mono | 400 | 11px | +0.06em | uppercase |
| Classification stamp | IBM Plex Mono | 700 | 11px | +0.14em | uppercase |
| Table header | IBM Plex Mono | 500 | 11px | +0.08em | uppercase |
| Table data | IBM Plex Mono | 400 | 12px | +0.02em | — |
| Pull quote | DM Sans | 300 | 18px | +0.01em | italic |

All section headings use monospace. This is a deliberate departure from convention. The monospace heading creates an institutional tone — these are not chapter titles, they are file section markers. The generous letter-spacing on headings is critical: it transforms the monospace from "code" to "classified document."

### 2.3 Terminal Register Type Scale

| Level | Family | Weight | Size | Tracking |
|-------|--------|--------|------|----------|
| Panel title | IBM Plex Mono | 600 | 10px | +0.10em |
| Data value | IBM Plex Mono | 500 | 12px | +0.02em |
| Feed text | IBM Plex Mono | 400 | 11px | +0.02em |
| Label | IBM Plex Mono | 400 | 9px | +0.08em |

The terminal uses monospace exclusively. No sans-serif appears in the game interface.

### 2.4 Typography Rules

- Left-aligned only. No centered text except page numbers in footers.
- No justified text. Ragged right edge is correct.
- Line height: 1.6 for body, 1.3 for headings, 1.4 for tables.
- Maximum body text width: 640px. Narrower is better. The NASA manual uses roughly 50% of its page width for text, leaving the right side as whitespace.
- Paragraph spacing: 1em between paragraphs. No indent on first line.
- Headings preceded by 2em space, followed by 0.5em space.

---

## 3. LAYOUT SYSTEM

### 3.1 Grid

The layout grid is a 12-column system with 24px gutters and 48px outer margins. Content rarely spans all 12 columns — the deliberate use of 7-8 columns for text with the remainder as whitespace is a defining characteristic.

### 3.2 Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 16px |
| `--space-4` | 24px |
| `--space-5` | 32px |
| `--space-6` | 48px |
| `--space-7` | 64px |
| `--space-8` | 96px |

### 3.3 Structural Rules

- No rounded corners. Border-radius is 0 everywhere.
- No box shadows. Elevation is communicated through border weight and background shade.
- 1px borders only (2px for active/selected states).
- Horizontal rules: 1px solid `--corp-grey-200`. Generous vertical space above and below.
- Content blocks separated by whitespace, not containers.

---

## 4. GRAPHIC ELEMENTS

### 4.1 Dithered Bitmap Dividers

Horizontal dividers between major sections use 1-bit dithered patterns rendered as inline SVG. These are not decorative overlays — they are crafted graphic elements that reference the bitmap aesthetic of early digital imaging.

Specifications:
- Height: 8-12px
- Width: 100% of content column
- Pattern: Ordered dither dissolve (Bayer matrix or Floyd-Steinberg edge)
- Colors: `--corp-black` pixels on `--corp-white` background
- Rendered as SVG rect elements at 1:1 pixel scale
- At page scale, the pixel structure is visible — this is intentional

Patterns should suggest dissolution or transmission artifact — a signal degrading at the section boundary.

### 4.2 Wireframe Geometric Ornaments

Page ornaments drawn as thin-stroke wireframe geometry: globes, crosses, grids, polyhedra. Used at very low opacity (5-10%) as background watermarks on cover pages or section openers.

Specifications:
- Stroke: 1px, `--corp-grey-200`
- Fill: none
- Opacity: 0.05-0.10
- Position: absolute, offset from content
- These are architectural, not illustrative

### 4.3 Hole-Punch Margin Dots

A column of small filled circles in the left margin, spaced at regular intervals. References the Commonplace invoice and continuous-feed paper.

Specifications:
- Diameter: 6px
- Color: `--corp-grey-200`
- Spacing: 48px vertical intervals
- Position: 16px from left page edge
- Extend the full height of the document body

These are structural, not decorative. They reference the physical artifact of a printed document — the punch holes that would hold it in a binder.

### 4.4 Classification Stamps

Document control marks rendered in monospace, uppercase, with heavy letter-spacing. Positioned in headers, footers, and cover pages.

Format:
```
RESTRICTED
PCSAI-GDD-2026-002
```

Specifications:
- Font: IBM Plex Mono, 700 weight
- Size: 11px
- Tracking: +0.14em
- Color: `--corp-accent` for classification level, `--corp-grey-400` for document number
- Optional: 1px border in accent color around classification level

### 4.5 Terminal Embed Blocks

Within corporate documents, in-game UI can be shown in dark terminal-styled blocks.

Specifications:
- Background: `--term-bg` (#0A0C10)
- Border: 1px solid `--term-border`
- Padding: 24px
- No border-radius
- No glow effects
- No scan lines
- Monospace text in terminal colors
- Sharp rectangular insert within the light document

### 4.6 What the Brand Never Does

- No rounded corners
- No gradients
- No CRT scan lines
- No text-shadow glow effects
- No warm colors (no cream, no sienna, no gold in corporate register)
- No emojis
- No centered text (except page numbers)
- No casual language
- No third typeface
- No decorative imagery without captions
- No color fills on text backgrounds (use left-border callouts instead)
- No drop shadows
- No animated transitions in documents
- No icon fonts
- No stock photography

---

## 5. COMPONENT PATTERNS

### 5.1 Data Tables

| Property | Value |
|----------|-------|
| Font | IBM Plex Mono |
| Header weight | 500 |
| Header tracking | +0.08em |
| Header transform | uppercase |
| Header border-bottom | 2px solid `--corp-black` |
| Row border-bottom | 1px solid `--corp-grey-200` |
| Cell padding | 8px 16px |
| Number alignment | Right |
| Text alignment | Left |
| No zebra striping | — |

### 5.2 Callout Boxes

- Left border: 3px solid `--corp-accent`
- Background: `--corp-accent-muted` (accent at 8% opacity)
- Padding: 16px 24px
- Font: body text style
- No border-radius

### 5.3 Pull Quotes

- Font: DM Sans Light Italic, 18px
- Horizontal rule above: 1px solid `--corp-grey-200`
- Horizontal rule below: 1px solid `--corp-grey-200`
- Vertical padding: 24px
- Left margin: 0 (flush with body text)
- Color: `--corp-grey-400`

### 5.4 Sidebar Navigation (Digital Documents)

- Position: fixed left
- Width: 220px
- Background: `--corp-black`
- Text: IBM Plex Mono, 11px, `--corp-grey-300`
- Active link: `--corp-white` text
- Section groups separated by 1px rule in `--term-border`
- No hover background color. Hover changes text color only.
- Padding: 8px 16px per link

### 5.5 Table of Contents

Asymmetric layout: content occupies the left 60% of the page width, right 40% is whitespace.

- Section numbers: IBM Plex Mono 600, 14px
- Section titles: IBM Plex Mono 400, 14px, uppercase
- Leader dots: periods in `--corp-grey-300`, letter-spacing +0.16em
- Sub-items: indented 24px, 12px size
- Decimal numbering: 1.0, 2.0, 3.0 (not 1, 2, 3)
- Generous vertical spacing between entries (16px)

---

## 6. TWO-REGISTER SYSTEM

The brand operates in two visual registers that share DNA but serve different contexts.

### 6.1 Corporate Register

Used for: GDD documents, specification sheets, onboarding materials, the PCSAI website (if one existed), printed dossiers.

Characteristics: Light background, dark text, accent blue for classification and structure, generous whitespace, asymmetric layout, combined sans-serif body with monospace headings.

Feel: A classified briefing document from an institution you have never heard of and probably should not have access to. The design equivalent of a room with fluorescent lighting and no windows.

### 6.2 Terminal Register

Used for: The HOLY_OPS game interface, terminal embed blocks within documents, any screen the operator (player) interacts with during gameplay.

Characteristics: Dark background, monospace exclusively, functional color coding (amber/green/red/cyan), dense information layout, no decorative elements.

Feel: A hardware terminal in a monastery basement. The screen hums. The data is real. Every pixel is a number that matters.

### 6.3 Shared DNA

Both registers share:
- IBM Plex Mono as structural typeface
- Zero border-radius
- 1px border weight
- No gradients, shadows, or glow
- Left-aligned text
- Information density as a value (nothing is decorative)
- The institutional tone of PCSAI as the governing voice

---

## 7. VOICE AND TONE

### 7.1 Institutional Voice

All text written in the PCSAI voice is:
- Third person or imperative
- Formal without being archaic
- Specific without being verbose
- Cold without being hostile

The operator (player) is addressed as "the operator" in documents and never addressed directly in the terminal (the terminal speaks in system messages, not to a person).

### 7.2 Terminology

| Term | Meaning |
|------|---------|
| Operator | The player |
| Asset | A relic |
| Lot | An auction item |
| Market day | A game round |
| Enshrine | Permanently lock a relic into collection |
| Settlement | End-of-day review phase |
| Briefing | Pre-market intelligence phase |
| Net worth | Cash + portfolio market value |
| Tribunal delay | Heresy-induced market freeze |
| Exchange | The HOLY_OPS trading system |
| Commission | PCSAI, the governing body |

### 7.3 Writing Rules

- No exclamation marks. Ever.
- No contractions in formal documents (cannot, not can't).
- Numbers under 10 are written as words in body text, as numerals in tables and data.
- Dates in YYYY.MM.DD format.
- Currency symbol: the obol (Unicode lozenge or custom glyph).
- Abbreviations defined on first use, then used consistently.
- No rhetorical questions.
- No humor. The institution does not have a sense of humor. The content may be darkly amusing to the reader, but the author is always deadly serious.

---

## 8. APPLICATION EXAMPLES

### 8.1 GDD Document

The Game Design Document is the primary showcase of the corporate register. It should feel like opening a restricted briefing from an institution that takes itself very seriously. The cover page has a classification stamp, a document control number, and nothing else except the title in large monospace. The table of contents uses leader dots and asymmetric layout. Data tables are monospace with right-aligned numbers. Terminal embed blocks punctuate the light document with dark rectangles showing the actual game UI. Dithered SVG dividers mark major section transitions.

### 8.2 Game Interface

The terminal interface is the primary showcase of the terminal register. It is a dense, functional trading screen. Color is information. Every element has a purpose. The BSP grid is a heat map of market activity. The ticker is a position tracker. The feed is an intelligence stream. There is no decoration. There is no branding in the terminal (no PCSAI logo, no classification stamps during gameplay). The terminal is a tool, and tools do not advertise.

---

*End of document.*
*PCSAI-BRAND-2026-001 REV 1.0*
