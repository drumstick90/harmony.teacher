# UI Reimagine Guide (Ableton x Late-00s)

## Visual Pillars

- Workflow-first UI with restrained styling.
- Dark studio planes, crisp separators, low-gloss controls.
- Semantic accents only for musical state and confidence.
- Dense but readable information hierarchy.

## Anti-Patterns Avoided

- No decorative gradients dominating content.
- No oversized glow/neon effects.
- No bounce-heavy or playful motion language.
- No mismatched control families across screens.

## Token System

Defined in `src/styles/index.css`:

- **Surface roles**: `--bg-primary`, `--bg-secondary`, `--bg-panel`, `--bg-raised`.
- **Typography roles**: `--text-primary`, `--text-secondary`, `--text-dim`.
- **Structure roles**: `--border`, `--border-dark`, `--edge-light`, `--edge-dark`.
- **Musical accents**: `--warm-intervals`, `--warm-chords`, `--warm-scales`, `--warm-active`.
- **State colors**: `--state-on`, `--state-mid`, `--state-hot`, `--state-alert`.

## Screen Blueprint

- **Welcome**
  - Hero title and short utility tagline.
  - Three compact feature cards.
  - Session CTA and MIDI state boxes with consistent shell style.
- **Analysis**
  - Utility header with compact controls.
  - Left panel for live visual meters.
  - Center panel prioritizing chord identity and voicing.
  - Footer for persistent status telemetry.
- **Quiz**
  - Reuses analysis shell.
  - Target chord remains dominant visual element.
  - Feedback and controls stay compact and semantic.

## Component Language

- Unified button shell for toggle, icon, start, and quiz controls.
- Single panel chrome pattern for all major containers.
- Badge/chip styles normalized to tokenized state colors.
- Meter and confidence indicators now use semantic state roles.

## Migration Checklist

- [x] Global token and dark theme foundation in `src/styles/index.css`.
- [x] Header/layout/footer/welcome shell harmonized in `src/styles/App.css`.
- [x] `ChordDisplay` visual rhythm and badge states aligned.
- [x] `PianoRoll` canvas colors mapped to CSS tokens.
- [x] `TensionMeter` state palette and motion timing aligned.
- [x] `QuizPanel` hierarchy, spacing, and controls aligned.
- [x] UI copy/icon cleanup in `src/App.jsx` and `src/components/QuizPanel.jsx`.
