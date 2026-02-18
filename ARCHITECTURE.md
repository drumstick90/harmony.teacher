# 🏗️ Architecture Documentation

## System Overview

Harmony Teacher is built as an **Electron + React** desktop application with a modular, event-driven architecture for real-time MIDI processing and music theory analysis.

---

## 🎯 Core Architecture Principles

1. **Separation of Concerns**: Engine logic (music theory) is independent of UI components
2. **Real-Time Processing**: MIDI events trigger immediate analysis without blocking UI
3. **Modular Exercises**: Exercise system is data-driven and easily extensible
4. **Reactive State**: Zustand store provides centralized state with minimal re-renders

---

## 📊 Data Flow

```
MIDI Keyboard
     ↓
Web MIDI API
     ↓
MIDIManager (event handler)
     ↓
App Component (MIDI event listener)
     ↓
MusicTheory Engine (analysis)
     ↓
Zustand Store (state update)
     ↓
React Components (UI update)
```

### Detailed Flow

1. **MIDI Input**
   - User plays notes on MIDI keyboard
   - Web MIDI API captures NoteOn/NoteOff messages
   - MIDIManager parses MIDI data and maintains active note state

2. **Analysis Pipeline**
   ```javascript
   activeNotes → analyzeChord() → {
     - Chord detection (using Tonal library)
     - Voicing analysis (close/open, drop voicings)
     - Register distribution (low/mid/high)
     - Tension calculation (interval-based)
   }
   ```

3. **Voice Leading Analysis** (requires 2+ chords)
   ```javascript
   previousChord + currentChord → analyzeVoiceLeading() → {
     - Voice movement calculation
     - Shared tone detection
     - Chromatic movement detection
     - Contrary motion detection
     - Parallel fifths check
     - Smoothness scoring
   }
   ```

4. **Bass Movement Analysis**
   ```javascript
   previousBass + currentBass → analyzeBassMovement() → {
     - Movement distance (semitones)
     - Direction (ascending/descending/static)
     - Type (pedal/chromatic/stepwise/leap)
   }
   ```

5. **Feedback Generation**
   ```javascript
   analysis + voiceLeading → generateFeedback() → {
     suggestions: [warnings, tips],
     compliments: [successes]
   }
   ```

6. **State Update**
   - Results stored in Zustand store
   - React components automatically re-render with new data

---

## 🧩 Module Breakdown

### 1. MIDIManager (`src/engine/MIDIManager.js`)

**Responsibilities**:
- Initialize Web MIDI API access
- Listen to all connected MIDI devices
- Parse MIDI messages (NoteOn, NoteOff, CC)
- Maintain active notes state
- Notify subscribers of MIDI events

**Key Methods**:
```javascript
initialize()           // Request MIDI access
handleMIDIMessage()    // Parse incoming MIDI data
subscribe(callback)    // Register event listener
getActiveNotes()       // Return current note array
getDevices()           // List available MIDI devices
```

**Event Types**:
```javascript
{
  type: 'noteon' | 'noteoff' | 'cc' | 'panic',
  note: number,           // MIDI note number (0-127)
  velocity: number,       // 0-127
  activeNotes: number[]   // All currently pressed notes
}
```

---

### 2. MusicTheoryEngine (`src/engine/MusicTheory.js`)

**Responsibilities**:
- Analyze chords from MIDI note arrays
- Calculate harmonic tension
- Analyze voice leading between chords
- Track bass movement
- Generate intelligent feedback

**Key Methods**:

```javascript
analyzeChord(midiNotes)
// Returns: { notes, chordName, voicing, register }

calculateTension(midiNotes)
// Returns: number (0-10)

analyzeVoiceLeading()
// Returns: { movements, sharedTones, chromaticMovement, 
//            contraryMotion, smoothness }

analyzeBassMovement()
// Returns: { movement, direction, type }

generateFeedback(analysis, voiceLeading)
// Returns: { suggestions: [], compliments: [] }
```

**Algorithms**:

1. **Tension Calculation**
   ```
   For each pair of notes in chord:
     - Calculate interval (mod 12)
     - Map interval to tension value:
       * Tritone (6): 10 points
       * Minor 2nd (1): 8 points
       * Major 2nd (2): 5 points
       * Consonances: 0-2 points
   
   Normalize: (totalTension / maxPossibleTension) * 10
   ```

2. **Voice Movement Matching**
   ```
   Greedy algorithm (simplified Hungarian):
   For each note in previousChord:
     - Find closest note in currentChord
     - Calculate movement distance
     - Mark as used
   
   Calculate avg movement distance → smoothness score
   ```

3. **Muddy Bass Detection**
   ```
   If notes in low register (< MIDI 48) AND
      intervals between them <= 4 semitones:
     → Flag as muddy
   ```

---

### 3. App Store (`src/stores/appStore.js`)

**State Shape**:
```javascript
{
  // MIDI
  midiInitialized: boolean,
  midiDevices: { inputs: [], outputs: [] },
  activeNotes: number[],
  
  // Analysis
  currentAnalysis: object | null,
  voiceLeadingAnalysis: object | null,
  tension: number,
  feedback: { suggestions: [], compliments: [] },
  
  // Exercise
  currentExercise: object | null,
  exerciseProgress: number,
  score: number,
  
  // UI
  showPianoRoll: boolean,
  showFeedback: boolean,
  showTheoryPanel: boolean,
  
  // History
  chordHistory: array,
  maxHistoryLength: 50
}
```

**Actions**:
- `setActiveNotes(notes)` - Update active MIDI notes
- `setCurrentAnalysis(analysis)` - Store chord analysis
- `setTension(value)` - Update tension meter
- `setCurrentExercise(exercise)` - Load exercise
- `updateScore(points)` - Add points to score

---

### 4. Exercise System (`src/exercises/exerciseDefinitions.js`)

**Exercise Structure**:
```javascript
{
  id: 'vl-001',
  module: 'voice-leading',
  difficulty: 'beginner',
  title: 'Shared Tones Connection',
  description: 'Connect chords using common notes...',
  instructions: ['Step 1...', 'Step 2...'],
  targetChords: [{ name: 'Dm7', notes: [...] }],
  evaluation: (analysis, voiceLeading, bassMovement, tension) => {
    return {
      points: number,
      feedback: string[]
    }
  }
}
```

**Evaluation Function**:
- Receives current analysis data
- Checks if exercise goals are met
- Returns score and feedback messages
- Can access: analysis, voiceLeading, bassMovement, tension, previousTension

**Module Categories**:
- `voice-leading` - Voice movement exercises
- `chromatic` - Chromatic techniques
- `voicing` - Chord voicing/spacing
- `bass-construction` - Bass line building
- `tension` - Tension/release dynamics

---

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── PianoRoll (left panel)
├── TensionMeter (left panel)
├── ExercisePanel (center panel)
│   ├── ExerciseList (when no exercise selected)
│   └── ExerciseContent (when exercise active)
└── FeedbackPanel (right panel)
    ├── VoiceLeadingStats
    ├── BassMovementStats
    ├── VoicingStats
    ├── RegisterStats
    ├── Compliments
    └── Suggestions
```

### Component Communication

**Props Down**:
```
App → Components (props)
  - activeNotes
  - currentAnalysis
  - voiceLeadingAnalysis
  - tension
  - feedback
```

**Events Up**:
```
Components → App (callbacks)
  - onSelectExercise
  - onEvaluate
```

**Global State** (Zustand):
```
All components can access store directly
  - useAppStore() hook
```

---

## 🎵 Music Theory Algorithms

### Chord Detection
Uses **Tonal.js** library:
```javascript
const noteNames = midiNotes.map(n => Note.fromMidi(n));
const chordName = Chord.detect(noteNames)[0];
```

Tonal handles:
- All common chord types (maj, min, 7, maj7, m7, dim, aug, sus, etc.)
- Extended chords (9, 11, 13)
- Slash chords
- Complex voicings

### Tension Formula

```javascript
tensionMap = {
  0:  0,  // Unison
  1:  8,  // Minor 2nd
  2:  5,  // Major 2nd
  3:  2,  // Minor 3rd
  4:  1,  // Major 3rd
  5:  3,  // Perfect 4th
  6:  10, // Tritone (MAX)
  7:  0,  // Perfect 5th
  8:  2,  // Minor 6th
  9:  1,  // Major 6th
  10: 4,  // Minor 7th
  11: 3   // Major 7th
}

tension = sum of all interval tensions / max possible tension
normalized to 0-10 scale
```

### Smoothness Scoring

```javascript
avgDistance = sum(movementDistances) / voiceCount

if (avgDistance <= 2)  return 5 stars  // Stepwise
if (avgDistance <= 4)  return 4 stars  // Good
if (avgDistance <= 7)  return 3 stars  // Moderate
if (avgDistance <= 12) return 2 stars  // Fair
else                   return 1 star   // Large leaps
```

---

## 🔄 State Management Strategy

### Why Zustand?
- Lightweight (no boilerplate)
- Simple API
- No providers needed
- Good performance (selective re-renders)
- Easy debugging

### Store Design Patterns

1. **Atomic Updates**
   ```javascript
   setTension(value)  // Single value update
   ```

2. **Computed Updates**
   ```javascript
   updateScore: (points) => set((state) => ({ 
     score: state.score + points 
   }))
   ```

3. **Side Effects in Actions**
   ```javascript
   setCurrentAnalysis: (analysis) => {
     set({ currentAnalysis: analysis });
     
     // Auto-add to history
     if (analysis) {
       const { chordHistory, maxHistoryLength } = get();
       const newHistory = [...chordHistory, analysis]
         .slice(-maxHistoryLength);
       set({ chordHistory: newHistory });
     }
   }
   ```

---

## 🎨 UI/UX Design Patterns

### Visual Feedback

1. **Color Coding**
   - **Green** (#4ecdc4): Consonance, success, good technique
   - **Yellow** (#f7dc6f): Moderate tension, warnings
   - **Red** (#ff6b6b): High tension, errors
   - **Blue** (#45b7d1): Information, neutral

2. **Real-Time Updates**
   - Piano roll updates instantly (Canvas API)
   - Tension bar animates smoothly (CSS transitions)
   - Feedback panels slide in (CSS animations)

3. **Progressive Disclosure**
   - Welcome screen → Exercise list → Exercise details
   - Analysis panels show only relevant data
   - Evaluation results auto-dismiss after 5s

### Accessibility
- Keyboard navigation support (TODO)
- High contrast dark theme
- Large touch targets (48px min)
- Clear visual hierarchy

---

## 🔌 Extension Points

### Adding New Exercises

1. Add to `exerciseDefinitions.js`:
```javascript
{
  id: 'new-001',
  module: EXERCISE_MODULES.VOICE_LEADING,
  difficulty: DIFFICULTY.BEGINNER,
  title: 'Your Exercise Name',
  description: '...',
  instructions: ['...'],
  evaluation: (analysis, voiceLeading, bassMovement, tension) => {
    // Your custom logic
    return { points: 0, feedback: [] };
  }
}
```

### Adding New Analysis Features

1. Add method to `MusicTheory.js`:
```javascript
analyzeNewFeature(midiNotes) {
  // Your analysis logic
  return result;
}
```

2. Call in `App.jsx`:
```javascript
const newFeature = MusicTheory.analyzeNewFeature(notes);
```

3. Add to store if needed:
```javascript
// appStore.js
newFeatureData: null,
setNewFeatureData: (data) => set({ newFeatureData: data })
```

4. Display in UI component

### Adding New UI Components

1. Create component in `src/components/`
2. Import in `App.jsx`
3. Add to layout
4. Connect to store with `useAppStore()`

---

## 🚀 Performance Considerations

### Optimizations

1. **MIDI Event Throttling**
   - Currently processes every event
   - Could add debouncing for sustained chords
   - Trade-off: Responsiveness vs CPU usage

2. **Canvas Rendering**
   - Piano roll uses Canvas API (hardware accelerated)
   - Redraws only on note changes
   - No React reconciliation overhead

3. **Analysis Caching**
   - History stored in array (max 50 items)
   - Could add memoization for expensive calculations
   - Trade-off: Memory vs CPU

4. **State Updates**
   - Zustand minimizes re-renders
   - Components subscribe to specific store slices
   - No unnecessary updates

### Bottlenecks to Watch

- **Voice leading calculation** with many notes (O(n²))
- **Tension calculation** with many notes (O(n²))
- **Canvas redraws** with rapid MIDI input
- **History array** growth (currently limited to 50)

---

## 🧪 Testing Strategy (TODO)

### Unit Tests
- MusicTheory methods
- MIDI parsing logic
- Exercise evaluation functions

### Integration Tests
- MIDI → Analysis → State → UI flow
- Exercise scoring
- Feedback generation

### Manual Testing
- MIDI keyboard input
- All exercises
- Edge cases (no notes, many notes, rapid input)

---

## 📦 Build & Deployment

### Development
```bash
npm run dev
```
- Vite dev server: http://localhost:5173
- Hot module replacement (HMR)
- Electron launches automatically

### Production Build
```bash
npm run build
```
- Vite bundles to `dist/`
- Electron packages desktop app
- Platform-specific installers (TODO)

### Future: Distribution
- macOS: DMG installer
- Windows: NSIS installer
- Linux: AppImage, deb, rpm

---

## 🔐 Security Considerations

1. **Web MIDI API**
   - Requires user permission
   - Only works with connected USB devices
   - No network MIDI by default

2. **Electron**
   - `nodeIntegration: true` - Required for MIDI access
   - `contextIsolation: false` - Simplifies MIDI API usage
   - Consider adding CSP for production

3. **Data Storage**
   - Currently no persistent storage
   - Future: Use electron-store for user data
   - Encrypt sensitive data if needed

---

## 🛣️ Future Architecture Enhancements

### Phase 2
- **Audio Engine**: Add Tone.js synthesizer for playback
- **Recording System**: Multi-track MIDI recording
- **Undo/Redo**: Command pattern for user actions

### Phase 3
- **Plugin System**: Load exercises from external files
- **Cloud Sync**: Save progress to cloud
- **AI Integration**: GPT-powered suggestions
- **VST Version**: Port to JUCE framework

---

This architecture provides a solid foundation for:
- Real-time MIDI processing
- Extensible exercise system
- Clean separation of concerns
- Scalable codebase

**Questions?** Refer to inline code comments or create an issue.
