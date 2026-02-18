# 🎹 Harmony Teacher - Project Summary

## 🎯 What We Built

An **interactive MIDI harmony training application** that analyzes your keyboard playing in real-time and teaches you advanced harmonic concepts used in electronic music production.

---

## ✨ Key Features Implemented

### 1. Real-Time MIDI Analysis Engine
- **Chord Recognition** - Identifies any chord you play (maj, min, 7th, extended, etc.)
- **Voice Leading Analysis** - Tracks how your voices move between chords
- **Tension Calculation** - Measures harmonic tension (0-10 scale) based on interval content
- **Voicing Analysis** - Detects close/open voicing, drop voicings, register distribution
- **Bass Movement Tracking** - Identifies pedal points, chromatic movement, leaps

### 2. Intelligent Feedback System
Real-time suggestions and compliments:
- ✅ "Great contrary motion between voices!"
- ⚠️ "Low register is muddy. Try spacing bass notes wider."
- 💡 "Nice chromatic movement detected."
- ⭐ Smoothness rating (0-5 stars)

### 3. Guided Exercise System
**10 exercises across 5 modules:**

**Voice Leading**
- Shared Tones Connection
- Contrary Motion

**Chromatic Movement**
- Chromatic Approach
- Chromatic Bass Walk

**Voicing Techniques**
- Register Awareness
- Open vs Close Voicing

**Bass Construction**
- Pedal Point mastery

**Tension Architecture**
- Build Tension
- Tension and Release

Each exercise has:
- Clear instructions
- Target chords (if applicable)
- Custom evaluation function
- Instant scoring

### 4. Visual Feedback Components
- **Piano Roll** - Shows active notes color-coded by voice
- **Tension Meter** - Visual bar with color gradient (green → yellow → red)
- **Feedback Panel** - Detailed analysis of voice leading, bass, voicing, register
- **Exercise Panel** - Progress tracking and scoring

### 5. Modern Desktop App
- Built with **Electron + React**
- Dark theme with gradients
- Responsive layout (3-column grid)
- Smooth animations

---

## 🏗️ Technical Architecture

### Tech Stack
- **Electron** - Desktop app framework
- **React 18** - UI components
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **Web MIDI API** - MIDI input/output
- **Tonal.js** - Music theory library
- **Canvas API** - Piano roll visualization

### Core Modules

1. **MIDIManager** (`src/engine/MIDIManager.js`)
   - Handles Web MIDI API
   - Parses NoteOn/NoteOff messages
   - Maintains active notes state
   - Event subscription system

2. **MusicTheory Engine** (`src/engine/MusicTheory.js`)
   - Chord analysis (using Tonal library)
   - Tension calculation (interval-based algorithm)
   - Voice leading analysis (movement tracking, shared tones)
   - Bass movement detection
   - Feedback generation

3. **Exercise System** (`src/exercises/exerciseDefinitions.js`)
   - Data-driven exercise definitions
   - Custom evaluation functions
   - Modular organization (5 categories)
   - Progressive difficulty (beginner → advanced)

4. **App Store** (`src/stores/appStore.js`)
   - Centralized state management
   - MIDI state, analysis results, exercise progress
   - 50-item chord history

5. **UI Components** (`src/components/`)
   - PianoRoll - Canvas-based visualization
   - TensionMeter - Real-time tension display
   - FeedbackPanel - Analysis breakdown
   - ExercisePanel - Exercise selection & evaluation

---

## 📊 How It Works (Data Flow)

```
1. User plays chord on MIDI keyboard
        ↓
2. Web MIDI API captures NoteOn messages
        ↓
3. MIDIManager parses and stores active notes
        ↓
4. App component receives MIDI event
        ↓
5. MusicTheory.analyzeChord() runs
        ↓
6. Results stored in Zustand store
        ↓
7. React components re-render with new data
        ↓
8. User sees instant visual feedback
```

**Key Algorithms:**

**Tension Calculation**
```
For each note pair in chord:
  - Calculate interval (mod 12)
  - Map to tension value:
    * Tritone (6) = 10 points (max)
    * Minor 2nd (1) = 8 points
    * Major 2nd (2) = 5 points
    * Consonances (3,4,5,7,8,9) = 0-3 points
  
Normalize: (sum / maxPossible) * 10
```

**Voice Leading Analysis**
```
For each voice in previous chord:
  - Find closest voice in current chord
  - Calculate movement distance
  - Track direction (up/down/static)

Analyze:
  - Shared tones (same pitch class)
  - Chromatic movement (±1 semitone)
  - Contrary motion (opposite directions)
  - Smoothness score (avg distance)
```

**Voicing Detection**
```
Calculate intervals between adjacent notes:
  - If max interval > 7 semitones → "open"
  - If max interval > 12 and only one → "drop voicing"
  - If avg interval <= 5 → "close"

Register distribution:
  - Low (< MIDI 48), Mid (48-72), High (> 72)
  - Muddy bass check: close intervals in low register
```

---

## 🎓 Theory Foundation

All concepts based on professional harmony resources:

**Resources Downloaded** (`resources/` folder):
1. **Chromatic Part Writing** - Cross-relations, resolution rules
2. **Shared Tones & Chromaticism** - Common note technique
3. **Voicing Principles** - Register, spacing, drop voicings
4. **Bass Lines with Chord Tones** - Foundation → embellishment
5. **Non-Chord Tones** - Suspensions, pedal points

**Key Concepts Implemented:**
- Voice leading rules (shared tones, contrary motion)
- Chromatic resolution (raised → up, lowered → down)
- Register awareness (muddy bass detection)
- Tension/release cycles
- Pedal point technique

---

## 🎮 User Experience Flow

### First Launch
1. **Welcome Screen**
   - Feature overview
   - MIDI initialization status
   - "Start Learning" button

### Main Interface
**Left Panel**
- Piano Roll (visual representation)
- Tension Meter (0-10 scale)

**Center Panel**
- Exercise list (when no exercise selected)
- Exercise details (when active)
- Evaluate & Next buttons
- Score display

**Right Panel**
- Real-time analysis
- Voice leading stats
- Bass movement info
- Voicing breakdown
- Feedback (compliments & suggestions)

### Exercise Flow
1. Select exercise
2. Read instructions
3. Play on MIDI keyboard
4. Watch real-time feedback
5. Click "Evaluate"
6. Receive score + feedback
7. Next exercise or try again

---

## 📈 Scoring System

Each exercise has custom evaluation function that checks:
- **Voice Leading Quality** (smoothness, shared tones, motion type)
- **Technical Accuracy** (correct voicing, register, bass movement)
- **Concept Mastery** (e.g., chromatic movement detected, pedal point maintained)

**Points awarded:**
- Perfect execution: 80-100 points
- Good technique: 50-79 points
- Needs improvement: 0-49 points

**Cumulative Score:**
- Builds across all exercises
- Displayed in exercise header
- Future: Leaderboard, achievements

---

## 🎨 Design Highlights

### Color System
- **Background**: Dark theme (#1a1a1a, #252525)
- **Accents**: 
  - Red (#ff6b6b) - High tension, warnings
  - Teal (#4ecdc4) - Success, consonance
  - Blue (#45b7d1) - Information
  - Yellow (#f7dc6f) - Moderate tension, tips

### Visual Feedback
- **Tension bar** changes color: Green → Yellow → Orange → Red
- **Active notes** on piano roll color-coded by voice (4 colors)
- **Feedback panels** have contextual borders (success/warning)
- **Smooth animations** for all state changes

### Typography
- System fonts (native feel)
- Clear hierarchy (1.5rem → 1.3rem → 1.1rem)
- Monospace for code/note names

---

## 🚀 How to Run

### Quick Start
```bash
cd /Users/pier/Coding/harmony.teacher
npm start
```

### Manual Steps
```bash
# 1. Install dependencies (first time)
npm install

# 2. Start dev server + Electron
npm run dev

# 3. Or use start script
./start.sh
```

### What Happens
1. Vite dev server starts on http://localhost:5173
2. Electron window opens automatically
3. Hot module replacement enabled (instant updates)
4. Open DevTools with Cmd+Option+I (Mac)

---

## 📁 Project Structure

```
harmony.teacher/
├── main.js                      # Electron entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
│
├── src/
│   ├── main.jsx                 # React entry
│   ├── App.jsx                  # Main component
│   ├── engine/                  # Core logic
│   │   ├── MIDIManager.js       # MIDI handling
│   │   └── MusicTheory.js       # Harmony analysis
│   ├── stores/
│   │   └── appStore.js          # Zustand state
│   ├── exercises/
│   │   └── exerciseDefinitions.js
│   ├── components/              # UI components
│   └── styles/                  # CSS files
│
├── resources/                   # Theory PDFs (markdown)
│
├── README.md                    # User documentation
├── ARCHITECTURE.md              # Technical deep-dive
├── QUICK_START.md               # 3-step launch guide
└── PROJECT_SUMMARY.md           # This file
```

---

## 🎯 What Makes This Special

### 1. Real-Time Learning
Unlike static tutorials, this app analyzes **YOUR playing** instantly. No guessing - immediate feedback.

### 2. Theory-Driven
Not random exercises. Every concept comes from professional harmony resources, adapted for electronic music.

### 3. Modular & Extensible
- Add new exercises easily (data-driven)
- Extend analysis engine (modular functions)
- Customize UI (React components)

### 4. Electronic Music Focus
Traditional harmony books teach classical rules. This app focuses on techniques used by electronic producers:
- Pedal points (hypnotic basslines)
- Chromatic movement (tension in techno/house)
- Voicing for synths (not just piano)
- Modal ambiguity

---

## 🔮 Future Roadmap

### Phase 2 (Next Steps)
- [ ] Audio playback (play target chords with Tone.js)
- [ ] Recording system (multi-track MIDI loop)
- [ ] More exercises (10+ per module)
- [ ] Progress tracking & stats dashboard
- [ ] Chord history visualization (timeline)

### Phase 3 (Advanced)
- [ ] AI-powered suggestions (GPT integration)
- [ ] Progression database (real tracks deconstructed)
- [ ] Community features (share progressions)
- [ ] Style analysis (identify which producer you sound like)

### Phase 4 (Pro)
- [ ] VST plugin version (use in DAW)
- [ ] Mobile companion app
- [ ] Cloud sync (cross-device)
- [ ] Multiplayer (collaborative learning)

---

## 🎓 Educational Value

### Concepts You'll Master

**Beginner Level:**
- How to connect chords smoothly
- What creates harmonic tension
- Why some voicings sound muddy
- Basic bass line construction

**Intermediate Level:**
- Chromatic movement for tension
- Contrary motion technique
- Drop voicings for modern sound
- Pedal point mastery

**Advanced Level:**
- Complex tension architecture
- Modal interchange
- Voice leading with many voices
- Harmonic rhythm control

### Skills Developed
- **Ear training** (hearing tension/release)
- **Muscle memory** (voicing patterns)
- **Theoretical knowledge** (why it works)
- **Creative application** (using in your music)

---

## 💡 Use Cases

### 1. Producer Learning Harmony
"I make techno but don't understand chords. This app shows me **real-time** what I'm doing right/wrong."

### 2. Piano Player Learning Electronic Style
"I know classical piano but want to learn pedal points and chromatic bass like Guy Gerber."

### 3. Music Theory Student
"My textbook is boring. This app makes **voice leading** interactive and fun."

### 4. Composition Tool
"I use this **while producing** to check if my progressions are smooth."

---

## 🎉 What You Can Do Right Now

### Experiment!

**Try This Progression:**
1. Play **Am** (A C E)
2. Play **Am/G** (A C E with G in bass) - Pedal point effect!
3. Play **F/A** (F A C with A in bass) - Descending bass
4. Watch the analysis - see shared tones, bass movement, smoothness score

**Build Tension:**
1. Play **C major triad** (C E G) - Low tension
2. Add **D** (creates major 2nd) - Moderate tension
3. Add **F#** (creates tritone) - High tension!
4. Watch tension meter go red

**Voice Leading Challenge:**
1. Play **Dm7** → **G7** with shared tones (D and F)
2. Try to get 5-star smoothness
3. Compare to version with large leaps

---

## 🏆 Success Metrics

The app is successful if:
- ✅ **Instant feedback** - No lag in MIDI analysis
- ✅ **Actionable insights** - Suggestions improve your playing
- ✅ **Progressive learning** - Beginner → Advanced path clear
- ✅ **Engaging** - Want to keep practicing
- ✅ **Applicable** - Use concepts in your music

---

## 🙏 Credits

**Theory Resources:**
- LearnMusicTheory.net
- ScoreChanges.com  
- Luis Robles - Classical Tonal Harmony
- Berkeley Online

**Technologies:**
- Electron team
- React team
- Tonal.js (Danigb)
- Web MIDI API community

**Inspiration:**
- Electronic music producers (Ferry Corsten, Guy Gerber, Gregor Tresher, Petar Dundov)
- Harmony educators worldwide

---

## 📞 Support

**Questions?** Check:
1. README.md - User guide
2. ARCHITECTURE.md - Technical docs
3. QUICK_START.md - Launch help
4. resources/ - Theory concepts

**Issues?** Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant

---

## 🎵 Final Thoughts

This is not just a **MIDI app** - it's a **harmony teacher** that:
- Listens to you
- Analyzes intelligently
- Gives instant feedback
- Teaches progressively
- Makes theory practical

**Ready to start?**

```bash
npm start
```

**Happy learning! 🎹**

---

**Built with ❤️ for electronic music producers who want to master harmony.**
