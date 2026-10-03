# Cartelera misteriosa 🎃

A small, handmade web page I built as a "mystery billboard" for our October nights.
Each of the five nights gets its own surprise. Instead of just announcing the plan,
the page lets you discover it: open the doors, follow the clues, guess the movie.

## How I made it

- **Plain HTML, CSS and JavaScript.** No frameworks and no build step. It's just a page you open in the browser.
- **Look and feel:** a dark, candle-lit palette with gold accents. The fonts are *Cinzel Decorative* and *IM Fell English* from Google Fonts.
- **The doors:** each door is a button that swings open with a CSS 3D rotation and reveals a riddle about the night's movie.
- **Effects:** each door has its own animation, built with the Web Animations API:
  - bats escape from the first one;
  - crimson drops fall from the second;
  - sparks of light burst from the third.
- **Background:** glowing embers drift up on a `<canvas>`.
- **Music:** *Welcome to Halloween* plays on a loop. A button in the corner mutes it.
- **Reduced motion:** if the system is set to reduce motion, the page turns the animations off.

## Structure

```
index.html               main page: one door per night
3-de-octubre.html        night I: three doors, three worlds
10-de-octubre.html       night II: adventures, melancholy and surprise
17-de-octubre.html       night III: the night of the eternal ones
31-de-octubre.html       night IV: the longest night
1-de-noviembre.html      night V: Day of the Dead sunrise
css/estilos.css          shared styles
css/portada.css          main page styles
css/noviembre.css        Day of the Dead styles
css/laboratorio.css      night II styles
css/luna-roja.css        night III styles
css/escena.css           night IV styles
js/script.js             doors, effects, embers and music
mp3/                     background melodies
```

## How to open it

Open `index.html` in any modern browser and pick a night. Keep the `mp3/` folder next to it so the music works.

## October 2026 plan

Five nights, each with a different dynamic:

| Night | Date      | Dynamic                                     |
|-------|-----------|---------------------------------------------|
| I     | Oct 3     | **Three doors, three worlds** (current page) |
| II    | Oct 10    | **Adventures, melancholy and surprise**     |
| III   | Oct 17    | **The night of the eternal ones**           |
| IV    | Oct 31    | **The longest night** 🎃                     |
| V     | Nov 1     | **Day of the Dead sunrise**                 |

This is a work in progress. I'll keep improving it week by week until the last night.
