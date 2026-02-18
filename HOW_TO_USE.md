# 🎹 How to Use - Harmony Analyzer

## Quick Start

### 1. Open App
```bash
cd /Users/pier/Coding/harmony.teacher
npm start
```

Browser opens at **http://localhost:5173**

### 2. Click "Start Analyzing"
Welcome screen shows MIDI status, then click the button.

### 3. Choose Audio Mode

#### Option A: Internal Synth (Standalone)
1. Click **"🔇 Synth OFF"** button (top right)
2. It turns **"🔊 Synth ON"** (green with glow)
3. Play keyboard → hear detuned saw synth
4. Close Ableton if open

#### Option B: External Audio (Ableton/DAW)
1. Keep synth OFF
2. Open Ableton/your DAW
3. Create MIDI track listening to your keyboard
4. Play → hear Ableton, see analysis in browser

#### Option C: Both!
1. Enable synth ON
2. Keep Ableton open
3. Hear both synth + your VST
4. Useful for comparison

---

## What You See

### Left Panel
**Piano Roll**
- Shows active notes color-coded
- Visual feedback of what you're playing

**Tension Meter**
- 0-10 scale
- Green (consonant) → Yellow → Orange → Red (dissonant)
- Real-time tension calculation

### Center Panel (Main Display)
**Chord Name** (big!)
- Instant chord recognition
- 150+ chord types supported

**Notes**
- Individual notes you're playing
- Spaced for readability

**Voicing Badges**
- 🔓 **Open** / 🔒 **Close** voicing
- ⭐ **Drop Voicing** (when detected)
- **Range** in semitones

**Voicing Details**
- **Bass note**: Lowest note
- **Top note**: Highest note
- **Spacing**: Clusters, 4ths, 3rds detected

### Right Panel
**Voice Leading** (when changing chords)
- Smoothness: ★★★★★ rating
- Shared tones count
- Chromatic movement ✓
- Contrary motion ✓

**Bass Movement**
- Type: pedal / chromatic / stepwise / leap
- Direction: ascending / descending / static
- Interval in semitones

**Voicing Analysis**
- Type: close / open
- Range
- Drop voicing detection

**Register Distribution**
- Low / Mid / High note count
- Muddy bass warning (if too close in low register)

**Feedback**
- ✓ Compliments (what you did well)
- 💡 Suggestions (improvements)

---

## Examples

### Example 1: Basic Major Chord
Play: **C E G**

**See**:
- Chord: "C"
- Voicing: Close (4 + 3 semitones)
- Tension: ~1/10 (consonant)
- Register: Balanced

### Example 2: Seventh Chord
Play: **D F A C**

**See**:
- Chord: "Dm7"
- Voicing: Close or Open (depends on octaves)
- Tension: ~2/10 (mild)
- Notes: D F A C

### Example 3: Drop Voicing
Play: **G (low) B F D (high)**

**See**:
- Chord: "G7"
- ⭐ **Drop Voicing** badge!
- Voicing: Open
- Range: ~19 semitones

### Example 4: Tension Build
Play: **C E G B D F#**

**See**:
- Chord: "Cmaj13#11" (or similar complex)
- Tension: ~7-8/10 (high!)
- Meter turns red
- Clusters detected

### Example 5: Progression Analysis
Play: **Dm7** → **G7**

**See** (Right Panel):
- Shared tones: 2 (D and F)
- Smoothness: ★★★★☆
- Voice leading: Good contrary motion

---

## Tips

### 🎵 For Chord Recognition
- Play at least 3 notes for meaningful chords
- Try different voicings of same chord (C E G vs G C E)
- Experiment with extensions (9ths, 11ths, 13ths)

### 🎨 For Voicing Study
- Play same chord in different octaves
- Try drop voicings (move 2nd from top down an octave)
- Watch the "Open" vs "Close" badge change
- Check when "Drop Voicing" appears

### 📊 For Voice Leading
- Play progression slowly (let each chord analyze)
- Watch smoothness rating
- Try to maximize shared tones
- Use contrary motion (bass down, top up)

### 🔊 For Synth
- Toggle on/off to compare with Ableton sounds
- Use as reference pitch when composing
- Quick sketch without opening DAW
- Solo practice tool

---

## Keyboard Shortcuts

- **F12**: Open browser console (debug)
- **Cmd+R / Ctrl+R**: Reload app
- **Cmd+Shift+R**: Hard reload (clear cache)

---

## Troubleshooting

### Synth Not Working?
1. Click anywhere on page (enables Web Audio)
2. Check browser console for errors
3. Make sure toggle is ON (green)

### MIDI Not Responding?
1. Unplug/replug keyboard
2. Refresh browser
3. Check console for "MIDI Connected"

### Wrong Chord Detected?
- Some complex voicings may be ambiguous
- Try root position for clearer recognition
- Check if notes are all sounding (MIDI stuck?)

### Analysis Laggy?
- Close other tabs/apps
- Disable browser extensions
- Use Chrome (best performance)

---

## Use Cases

### 1. Learning Voicings
Play different inversions and watch voicing change:
- C E G (root position, close)
- E G C (1st inversion, close)  
- G C E (2nd inversion, open)

### 2. Composing Progressions
Build a progression and watch voice leading:
- Am7 → Dm7 → G7 → Cmaj7
- Check smoothness ratings
- Adjust voicings for better flow

### 3. Analyzing Tracks
Play along with your favorite tracks:
- Identify chords in real-time
- Study voicing choices
- Learn tension/release patterns

### 4. Practice Tool
Use as a chord practice companion:
- Solo practice with synth on
- Immediate feedback on what you play
- No need to open DAW

---

## Advanced: Understanding the Analysis

### Tension Algorithm
Based on interval dissonance:
- Tritone (6 semitones): Max tension (10)
- Minor 2nd (1): Very tense (8)
- Major 2nd (2): Moderate (5)
- Perfect 5th (7): Consonant (0)

All intervals in chord summed, normalized 0-10.

### Voice Leading Smoothness
Average movement distance:
- ≤2 semitones: ★★★★★ (stepwise)
- ≤4: ★★★★☆
- ≤7: ★★★☆☆
- ≤12: ★★☆☆☆
- >12: ★☆☆☆☆ (large leaps)

### Drop Voicing Detection
When one interval >12 semitones and others <12, likely a drop voicing.

### Muddy Bass
If notes in low register (<C3) are spaced ≤4 semitones apart, flagged as muddy.

---

**Have fun analyzing! 🎹**
