# Dress-Up Game

A playful React browser game: choose clothes and accessories for an event, then
score the outfit for fit, weather, safety, and style. Events range from a birthday
party and a school day to scuba diving and a snow day.

**Status:** browser game prototype originally developed in CodeSandbox.
The scoring is a small rule-based system, not an AI model.

## Play

Choose items from the wardrobe, use **Finish Look** to see the score breakdown,
and **Next Round** for another event. The app includes image-based avatar layers
and a catalog of tagged wardrobe items.

## Run locally

With Node.js/npm installed:

```bash
npm install
npm start
```

Open the URL printed by the development server. This repository has no npm lockfile;
dependency resolution may change across installations. It uses the older
Create React App toolchain, and current toolchain compatibility has not been
reverified during this documentation pass.

```bash
npm run build
```

## Source map

- `src/App.js`: event/item data, outfit state, scoring, and interface.
- `src/styles.css`: presentation.
- `public/assets/girl/`: layered avatar assets.

No API key or backend is required by the game. This is a small creative experiment,
not a maintained production release.
