# 🎹 Harmony Analyzer - Changelog

## Version 0.2.0 - Simplified Analyzer (2026-01-27)

### 🎵 NEW: Optional Internal Synth
- **Detuned Saw Synthesizer** with Tone.js
  - 2 oscillators with 15 cents spread (slight detune)
  - Smooth envelope (0.01s attack, 0.5s release)
  - Polyphonic (play multiple notes)
- **Toggle Button** in header to enable/disable synth
  - 🔊 Synth ON (green with glow)
  - 🔇 Synth OFF (gray)
- **Works independently** from Ableton or other DAWs
- **Web Audio API** - click anywhere to start audio context

### 🎯 SIMPLIFIED: Focus on Chord Analysis
- **Removed** exercise system (no more scoring, no exercise selection)
- **New main display**: Large chord name with voicing badges
- **Clean 3-panel layout**:
  - Left: Piano Roll + Tension Meter
  - Center: Chord Display (big!)
  - Right: Analysis Feedback

### ✨ Enhanced Chord Display
Shows:
- **Chord name** (huge display)
- **Notes** (with spacing)
- **Voicing type** badges:
  - 🔓 Open / 🔒 Close
  - ⭐ Drop Voicing (when detected)
  - Range in semitones
- **Voicing details**:
  - Bass note
  - Top note  
  - Spacing type (clusters, 4ths, 3rds)

### 🔧 Technical Changes
- New `AudioEngine.js` - Tone.js synth manager
- New `ChordDisplay.jsx` - Focused chord view
- Simplified `App.simple.jsx` - No exercise logic
- Fixed Tonal import error (removed `Distance`)
- Added `ErrorBoundary` for better error handling

---

## Version 0.1.0 - Initial Release (2026-01-27)

### Features
- MIDI input via Web MIDI API
- Real-time chord recognition (150+ chord types)
- Voice leading analysis
- Tension calculation (0-10 scale)
- Voicing analysis (close/open, drop voicings)
- Bass movement tracking
- Exercise system (10 exercises, 5 modules)
- Piano roll visualization
- Feedback panel with suggestions

---

## How to Use New Version

### 1. Start App
```bash
npm start
```

### 2. Click "Start Analyzing"

### 3. Enable Synth (optional)
- Click **"🔇 Synth OFF"** button in header
- It becomes **"🔊 Synth ON"** (green)
- Now hear your chords!

### 4. Play Chords
- With Ableton closed: Use internal synth
- With Ableton open: Use both (synth + your VST)

### 5. Watch Analysis
- **Center**: Chord name + voicing
- **Right**: Voice leading, register, feedback
- **Left**: Piano roll + tension

---

## What Changed

### Before (v0.1.0)
```
Layout: Piano Roll | Exercise List | Feedback
Focus: Learning exercises with scoring
Audio: None (need Ableton)
```

### After (v0.2.0)
```
Layout: Piano Roll | Chord Display | Feedback
Focus: Real-time analysis and understanding
Audio: Optional internal synth (detuned saw)
```

---

## Benefits

✅ **Simpler**: No exercise complexity, just play and analyze
✅ **Faster**: Focus immediately on your chords
✅ **Flexible**: Audio on/off as needed
✅ **Professional**: Big chord display like a tuner
✅ **Standalone**: Can use without Ableton

---

## Known Limitations

- Synth is basic (detuned saw only)
- No reverb/effects (yet)
- No MIDI out (only synth playback)
- No recording (yet)

---

## Future Ideas

- Multiple synth types (saw, square, sine)
- Reverb/delay effects
- Volume control
- MIDI recording/playback
- Chord history timeline
- Export analysis to JSON

---

## Files Changed

**New Files:**
- `src/engine/AudioEngine.js`
- `src/components/ChordDisplay.jsx`
- `src/styles/ChordDisplay.css`
- `src/App.simple.jsx`
- `src/ErrorBoundary.jsx`

**Modified Files:**
- `src/main.jsx` - Uses App.simple now
- `src/engine/MusicTheory.js` - Fixed import
- `src/styles/App.css` - Added toggle styles
- `package.json` - Changed start script

**Preserved Files:**
- `src/App.jsx` - Original with exercises (backup)
- All resources in `resources/` folder
- All theory PDFs

---

**Enjoy the simplified analyzer! 🎹**
