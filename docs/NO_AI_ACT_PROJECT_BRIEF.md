# NO AI ACT — Project Brief

## What it is

NO AI ACT is a free, open-source **investigative serious game about the European
AI Act** (Regulation (EU) 2024/1689). The player takes the role of an inspector
in a city where artificial intelligence systems make decisions about real
people. Each case is a file: the player reads the documents, opens the evidence,
cites the proof and files an **inspection report** that classifies the system's
risk.

It is an **educational simulation**, not legal advice and not a compliance tool.

- Live site: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>
- Italian landing: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/>
- English landing: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/en/>
- Play: <https://matteoangeloni-jpeg.github.io/-NO-AI-ACT/play/>

## Goals

1. Make the **risk-based logic** of the AI Act tangible: prohibited practices,
   high-risk systems, transparency obligations, and legitimate uses.
2. Train **reasoning over memorisation**: a correct decision that is poorly
   justified is still *contestable*.
3. Provide a **classroom-ready** experience that requires no legal prerequisites,
   no account, and no data collection.

## Core loop

1. Open a case file and read the brief.
2. Open the evidence items (each carries a source label: administrative,
   technical, vendor, complaint, public, log, internal).
3. Cite at least two evidence items.
4. File the inspection report: classification → measure → responsible subject →
   justification.
5. Receive a four-level outcome — **compliant / partial / contestable /
   non-compliant** — with a stamped document and a "decisive evidence" line.
6. Unlock the relevant norm card, including a "this does not mean that…" caution.

## Scope

- **11 playable cases**, from clear-cut to deliberately ambiguous.
- Three difficulty levels (base / standard / expert).
- Missions of varying length (demo / short lab / full / advanced).
- Teacher mode with a **local, anonymous** end-of-session debrief and `.txt` /
  `.json` export.
- Two languages: Italian (default) and English, full parity.

## What it is NOT

- Not legal advice or a substitute for the AI Act text.
- Not a compliance, audit or certification tool.
- Not a data-collecting product: no backend, no account, no classroom dashboard.
  Public pages use aggregate, privacy-friendly Cloudflare Web Analytics (no
  cookies, no personal data); the game itself sends no analytics or game data.

## Privacy by design

No personal data leaves the device. Progress and settings live only in the
browser's `localStorage`. The teacher debrief export is local and anonymous.

## Technology

- TypeScript + Phaser 3 (the game), built with Vite 5 (multi-page).
- Static landing pages (Italian and English) with SEO metadata, hreflang and
  schema.org structured data.
- Deployed as a static site on GitHub Pages.

## Licensing

Code under the **MIT** licence; narrative and educational content under
**CC BY 4.0**. See `LICENSE`, `THIRD_PARTY_LICENSES.md` and `CREDITS.md`.

## Status and caveats

NO AI ACT is a didactic simplification. A **third-party legal review** is
recommended before any formal institutional or public use. Cases such as GPAI,
public chatbots, EdTech and procurement are framed by **context of use**, not as
blanket prohibitions.
