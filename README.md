# American Dream Coin ($DREAM)

A patriotic, single-page landing site for **$DREAM** — a community Solana
memecoin riding the housing-affordability / Main-Street-vs-Wall-Street
narrative.

Visual style is inspired by [uscrgov.org](https://uscrgov.org) (glassmorphism,
floating gradient orbs, CRT scanlines, sequential hero fade-ins, pulsing CTA)
but recolored full red / white / blue with stars, stripes, and a "Dream Index"
mission panel instead of a treasury panel.

## File structure

```
American Dream/
  index.html        # Markup: nav, hero, how-to-buy, chart, dream index,
                    # tokenomics, roadmap, FAQ, footer
  styles.css        # All styling: glass panels, orbs, scanlines, animations
  script.js         # CA copy, mock price ticker, gauge animation, reveal-on-scroll
  assets/
    favicon.svg     # Star-on-gradient mark
  README.md
```

No build step, no framework, zero dependencies — just open `index.html`.

## Run it

```bash
# Option A: just double-click index.html
open index.html

# Option B: serve locally so animations + smooth-scroll feel right
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What you'll want to swap before launch

| Where | What to replace |
|---|---|
| `index.html` — `#ca-text` | Real Solana contract address |
| `index.html` — footer `.footer-social` `href="#"` | Real X / Telegram / Dexscreener links |
| `index.html` — `<title>` and meta tags | Final taglines, OG image URL |
| `index.html` — `.disclaimer` | Final legal language (have a lawyer review) |
| `index.html` — Dream Index stats | Live affordability data when ready |
| `script.js` — mock price ticker | Real Birdeye / Jupiter / Dexscreener API |
| `assets/favicon.svg` | Final brand mark |

## Color palette

| Token | Value | Use |
|---|---|---|
| `--red-deep` | `#B22234` | Old Glory red |
| `--red` | `#E63946` | Primary red |
| `--red-bright` | `#FF3B47` | Accents / live dot |
| `--white` | `#FFFFFF` | Stars, copy |
| `--blue-deep` | `#0A1A47` | Background base |
| `--blue` | `#1B3F9B` | Old Glory blue |
| `--blue-bright` | `#2C6CD1` | Gradient accents |
| `--sky` | `#43AFFF` | Highlights |

## Notable details borrowed from uscrgov.org

- `heroFadeIn`, `heroFadeUp`, `heroScaleIn` keyframes with cascading delays
- `glassPulse`-style infinite shadow pulse on the primary CTA (here `ctaPulse`)
- CRT-style scanline overlay (`.scanlines`)
- Floating gradient orbs blurred with `mix-blend-mode: screen`
- 4-step "How to Buy" card grid
- Glass-panel chart card with resolution tabs and live dot
- Sticky blurred navbar with gradient underline hover

## Disclaimer

$DREAM is a community memecoin for entertainment purposes only. The site is
not affiliated with, endorsed by, or representative of the United States
Government, the U.S. Treasury, or any government entity. Update the
disclaimer in the hero + footer to match your jurisdiction before going
live, and have a lawyer review.
