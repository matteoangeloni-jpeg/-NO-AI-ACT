# Distribution submission pack

Ready-to-paste metadata for submitting NO AI ACT to educational and
research-software repositories. **Every submission below is a manual OWNER
action** — nothing here is automated, no account is created by the project,
and no submission has been made unless the Status field says so.

## Shared metadata (reuse everywhere)

- **Title:** NO AI ACT — Simulatore di una società non regolata / Simulator of an unregulated society
- **Short description (≤160 chars, EN):** Free, open-source browser serious game about the EU AI Act: investigate AI incident case files, classify risk, file inspection reports. IT/EN, no account.
- **Long description (EN):** NO AI ACT is a free, open-source, browser-based investigative serious game about the European AI Act (Regulation (EU) 2024/1689). Players act as an inspector in a fictional 2032 city where the AI Act never entered into force: they open case files on AI systems (social scoring, workplace monitoring, deepfakes, predictive healthcare, biometrics, credit scoring, chatbots, procurement, adaptive education platforms, GPAI), examine evidence, classify risk, assign responsibility and corrective measures, and watch city indicators respond. A local teacher mode adds discussion pauses and an anonymous classroom debrief. Bilingual IT/EN, no account, no backend, no personal-data collection; gameplay makes no network requests. Code MIT, educational content CC BY 4.0. Educational effectiveness has not yet been empirically validated.
- **Languages:** Italian, English
- **Licence:** Code MIT; educational/narrative content CC BY 4.0
- **Audience:** secondary school (upper), university, adult/professional training, self-learners
- **Learning-resource type:** serious game / interactive simulation / lesson component
- **Subject:** EU AI Act; AI regulation; AI literacy; digital citizenship; law & technology education
- **Keywords:** AI Act, EU 2024/1689, serious game, game-based learning, AI literacy, risk classification, digital citizenship, privacy by design, open educational resource
- **Accessibility statement:** keyboard shortcuts for decisions; reduced-motion and CRT toggles; scalable browser zoom; the canvas game is desktop/tablet-first (a compact-layout and semantic reading layer are on the 2.0 roadmap). No full WCAG conformance claim is made.
- **Technical requirements:** modern browser with JavaScript; no installation, no account, no plugin; works offline after load except initial fetch.
- **Canonical URL:** https://www.no-ai-act.eu/
- **Repository URL:** https://github.com/matteoangeloni-jpeg/-NO-AI-ACT
- **Screenshots:** use `/press-kit/` assets (1200×630 covers + gameplay screenshots, CC BY 4.0, alt text provided).
- **Citation:** see https://www.no-ai-act.eu/en/how-to-cite/ (CITATION.cff in repo; DOI pending Zenodo archive of 2.0).

## Per-platform notes and manual steps

### OER Commons (oercommons.org)
- Resource type: Game / Interactive; Grade: High School–Postsecondary; Subject: Social Sciences → Law, Computer Science.
- Steps (owner): create account → Contribute → "Add a link" → paste canonical URL + shared metadata → set licence CC BY 4.0 (content) with note that code is MIT → attach 2 screenshots.
- **Status:** NOT submitted.

### MERLOT (merlot.org)
- Material type: Simulation; Primary audience: College General Ed / High School; Technical format: Website.
- Steps (owner): account → Contribute a Material → URL + shared metadata → category "Academic Support Services / Law" or "Information Technology".
- **Status:** NOT submitted.

### Scientix (scientix.eu)
- Fit: STEM + citizenship resource (AI literacy). Submit via "Resources" partner form or the project helpdesk; EU-project framing (AI Act, digital competence) is relevant.
- **Status:** NOT submitted.

### itch.io
- Page type: HTML game (external link or embedded build). Classification: Educational; Tags: serious-game, education, ai, politics, italian, english. Pricing: free, no donations required.
- Steps (owner): account → New project → either "External link" to the canonical URL or upload the `dist/` build as playable HTML (respect /play/ noindex is irrelevant there; itch page links canonically to no-ai-act.eu).
- **Status:** NOT submitted.

### Zenodo
- Integration: enable the GitHub–Zenodo webhook on the repository (owner login with GitHub), then publish the v2.0.0 GitHub release → Zenodo archives it and mints a DOI. `CITATION.cff` is read automatically; **no `.zenodo.json` is committed on purpose** (Zenodo would give it precedence and create a second metadata source to keep in sync).
- After DOI: insert it in `CITATION.cff`, `/come-citare/`, `/en/how-to-cite/`, README.
- **Status:** NOT archived; awaiting 2.0 release + owner authorization.

### University project pages / serious-game directories / educational newsletters
- Use the 100-word description + factsheet from `/press-kit/`; propose the teacher quick-start as the linked asset for education audiences and `/en/research-and-methodology/` for research audiences.
- **Status:** NOT submitted anywhere — track per-target status in `docs/OUTREACH_TARGETS.csv`.

## Honesty rules for every submission
No claims of proven effectiveness, awards, endorsements, partnerships or user
counts. State clearly: educational simplification, not legal advice; no data
collection; validation status = not yet empirically validated.
