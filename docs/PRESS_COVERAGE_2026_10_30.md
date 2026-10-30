# Media coverage update, 30 October 2026

The six-language home carousels and press references use the shared editorial
inventory in `src/site/press-coverage.mjs`. Existing coverage is retained.

## New sources

- Smartphonology: https://www.smartphonology.it/no-ai-act-gioco-gratuito-browser/
  Published 30 October 2026, confirmed by article metadata and visible update date.
  Editorial introduction based on the developer's submission and public materials;
  the article explicitly distinguishes this from a hands-on independent review.
- Videogiochi italiani: https://www.youtube.com/watch?v=lzh-1yXEJGY&t=11s
  Title/channel verified through YouTube oEmbed; publication date 26 October 2026
  from the watch page's datePublished/uploadDate metadata. Interview with the
  creator, as identified by the user and original title. No transcript-based
  claims or quotes were added; no TranscriptAPI account was created.
- Media & Learning Association:
  https://media-and-learning.eu/no-ai-act-what-if-learning-about-ai-regulation-began-with-an-investigation/
  Publication date 26 October 2026 from article:published_time. The visible byline
  identifies Matteo Angeloni; this is an author contribution, not an independent
  review or institutional endorsement.

## Image provenance

- `smartphonology.png`: original publisher logo, 500 x 500,
  https://www.smartphonology.it/wp-content/uploads/2026/02/logo.png
- `videogiochi-italiani-intervista.jpg`: original video thumbnail, 480 x 360,
  https://i.ytimg.com/vi/lzh-1yXEJGY/hqdefault.jpg
- `media-learning.svg`: original publisher logo, 277 x 37,
  https://media-and-learning.eu/wp-content/themes/medialearning/dist/assets/images/logo.svg

These third-party identification assets remain the property of their respective
owners. They are not part of the project's CC BY press-image grant. Files are
served locally; no YouTube iframe, remote image request or new tracker is added.

## Visual test follow-up

The full PR workflow passed the new media checks but failed its existing
`en-ridotto` visual-game journey between Case and Evidence. The same failure was
reproduced locally with the unchanged game bundle `play-CP_-nEVD.js`. The statistics
notice can collapse after eight seconds and move the canvas between coordinate
measurement and a pointer click. Visual-test setup now closes that notice through
its real button and clears its restored shield focus before gameplay. The
previously failing journey passes with all original assertions unchanged. The
notice's auto-hide, focus, close and reopening behavior remains covered by the
separate `usage-notice-smoke.mjs`; no game behavior or production setting changes.
