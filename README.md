# Dynamic Island

Two original, dependency-free takes on the Dynamic Island idea, built with one small spring engine.

- **Morph**: the island changes size with springs while content cross-fades with blur (idle, focus timer, music, trip tracking).
- **Split**: a pill and a bubble inside an SVG gooey filter; the bubble springs out, leaves a liquid neck, then merges back (call, charging).

## Files
- `index.html` markup
- `style.css` styles and theme tokens
- `script.js` spring engine and interactions

## Use
Open `index.html`. No build step.

URL hash options, joined with `-`: `#aurora` (default), `#sunset`, `#light`, `#dark`, `#auto` (loops through the states, handy for screen recordings). Example: `#sunset-dark-auto`.

Respects `prefers-reduced-motion`. This is an original concept inspired by the general idea, not a copy of a specific shot.
