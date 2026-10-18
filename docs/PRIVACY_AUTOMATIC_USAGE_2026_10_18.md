# Automatic aggregate usage - implementation decision

The owner explicitly requested removing the opt-in checkbox and automatic
collection on 18 October 2026. This replaces the voluntary setup documented on
17 October, not an assertion that a pre-ticked checkbox constitutes consent.

Purpose: operate and improve this game, not research about individual players,
advertising, profiling, cross-site matching or measurement of learning outcomes.
Reference criteria reviewed:

- https://www.garanteprivacy.it/faq/Cookie
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- https://www.cnil.fr/fr/node/677

Technical restrictions: no analytics cookies, persistent/player/session IDs,
fingerprinting, answers/outcomes/scores or raw timelines. Global rather than
IP-keyed rate limits. Daily marginal counts, 90-day window, small-cell suppression,
short-lived delivery-hash deduplication and no payload/application request logs.

A visible notice and per-page disable command replace the checkbox. DNT and GPC
disable collection. Reload behaviour and Cloudflare connection metadata are stated
in the trilingual statistics notice. Disabling cannot retract an in-flight request
or identify/delete a person's contribution from already anonymous-keyless counts.

The public GitHub Pages hostname is not proxied through Cloudflare, so the existing
dedicated public collector on beta.no-ai-act.eu is reused with exact IT/EN/FR app
origin allowlisting (www and beta). No DNS changes, credentials in the browser,
Access bypass for Insights or public admin endpoints are introduced.

This is a bounded first-party audience/operation-measurement implementation, not
a legal certification. IPs are processed by Cloudflare for serving/security; their
absence from application counters is not absolute infrastructure anonymity.
The controller remains responsible for applicable legal basis, provider terms,
international transfer arrangements and any additional platform retention.
