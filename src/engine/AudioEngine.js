import * as Tone from 'tone';

/**
 * Audio Engine with detuned saw synth
 */
export class AudioEngine {
  constructor() {
    this.synth = null;
    this.activeNotes = new Map(); // noteNumber -> voice reference
    this.isEnabled = false;
    this.isInitialized = false;
  }

  /**
   * Initialize audio engine
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create polyphonic synth with detuned saw waves
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'sawtooth',
          count: 2,
          spread: 15, // Slight detune
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.8,
          release: 0.2,
        },
        volume: -8, // Slightly quieter
      }).toDestination();

      this.isInitialized = true;
      console.log('🎛️ Audio Engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Enable/disable audio output
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    
    // If disabling, release all active notes
    if (!enabled) {
      this.releaseAll();
    }
  }

  /**
   * Play a note
   */
  async playNote(midiNote, velocity = 100) {
    console.log('AudioEngine.playNote called:', { 
      midiNote, 
      velocity, 
      isEnabled: this.isEnabled, 
      hasSynth: !!this.synth,
      contextState: Tone.context.state 
    });
    
    if (!this.isEnabled) {
      console.warn('Audio not enabled');
      return;
    }
    
    if (!this.synth) {
      console.warn('Synth not initialized');
      return;
    }

    // Start Tone.js context on first interaction
    if (Tone.context.state !== 'running') {
      console.log('Starting Tone.js context...');
      await Tone.start();
      console.log('Tone.js context started:', Tone.context.state);
    }

    const frequency = Tone.Frequency(midiNote, 'midi').toFrequency();
    const velocityNormalized = velocity / 127;

    try {
      console.log(`Playing: ${frequency}Hz at velocity ${velocityNormalized}`);
      this.synth.triggerAttack(frequency, undefined, velocityNormalized);
      this.activeNotes.set(midiNote, frequency);
      console.log('Note triggered successfully');
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  /**
   * Release a note
   */
  releaseNote(midiNote) {
    if (!this.isEnabled || !this.synth) return;

    const frequency = this.activeNotes.get(midiNote);
    if (frequency) {
      try {
        this.synth.triggerRelease(frequency);
        this.activeNotes.delete(midiNote);
      } catch (error) {
        console.error('Error releasing note:', error);
      }
    }
  }

  /**
   * Release all notes
   */
  releaseAll() {
    if (!this.synth) return;

    try {
      this.synth.releaseAll();
      this.activeNotes.clear();
    } catch (error) {
      console.error('Error releasing all notes:', error);
    }
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.activeNotes.clear();
    this.isInitialized = false;
  }
}

export default new AudioEngine();
