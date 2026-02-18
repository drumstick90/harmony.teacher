# User Guide

This guide replaces the old `START_HERE.md`, `QUICK_START.md`, `HOW_TO_USE.md`, and `BROWSER_MODE.md`.

## Requirements

- Node.js 16+
- A USB MIDI keyboard
- Chrome, Edge, or Opera (Web MIDI API support)

## Quick Start

```bash
cd /Users/pier/Coding/harmony.teacher
npm install
npm start
```

Open `http://localhost:5173` if it does not open automatically.

## First Run

1. Connect your MIDI keyboard.
2. Allow MIDI access in the browser if prompted.
3. Click `Start Analyzing` / `Start Learning`.
4. Play a triad (for example `C E G`) and verify the analysis updates.

## Audio Modes

- `Synth OFF`: use external audio (DAW/VST) only.
- `Synth ON`: enable internal synth playback.
- You can use both internal synth and DAW together.

## Interface Overview

- Left panel: piano roll and tension meter.
- Center panel: chord name, notes, voicing details.
- Right panel: voice leading, bass movement, feedback.

## Troubleshooting

### MIDI not detected

- Confirm you are using Chrome/Edge/Opera.
- Reconnect the keyboard and refresh the page.
- Open DevTools and check console errors.

### Port already in use

```bash
lsof -ti:5173 | xargs kill -9
npm start
```

### App does not start

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Useful Commands

```bash
npm start      # dev server
npm run build  # production build
npm run preview
npm run electron
```

## Next Steps

- Learning path: `LEARN_HARMONY.md`
- Technical architecture: `ARCHITECTURE.md`
- Theory resources: `resources/README.md`
- Version history: `CHANGELOG.md`
