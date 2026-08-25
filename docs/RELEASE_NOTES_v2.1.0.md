# NO AI ACT v2.1.0 — copyleft, il primo minuto giocato, il gioco mostrato

The 2.1 release closes the consolidation pass opened after 2.0. Sixteen PRs
(#62–#77) since the v2.0.0 tag, all gates green at every merge.

**This is the first release under copyleft.** Code moves from MIT to
GPL-3.0-or-later and narrative/educational content from CC BY 4.0 to
CC BY-SA 4.0. Nobody can enclose this work in a proprietary product any more.
Versions up to and including v2.0.0 keep their original terms — those rights
are not revoked and cannot be.

## Licensing

- **Code: GPL-3.0-or-later** (`LICENSE` Section 1). Modify it freely; if you
  distribute it — including by publishing it online, since the game is
  delivered to every visitor's browser — you must release your source too.
- **Narrative and educational content: CC BY-SA 4.0** (Section 2). Reuse and
  adapt the 13 cases and the teaching materials, but the result stays open
  under the same terms.
- **Press materials: CC BY 4.0** (Section 3, a deliberate exception). The SA
  clause would have forced a newsroom reusing the press kit to license its own
  article under CC BY-SA — which no publication can do. The exception covers
  `/press-kit/` texts, official images and gameplay screenshots, and nothing
  else.
- **Third-party**: Phaser, Vite and Vitest keep their MIT terms. MIT is
  GPL-3-compatible, so Phaser stays in the bundle.
- **Copyright** is now attributed to Matteo Angeloni, the repository's sole
  author, instead of the collective entity "NO AI ACT project contributors".

## Game

- **The briefing opens a case file, not a menu** (#71). The player used to read
  a text screen and then face thirteen clickable cases without having examined
  a single exhibit. The primary action now enters the guide case directly; the
  civic map stays one tap away and nothing is locked.
- **Investigation notebook** (#63): facts, contradictions and a deferred
  chapter verification, all derived from the pinned case data.

## Site and UX

- **The homepage shows the game instead of describing it** (#72). Six abstract
  written steps became four real gameplay frames — case file, cited exhibits,
  risk classification, signed report — captured by playing an actual case in
  both languages (`scripts/media/capture-gameplay.mjs`). Two real screens now
  sit above the fold instead of one.
- **The access-point grid moved below the game** (#72): it used to sit between
  the hero and the first proof of the product.
- **Homepage redesign** (#69) and **WCAG AA contrast fixes** (#68).
- **Navigation parity** (#73): seven English pages carried a navigation stuck
  at an earlier version — seventeen entries instead of twenty. The three
  missing destinations were English-only pages, which depend on the global
  navigation more than any other. All thirty English pages now share one
  signature.

## Content and discoverability

- **The GPAI pages anchor Chapter V** (#74): the pages explained the logic well
  but cited no article of the regulation. Articles 51, 53, 55 and 56 now map
  who carries which duty, and the Article 3 definition sits where it was
  needed.
- **Depth pass on the four thinnest normative pages** (#62); pages under 600
  words dropped from 17 to 14.
- **School-compliance search intent** (#65) and the **site insight report**
  (#64), which surfaces structure and linking without any visitor tracking.

## Integrity

- **The landings listed 11 case cards while shipping 13** (#67). Every textual
  claim had been fixed; nobody had counted the cards, because a test hardcoded
  eleven.
- **Two fossil files deleted** (#70): a root `llms.txt` frozen at an early
  revision, still claiming eleven cases and linking three removed English
  pages, and a screenshot helper hardcoding an absolute path from the machine
  that produced it. Both had passed every gate, because nothing imported them.
- **Release state corrected** (#76): the repository claimed the v2.0.0 tag was
  unpublished while it had existed since 2026-07-26, and five tests actively
  enforced that false claim. The guards are now state-aware rather than
  inverted.

## Notes

- Educational effectiveness has **not** yet been empirically validated.
- The game remains an educational simplification of Regulation (EU) 2024/1689
  and is not legal advice.
- No backend, no accounts, no personal data, no gameplay network calls.
