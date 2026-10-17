# Beta usage and press review - 17 October 2026

## Observed usage evidence

- Cloudflare zone Analytics / Requests, Last 24 hours, inspected on 17 October
  around 11:20 Europe/Rome: Top hosts shows 716 requests for beta.no-ai-act.eu.
  This is an HTTP request count, not people, sessions or completed cases.
  It includes assets and may include bots and internal verification traffic.
- Pages project Metrics has no data for that range and Web Analytics is disabled.
  It is not evidence of zero site visitors.
- Remote D1 read-only query `SELECT COUNT(*) AS aggregate_cells FROM counters;`
  returned 0; no rows written. Collection remains disabled in configuration.
- Unauthenticated beta /play/?lang=it returned HTTP 200 on 17 October 09:27 UTC,
  with noindex/nofollow/noarchive. Insights /api/stats returned HTTP 302 to Access.
- Conclusion: beta traffic exists; actual new-beta starts/completions cannot be
  determined from the currently collected evidence. No telemetry was enabled.

## Public sources found through authorized email search

1. Fix Gaming Channel, 16 October 2026:
   https://www.fixgamingchannel.com/fix-stories-no-ai-act-matteo-angeloni/
   Public page title: Fix Stories: From AI Research to a Game Built on Weekends.
   This is Matteo Angeloni's first-person developer story, not an independent review.
   Publication date and attribution checked on the publisher's page.
2. Videogiochi italiani, 3 October 2026:
   https://www.youtube.com/watch?v=BJO6aiElmrY
   Public title: Abbiamo Giocato a NO AI ACT: Un'Europa Senza Regole sull'AI!
   Channel, title, date and description checked on YouTube. Duration 39:10.
   This predates the new beta. No claim of a full viewing/transcript review.

Private email text and contact details are not reproduced on the website.
Targeted recent email searches returned the Fix Gaming Channel notification;
that is not an exhaustive claim about all accounts or all feedback.

## Release boundary

User explicitly approved publishing these two links on www.no-ai-act.eu.
Stable release prepared from origin/main in codex/press-coverage-oct17, PR 107:
https://github.com/matteoangeloni-jpeg/-NO-AI-ACT/pull/107
Only IT/EN homepage copy and its smoke test, npm entry, smoke runner entry and
guardrail documentation are in this release.
No beta game changes are merged into stable. French source/generated homepage
updates remain in the beta workspace, because French is not on stable main.

Local verification: typecheck, production build, SEO audit, verify-dist passed;
1222 tests passed (20s filesystem-test timeout after an initial 5s timeout);
IT/EN press coverage browser smoke passed at 390px and 1440px.
PR CI passed all checks, including full browser smoke, in 17m03s.
PR 107 merged on 17 October 09:50:09 UTC as
9edc94f66167d71ce13a5084caa8621cd8d20a4c. Production workflow 39022626514
completed successfully: build 25m48s, deploy 11s.
The already-live stable game script and the prepared release both referenced
assets/play-BDKuS-M-.js before merge; gameplay code was not changed.

Post-deployment verification: fresh unauthenticated HTTP 200 for both public
homepages with all three source links and updated headings. The public game
still references play-BDKuS-M-.js. Chrome rendered the published Italian press
section with both new entries, correct dates and the existing Absolute Gamer
quote intact. No beta deployment, Access changes or collection activation.
