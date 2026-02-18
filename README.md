# 🎹 Harmony Analyzer

**Real-Time MIDI Chord Recognition & Voicing Analysis**

An intelligent application that analyzes your MIDI keyboard in real-time, providing instant chord recognition, voicing analysis, and harmonic feedback. Includes optional internal synthesizer.

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🎵 Real-Time Chord Recognition
- Instant identification of 150+ chord types
- Large, clear chord display
- Note names with proper spacing
- Works with any voicing

### 🔊 Optional Internal Synthesizer
- **Detuned saw synth** (2 oscillators, 15 cents spread)
- Toggle on/off with button
- Polyphonic (multiple notes)
- Smooth envelope
- **Use standalone** or with your DAW

### 🎨 Voicing Analysis
- **Open vs Close** detection
- **Drop voicing** identification (⭐ badge)
- **Range** in semitones
- **Bass & Top** note display
- **Spacing** analysis (clusters, 4ths, 3rds)

### 📊 Harmonic Analysis
- **Tension meter** (0-10 scale, color-coded)
- **Voice leading** tracking (smoothness, shared tones)
- **Bass movement** analysis (pedal, chromatic, stepwise)
- **Register distribution** (muddy bass warnings)
- **Real-time feedback** (compliments & suggestions)

### 🎹 Visual Feedback
- **Piano roll** with color-coded active notes
- **Tension bar** (green → yellow → red)
- **Voicing badges** (Open/Close/Drop)
- Clean 3-panel layout

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- A MIDI keyboard
- Chrome, Edge, or Opera browser (Web MIDI API support required)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd /Users/pier/Coding/harmony.teacher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Connect your MIDI keyboard**
   - Plug in your MIDI keyboard via USB
   - Ensure it's recognized by your system

4. **Start the application**
   ```bash
   npm start
   ```

   This will:
   - Start Vite dev server (React frontend)
   - Launch Electron app automatically
   - Open at http://localhost:5173 in development

### Alternative: Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🎹 How to Use

### 1. Start the App
```bash
npm start
```
Browser opens at http://localhost:5173

### 2. Click "Start Analyzing"
Wait for MIDI initialization, then click the button.

### 3. Choose Audio Mode

**Option A: Internal Synth** (standalone)
- Click "🔇 Synth OFF" button → becomes "🔊 Synth ON"
- Play keyboard → hear detuned saw synth
- No DAW needed!

**Option B: External Audio** (with Ableton/DAW)
- Keep synth OFF
- Open your DAW with MIDI track
- Play → hear your VST, see analysis

**Option C: Both!**
- Synth ON + Ableton open
- Hear both simultaneously

### 4. Play Chords
- Play any chord on your MIDI keyboard
- Watch instant analysis:
  - **Center**: Chord name + voicing badges
  - **Left**: Piano roll + tension meter
  - **Right**: Voice leading + feedback

### 5. Explore Voicings
- Try different inversions
- Watch voicing type change (Open/Close)
- Find drop voicings (⭐ badge)
- Experiment with extensions (9ths, 11ths, 13ths)

---

## 🧠 Core Concepts

### Voice Leading Analysis
The app analyzes how your voices move between chords:
- **Shared Tones**: Common notes between chords (smooth)
- **Chromatic Movement**: Half-step motion (creates tension)
- **Contrary Motion**: Voices moving in opposite directions (smooth)
- **Smoothness Score**: 0-5 stars based on average voice movement distance

### Tension Calculation
Harmonic tension measured 0-10 based on:
- **Tritones** (maximum tension: 10)
- **Minor 2nds** (extreme dissonance: 8)
- **Major 2nds** (moderate dissonance: 5)
- **Consonant intervals** (3rds, 5ths, octaves: 0-2)

### Voicing Analysis
- **Close vs Open voicing**: Note spacing detection
- **Drop voicings**: Identifies drop 2, drop 3 patterns
- **Register distribution**: Low/mid/high note count
- **Muddy bass detection**: Warns when low notes are too close

### Bass Movement Types
- **Pedal**: Same bass note (0 semitones)
- **Chromatic**: Half-step movement (1 semitone)
- **Stepwise**: Whole-step movement (2 semitones)
- **By-fourth-fifth**: 5 or 7 semitones
- **Leap**: Larger intervals

---

## 📁 Project Structure

```
harmony.teacher/
├── main.js                 # Electron main process
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── index.html              # Entry HTML
│
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   │
│   ├── components/         # UI components
│   │   ├── PianoRoll.jsx
│   │   ├── TensionMeter.jsx
│   │   ├── FeedbackPanel.jsx
│   │   └── ExercisePanel.jsx
│   │
│   ├── engine/             # Core logic
│   │   ├── MusicTheory.js  # Harmony analysis engine
│   │   └── MIDIManager.js  # MIDI input handler
│   │
│   ├── stores/             # State management
│   │   └── appStore.js     # Zustand store
│   │
│   ├── exercises/          # Exercise system
│   │   └── exerciseDefinitions.js
│   │
│   └── styles/             # CSS files
│       ├── index.css
│       ├── App.css
│       ├── PianoRoll.css
│       ├── TensionMeter.css
│       ├── FeedbackPanel.css
│       └── ExercisePanel.css
│
└── resources/              # Theory resources (PDFs converted to markdown)
    ├── 01-chromatic-part-writing.md
    ├── 02-shared-tones-chromaticism.md
    ├── 03-voicings-principles.md
    ├── 04-bass-lines-chord-tones.md
    └── 05-non-chord-tones.md
```

---

## 🎓 Exercise Modules

### 1. Voice Leading (vl-xxx)
- Shared Tones Connection
- Contrary Motion

### 2. Chromatic (chr-xxx)
- Chromatic Approach
- Chromatic Bass Walk

### 3. Voicing (voi-xxx)
- Register Awareness
- Open vs Close Voicing

### 4. Bass Construction (bas-xxx)
- Pedal Point

### 5. Tension (ten-xxx)
- Build Tension
- Tension and Release

---

## 🔧 Technologies Used

### Frontend
- **React 18** - UI framework
- **Zustand** - State management
- **Vite** - Build tool & dev server

### Desktop
- **Electron** - Desktop app framework

### Music
- **Web MIDI API** - MIDI input/output
- **Tone.js** - Audio synthesis (future: playback)
- **Tonal** - Music theory library (chord detection, note manipulation)

### Styling
- **Custom CSS** - Modern dark theme with gradients

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ MIDI input system
- ✅ Real-time chord analysis
- ✅ Voice leading detection
- ✅ Tension calculation
- ✅ Exercise framework
- ✅ Basic UI

### Phase 2 (Next)
- [ ] Audio playback (play target chords)
- [ ] Recording & loop system
- [ ] More exercises (10+ per module)
- [ ] Progress tracking & statistics
- [ ] User profiles

### Phase 3 (Future)
- [ ] AI-powered suggestions (GPT integration)
- [ ] Community features (share progressions)
- [ ] Progression database (deconstructed from real tracks)
- [ ] VST plugin version
- [ ] Mobile companion app

---

## 🐛 Troubleshooting

### MIDI Not Detected
- Ensure your MIDI keyboard is connected via USB
- Try unplugging and replugging the keyboard
- Check browser console for errors
- Verify Web MIDI API support: https://caniuse.com/midi

### App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Electron Window Blank
- Check if Vite dev server is running on port 5173
- Open browser DevTools in Electron window
- Look for console errors

---

## 📚 Theory Resources

The `resources/` folder contains harmony theory concepts extracted from professional sources:
- Chromatic part writing rules
- Shared tones & chromaticism
- Voicing principles (register, spacing, drop voicings)
- Bass line construction techniques
- Non-chord tones (suspensions, pedal points)

These concepts directly inform the exercise design and analysis algorithms.

---

## 🤝 Contributing

Contributions welcome! Areas to help:
- More exercise definitions
- UI/UX improvements
- Additional music theory algorithms
- Bug fixes
- Documentation

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Acknowledgments

Theory resources sourced from:
- LearnMusicTheory.net
- ScoreChanges.com
- Luis Robles - Introduction to Classical Tonal Harmony
- Various music theory educators

---

## 💬 Contact

For questions, suggestions, or bug reports, open an issue on GitHub.

---

**Happy Learning! 🎵**
