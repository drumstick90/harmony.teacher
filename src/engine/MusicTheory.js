import { Chord, Note, Interval } from 'tonal';

/**
 * Music Theory Engine
 * Core logic for harmony analysis, voice leading, and tension calculation
 */

export class MusicTheoryEngine {
  constructor() {
    this.currentChord = null;
    this.previousChord = null;
    this.history = [];
  }

  /**
   * Analyze a set of MIDI notes and determine chord
   * @param {number[]} midiNotes - Array of MIDI note numbers
   * @returns {Object} Chord analysis
   */
  analyzeChord(midiNotes) {
    if (!midiNotes || midiNotes.length === 0) {
      return null;
    }

    // Convert MIDI numbers to note names
    const noteNames = midiNotes.map(midi => Note.fromMidi(midi));
    
    // Check for special cases
    const specialCase = this.detectSpecialCases(midiNotes, noteNames);
    
    let chordName, alternatives, confidence;
    
    if (specialCase) {
      // Special case detected (cluster, incomplete, etc.)
      chordName = specialCase.name;
      alternatives = specialCase.alternatives || [];
      confidence = specialCase.confidence;
    } else {
      // Standard chord detection
      const detected = Chord.detect(noteNames);
      const triadFallback = this.detectBasicTriad(midiNotes);
      chordName = this.formatChordName(detected[0] || triadFallback || 'Unknown');
      alternatives = detected.slice(1, 3).map(name => this.formatChordName(name));
      confidence = this.calculateConfidence(midiNotes, noteNames, chordName);
    }
    
    // Analyze inversion
    const inversion = this.analyzeInversion(midiNotes, noteNames, chordName);
    
    // Analyze voicing
    const voicing = this.analyzeVoicing(midiNotes, noteNames);
    
    // Calculate register distribution
    const register = this.analyzeRegister(midiNotes);
    
    const analysis = {
      notes: noteNames,
      midiNotes: midiNotes.sort((a, b) => a - b),
      chordName,
      alternatives,
      confidence,
      inversion,
      voicing,
      register,
      timestamp: Date.now(),
    };

    // Store in history
    this.previousChord = this.currentChord;
    this.currentChord = analysis;
    this.history.push(analysis);

    return analysis;
  }

  /**
   * Fallback detection for basic major/minor triads.
   * Handles enharmonic spellings robustly via pitch classes.
   */
  detectBasicTriad(midiNotes) {
    const uniquePitchClasses = [...new Set(midiNotes.map(note => ((note % 12) + 12) % 12))];
    if (uniquePitchClasses.length < 3) return null;

    // Try each pitch class as a possible root and detect triad intervals.
    for (const rootPc of uniquePitchClasses) {
      const intervals = uniquePitchClasses.map(pc => (pc - rootPc + 12) % 12);
      const hasMinorTriad = intervals.includes(0) && intervals.includes(3) && intervals.includes(7);
      const hasMajorTriad = intervals.includes(0) && intervals.includes(4) && intervals.includes(7);

      if (!hasMinorTriad && !hasMajorTriad) continue;

      const rootMidi = 60 + rootPc;
      const rootName = Note.pitchClass(Note.fromMidi(rootMidi));

      if (hasMinorTriad) return `${rootName}m`;
      if (hasMajorTriad) return rootName;
    }

    return null;
  }

  /**
   * Format chord name (replace M with Maj)
   */
  formatChordName(name) {
    if (!name) return name;
    
    // Replace standalone M with Maj (but not in maj, min, etc.)
    // Handle cases like "CM7" → "Cmaj7", "FM" → "Fmaj"
    return name
      .replace(/^([A-G][#b]?)M([^a-z]|$)/, '$1maj$2') // Start: CM → Cmaj
      .replace(/([A-G][#b]?)M([^a-z])/g, '$1maj$2')   // Middle: /AM → /Amaj
      .replace(/M7/g, 'maj7')                          // M7 → maj7
      .replace(/M9/g, 'maj9')                          // M9 → maj9
      .replace(/M11/g, 'maj11')                        // M11 → maj11
      .replace(/M13/g, 'maj13');                       // M13 → maj13
  }

  /**
   * Analyze chord inversion (root position, 1st, 2nd, 3rd)
   */
  analyzeInversion(midiNotes, noteNames, chordName) {
    if (!chordName || midiNotes.length < 3) return null;
    
    // Get bass note (lowest note)
    const sorted = [...midiNotes].sort((a, b) => a - b);
    const bassNote = Note.fromMidi(sorted[0]);
    const bassPitchClass = Note.pitchClass(bassNote);
    
    // Get chord root (remove slash chords and qualities)
    const rootMatch = chordName.match(/^([A-G][#b]?)/);
    if (!rootMatch) return null;
    
    const rootNote = rootMatch[1];
    const rootPitchClass = Note.pitchClass(rootNote);
    
    // Get all pitch classes in chord
    const pitchClasses = noteNames.map(n => Note.pitchClass(n));
    const uniquePitchClasses = [...new Set(pitchClasses)];
    
    // Determine inversion
    if (bassPitchClass === rootPitchClass) {
      return {
        type: 'root',
        position: 'Root Position',
        bassNote,
        description: 'Bass is the root',
      };
    }
    
    // Check if it's a known slash chord (already indicated in name)
    if (chordName.includes('/')) {
      return {
        type: 'slash',
        position: 'Slash Chord',
        bassNote,
        description: `${bassNote} in bass`,
      };
    }
    
    // Try to determine inversion by bass note position in triad/seventh
    // This is a simplified approach
    const bassIndex = uniquePitchClasses.findIndex(pc => pc === bassPitchClass);
    const rootIndex = uniquePitchClasses.findIndex(pc => pc === rootPitchClass);
    
    if (bassIndex === -1 || rootIndex === -1) {
      return {
        type: 'unknown',
        position: 'Unknown',
        bassNote,
        description: 'Cannot determine inversion',
      };
    }
    
    // Calculate position relative to root
    const relativePosition = (bassIndex - rootIndex + uniquePitchClasses.length) % uniquePitchClasses.length;
    
    if (relativePosition === 0) {
      return {
        type: 'root',
        position: 'Root Position',
        bassNote,
        description: 'Bass is the root',
      };
    } else if (relativePosition === 1 && uniquePitchClasses.length >= 3) {
      return {
        type: 'first',
        position: '1st Inversion',
        bassNote,
        description: 'Third in bass',
      };
    } else if (relativePosition === 2 && uniquePitchClasses.length >= 3) {
      return {
        type: 'second',
        position: '2nd Inversion',
        bassNote,
        description: 'Fifth in bass',
      };
    } else if (relativePosition === 3 && uniquePitchClasses.length >= 4) {
      return {
        type: 'third',
        position: '3rd Inversion',
        bassNote,
        description: 'Seventh in bass',
      };
    }
    
    return {
      type: 'other',
      position: 'Extended Inversion',
      bassNote,
      description: `${bassNote} in bass`,
    };
  }

  /**
   * Detect special cases (clusters, incomplete chords, etc.)
   */
  detectSpecialCases(midiNotes, noteNames) {
    const sorted = [...midiNotes].sort((a, b) => a - b);
    
    // Too few notes
    if (sorted.length === 1) {
      return {
        name: noteNames[0],
        confidence: 100,
        alternatives: [],
      };
    }
    
    if (sorted.length === 2) {
      const interval = sorted[1] - sorted[0];
      const intervalName = interval === 7 ? 'Perfect 5th' : 
                          interval === 5 ? 'Perfect 4th' :
                          interval === 4 ? 'Major 3rd' :
                          interval === 3 ? 'Minor 3rd' : 'Interval';
      return {
        name: `${noteNames[0]} ${intervalName}`,
        confidence: 60,
        alternatives: ['Incomplete chord'],
      };
    }
    
    // Cluster detection (all notes within 2 semitones of each other)
    const intervals = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      intervals.push(sorted[i + 1] - sorted[i]);
    }
    
    const isCluster = intervals.every(i => i <= 2);
    if (isCluster && sorted.length >= 3) {
      return {
        name: `Cluster (${noteNames.join(' ')})`,
        confidence: 95,
        alternatives: ['Tone cluster'],
      };
    }
    
    // Scale fragment detection (5+ consecutive notes)
    if (sorted.length >= 5) {
      const isScaleLike = intervals.every(i => i <= 3);
      if (isScaleLike) {
        return {
          name: `Scale fragment (${noteNames[0]}–${noteNames[noteNames.length - 1]})`,
          confidence: 85,
          alternatives: ['Linear harmony'],
        };
      }
    }
    
    return null; // No special case
  }

  /**
   * Calculate confidence score for chord recognition
   */
  calculateConfidence(midiNotes, noteNames, chordName) {
    let confidence = 100;
    const sorted = [...midiNotes].sort((a, b) => a - b);
    
    // Calculate intervals
    const intervals = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      intervals.push(sorted[i + 1] - sorted[i]);
    }
    
    // Penalties
    
    // Too many notes (likely scale/cluster, not chord)
    if (sorted.length > 7) {
      confidence -= 20;
    } else if (sorted.length > 5) {
      confidence -= 10;
    }
    
    // No thirds (chords are built on thirds)
    const hasThirds = intervals.some(i => i === 3 || i === 4);
    if (!hasThirds && sorted.length > 2) {
      confidence -= 15;
    }
    
    // Too many alterations in name (complex = less certain)
    const alterations = (chordName.match(/[#b]/g) || []).length;
    confidence -= alterations * 3;
    
    // Very long name = unusual chord
    if (chordName.length > 10) {
      confidence -= 10;
    }
    
    // "add" chords are less common
    if (chordName.includes('add')) {
      confidence -= 5;
    }
    
    // Slash chords (inversions) are less "pure"
    if (chordName.includes('/')) {
      confidence -= 8;
    }
    
    // Unknown chord = zero confidence
    if (chordName === 'Unknown') {
      confidence = 0;
    }
    
    // Bonus for common chords
    const isCommon = /^[A-G][#b]?(maj|min|m|M|aug|dim|sus)?[247]?$/.test(chordName);
    if (isCommon) {
      confidence += 10;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Analyze voicing characteristics
   */
  analyzeVoicing(midiNotes, noteNames) {
    if (midiNotes.length < 2) return null;

    const sorted = [...midiNotes].sort((a, b) => a - b);
    const bass = sorted[0];
    const top = sorted[sorted.length - 1];
    const range = top - bass;

    // Calculate intervals between adjacent notes
    const intervals = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      intervals.push(sorted[i + 1] - sorted[i]);
    }

    // Determine voicing type
    const maxInterval = Math.max(...intervals);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    let voicingType = 'close';
    if (maxInterval > 7 || avgInterval > 5) {
      voicingType = 'open';
    }

    // Check for drop voicing patterns
    const isDropVoicing = maxInterval > 12 && intervals.filter(i => i > 12).length === 1;

    return {
      type: voicingType,
      range,
      intervals,
      bass: Note.fromMidi(bass),
      top: Note.fromMidi(top),
      isDropVoicing,
      spacing: this.categorizeSpacing(intervals),
    };
  }

  /**
   * Categorize interval spacing quality
   */
  categorizeSpacing(intervals) {
    const hasMinor2nd = intervals.some(i => i === 1);
    const hasMajor2nd = intervals.some(i => i === 2);
    const hasMinor3rd = intervals.some(i => i === 3);
    const hasMajor3rd = intervals.some(i => i === 4);
    const hasPerfect4th = intervals.some(i => i === 5);

    return {
      hasMinor2nd,
      hasMajor2nd,
      hasMinor3rd,
      hasMajor3rd,
      hasPerfect4th,
      hasClusters: intervals.filter(i => i <= 2).length >= 2,
    };
  }

  /**
   * Analyze register distribution (muddy bass check)
   */
  analyzeRegister(midiNotes) {
    const sorted = [...midiNotes].sort((a, b) => a - b);
    
    // Define register boundaries (C2 = 36, C3 = 48, C4 = 60, C5 = 72)
    const LOW_REGISTER_MAX = 48; // C below middle C
    const MID_REGISTER_MAX = 72; // F above middle C
    
    const lowNotes = sorted.filter(n => n < LOW_REGISTER_MAX);
    const midNotes = sorted.filter(n => n >= LOW_REGISTER_MAX && n < MID_REGISTER_MAX);
    const highNotes = sorted.filter(n => n >= MID_REGISTER_MAX);

    // Check for muddy bass (close intervals in low register)
    let isMuddy = false;
    if (lowNotes.length >= 2) {
      const lowIntervals = [];
      for (let i = 0; i < lowNotes.length - 1; i++) {
        lowIntervals.push(lowNotes[i + 1] - lowNotes[i]);
      }
      isMuddy = lowIntervals.some(interval => interval <= 4); // 3rd or smaller
    }

    return {
      low: lowNotes.length,
      mid: midNotes.length,
      high: highNotes.length,
      isMuddy,
      distribution: this.describeDistribution(lowNotes.length, midNotes.length, highNotes.length),
    };
  }

  describeDistribution(low, mid, high) {
    if (mid > low && mid > high) return 'mid-centered';
    if (low > mid && low > high) return 'bass-heavy';
    if (high > mid && high > low) return 'treble-heavy';
    return 'balanced';
  }

  /**
   * Calculate harmonic tension (0-10 scale)
   */
  calculateTension(midiNotes) {
    if (!midiNotes || midiNotes.length < 2) return 0;

    let tension = 0;
    const sorted = [...midiNotes].sort((a, b) => a - b);

    // Check all interval combinations (not just adjacent)
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const interval = (sorted[j] - sorted[i]) % 12; // Reduce to single octave
        
        // Tension values for intervals
        const tensionMap = {
          0: 0,   // Unison (perfect consonance)
          1: 8,   // Minor 2nd (extreme dissonance)
          2: 5,   // Major 2nd (moderate dissonance)
          3: 2,   // Minor 3rd (mild consonance)
          4: 1,   // Major 3rd (consonance)
          5: 3,   // Perfect 4th (mild consonance)
          6: 10,  // Tritone (maximum tension!)
          7: 0,   // Perfect 5th (perfect consonance)
          8: 2,   // Minor 6th (mild consonance)
          9: 1,   // Major 6th (consonance)
          10: 4,  // Minor 7th (moderate dissonance)
          11: 3,  // Major 7th (moderate dissonance)
        };

        tension += tensionMap[interval] || 0;
      }
    }

    // Normalize to 0-10 scale based on number of notes
    const maxPossibleTension = sorted.length * (sorted.length - 1) / 2 * 10;
    const normalizedTension = (tension / maxPossibleTension) * 10;

    return Math.min(Math.round(normalizedTension * 10) / 10, 10);
  }

  /**
   * Analyze voice leading from previous chord
   */
  analyzeVoiceLeading() {
    if (!this.previousChord || !this.currentChord) {
      return null;
    }

    const prevNotes = this.previousChord.midiNotes;
    const currNotes = this.currentChord.midiNotes;

    // Find voice movements (simplified algorithm)
    const movements = this.calculateVoiceMovements(prevNotes, currNotes);
    
    // Analyze movement quality
    const analysis = {
      movements,
      sharedTones: this.findSharedTones(prevNotes, currNotes),
      chromaticMovement: this.hasChromaticMovement(movements),
      contraryMotion: this.hasContraryMotion(movements),
      parallelFifths: this.detectParallelFifths(prevNotes, currNotes),
      smoothness: this.calculateSmoothness(movements),
    };

    return analysis;
  }

  /**
   * Calculate voice movements between two chords
   * Uses Hungarian algorithm approximation for voice assignment
   */
  calculateVoiceMovements(prevNotes, currNotes) {
    const movements = [];
    const used = new Set();

    // Simple greedy algorithm: match closest notes
    prevNotes.forEach(prevNote => {
      let closest = null;
      let minDistance = Infinity;

      currNotes.forEach((currNote, idx) => {
        if (!used.has(idx)) {
          const distance = Math.abs(currNote - prevNote);
          if (distance < minDistance) {
            minDistance = distance;
            closest = { note: currNote, idx };
          }
        }
      });

      if (closest) {
        used.add(closest.idx);
        movements.push({
          from: prevNote,
          to: closest.note,
          interval: closest.note - prevNote,
          distance: Math.abs(closest.note - prevNote),
        });
      }
    });

    return movements;
  }

  /**
   * Find shared tones (common notes) between chords
   */
  findSharedTones(prevNotes, currNotes) {
    const prevPitchClasses = prevNotes.map(n => n % 12);
    const currPitchClasses = currNotes.map(n => n % 12);
    
    const shared = prevPitchClasses.filter(pc => currPitchClasses.includes(pc));
    return [...new Set(shared)]; // Remove duplicates
  }

  /**
   * Check if there's chromatic movement (half-step)
   */
  hasChromaticMovement(movements) {
    return movements.some(m => Math.abs(m.interval) === 1);
  }

  /**
   * Check for contrary motion (voices moving in opposite directions)
   */
  hasContraryMotion(movements) {
    if (movements.length < 2) return false;
    
    const upward = movements.filter(m => m.interval > 0).length;
    const downward = movements.filter(m => m.interval < 0).length;
    
    return upward > 0 && downward > 0;
  }

  /**
   * Detect parallel fifths (generally avoided in classical voice leading)
   */
  detectParallelFifths(prevNotes, currNotes) {
    // Simplified check: look for two voices maintaining a perfect 5th
    for (let i = 0; i < prevNotes.length - 1; i++) {
      for (let j = i + 1; j < prevNotes.length; j++) {
        const prevInterval = (prevNotes[j] - prevNotes[i]) % 12;
        
        if (prevInterval === 7) { // Perfect 5th in prev chord
          // Check if same voices maintain 5th in current chord
          for (let x = 0; x < currNotes.length - 1; x++) {
            for (let y = x + 1; y < currNotes.length; y++) {
              const currInterval = (currNotes[y] - currNotes[x]) % 12;
              if (currInterval === 7) {
                // Both chords have fifths, check if parallel
                const prevMotion = prevNotes[j] - prevNotes[i];
                const currMotion = currNotes[y] - currNotes[x];
                if (Math.sign(prevMotion) === Math.sign(currMotion)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Calculate smoothness score (0-5 stars)
   */
  calculateSmoothness(movements) {
    if (!movements || movements.length === 0) return 0;

    const avgDistance = movements.reduce((sum, m) => sum + m.distance, 0) / movements.length;
    
    // Score based on average distance
    if (avgDistance <= 2) return 5; // Excellent (stepwise motion)
    if (avgDistance <= 4) return 4; // Good
    if (avgDistance <= 7) return 3; // Moderate
    if (avgDistance <= 12) return 2; // Fair
    return 1; // Large leaps
  }

  /**
   * Detect bass movement type
   */
  analyzeBassMovement() {
    if (!this.previousChord || !this.currentChord) return null;

    const prevBass = Math.min(...this.previousChord.midiNotes);
    const currBass = Math.min(...this.currentChord.midiNotes);
    const movement = currBass - prevBass;

    let type = 'leap';
    if (movement === 0) type = 'pedal';
    else if (Math.abs(movement) === 1) type = 'chromatic';
    else if (Math.abs(movement) <= 2) type = 'stepwise';
    else if (Math.abs(movement) === 5 || Math.abs(movement) === 7) type = 'by-fourth-fifth';

    return {
      movement,
      semitones: Math.abs(movement),
      direction: movement > 0 ? 'ascending' : movement < 0 ? 'descending' : 'static',
      type,
    };
  }

  /**
   * Generate feedback suggestions
   */
  generateFeedback(analysis, voiceLeading) {
    const suggestions = [];
    const compliments = [];

    // Register feedback
    if (analysis?.register?.isMuddy) {
      suggestions.push({
        type: 'warning',
        message: 'Low register is muddy. Try spacing bass notes wider apart.',
        concept: 'register',
      });
    }

    // Voice leading feedback
    if (voiceLeading) {
      if (voiceLeading.smoothness >= 4) {
        compliments.push({
          type: 'success',
          message: 'Excellent voice leading! Very smooth connection.',
          concept: 'voice-leading',
        });
      }

      if (voiceLeading.chromaticMovement) {
        compliments.push({
          type: 'info',
          message: 'Nice chromatic movement detected.',
          concept: 'chromaticism',
        });
      }

      if (voiceLeading.sharedTones.length > 0) {
        compliments.push({
          type: 'info',
          message: `Found ${voiceLeading.sharedTones.length} shared tone(s). Creates smooth connection.`,
          concept: 'shared-tones',
        });
      }

      if (voiceLeading.parallelFifths) {
        suggestions.push({
          type: 'tip',
          message: 'Parallel fifths detected. In classical style, try contrary or oblique motion.',
          concept: 'voice-leading',
        });
      }

      if (voiceLeading.contraryMotion) {
        compliments.push({
          type: 'success',
          message: 'Great contrary motion between voices!',
          concept: 'voice-leading',
        });
      }
    }

    return { suggestions, compliments };
  }

  /**
   * Get recent history
   */
  getHistory(count = 10) {
    return this.history.slice(-count);
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = [];
    this.currentChord = null;
    this.previousChord = null;
  }
}

export default new MusicTheoryEngine();
