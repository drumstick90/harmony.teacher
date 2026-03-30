/**
 * MIDI Manager
 * Handles MIDI input from keyboard and manages note state
 */

export class MIDIManager {
  constructor() {
    this.midiAccess = null;
    this.activeNotes = new Map();
    this.listeners = new Set();
    this.deviceChangeListeners = new Set();
    this.isInitialized = false;
    this.initError = null;
    this.keyboardEnabled = false;
    this.keyboardOctave = 4;
    this.keyboardMap = {
      KeyA: 0,  // C
      KeyS: 2,  // D
      KeyD: 4,  // E
      KeyF: 5,  // F
      KeyG: 7,  // G
      KeyH: 9,  // A
      KeyJ: 11, // B
      KeyK: 12, // C (next octave)
      KeyW: 1,  // C#
      KeyE: 3,  // D#
      KeyT: 6,  // F#
      KeyY: 8,  // G#
      KeyU: 10, // A#
    };
    this.activeKeyboardNotes = new Map();
  }

  async initialize() {
    this.setupKeyboardListeners();
    this.initError = null;

    if (!navigator.requestMIDIAccess) {
      this.initError = 'Web MIDI API non supportata in questo browser. Usa Chrome, Edge o Opera.';
      console.warn(this.initError);
      this.isInitialized = true;
      return true;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      this.setupInputs();
      this.isInitialized = true;

      const devices = this.getDevices();
      console.log(`MIDI inizializzato: ${devices.inputs.length} input, ${devices.outputs.length} output`);
      devices.inputs.forEach(d => console.log(`  Input: "${d.name}" (${d.state})`));
      
      if (devices.inputs.length === 0) {
        console.warn('Nessun dispositivo MIDI trovato. Collega una tastiera e premi Refresh.');
      }
      return true;
    } catch (error) {
      this.initError = `Accesso MIDI negato: ${error.message}. Controlla i permessi del browser.`;
      console.error(this.initError, error);
      this.isInitialized = true;
      return true;
    }
  }

  async refreshDevices() {
    if (!navigator.requestMIDIAccess) return;

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      this.setupInputs();
      this.initError = null;

      const devices = this.getDevices();
      console.log(`MIDI refresh: ${devices.inputs.length} input trovati`);
      devices.inputs.forEach(d => console.log(`  Input: "${d.name}" (${d.state})`));
      this.notifyDeviceChange();
      return devices;
    } catch (error) {
      this.initError = `Accesso MIDI negato: ${error.message}`;
      console.error('MIDI refresh failed:', error);
      return this.getDevices();
    }
  }

  /**
   * Setup computer keyboard listeners
   */
  setupKeyboardListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Enable/Disable computer keyboard input
   */
  setKeyboardEnabled(enabled) {
    this.keyboardEnabled = enabled;
    if (!enabled) {
      // Release all keyboard notes if disabled
      this.activeKeyboardNotes.forEach((note) => {
        this.handleNoteOff(note);
      });
      this.activeKeyboardNotes.clear();
    }
  }

  /**
   * Handle key down event
   */
  handleKeyDown(event) {
    if (!this.keyboardEnabled || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    const isTypingContext = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    );
    if (isTypingContext) return;

    const code = event.code;

    // Octave control
    if (code === 'KeyZ') {
      event.preventDefault();
      this.keyboardOctave = Math.max(0, this.keyboardOctave - 1);
      return;
    }
    if (code === 'KeyX') {
      event.preventDefault();
      this.keyboardOctave = Math.min(8, this.keyboardOctave + 1);
      return;
    }

    // Note input
    if (this.keyboardMap.hasOwnProperty(code)) {
      event.preventDefault();
      if (this.activeKeyboardNotes.has(code)) return;
      
      const noteOffset = this.keyboardMap[code];
      const note = (this.keyboardOctave + 1) * 12 + noteOffset;
      this.activeKeyboardNotes.set(code, note);
      this.handleNoteOn(note, 100); // Default velocity 100
    }
  }

  /**
   * Handle key up event
   */
  handleKeyUp(event) {
    if (!this.keyboardEnabled) return;

    const code = event.code;

    if (this.keyboardMap.hasOwnProperty(code)) {
      event.preventDefault();
      const note = this.activeKeyboardNotes.get(code);
      if (note === undefined) return;
      
      this.activeKeyboardNotes.delete(code);
      this.handleNoteOff(note);
    }
  }

  /**
   * Setup MIDI input handlers
   */
  setupInputs() {
    if (!this.midiAccess) return;

    this.midiAccess.inputs.forEach(input => {
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    });

    this.midiAccess.onstatechange = (event) => {
      const { name, state, type } = event.port;
      console.log(`MIDI device ${state}: "${name}" (${type})`);
      if (state === 'connected' && type === 'input') {
        event.port.onmidimessage = this.handleMIDIMessage.bind(this);
      }
      this.notifyDeviceChange();
    };
  }

  /**
   * Handle incoming MIDI messages
   */
  handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;
    const command = status >> 4;
    const channel = status & 0x0f;

    // Note On (command 9) or Note Off (command 8)
    if (command === 9 && velocity > 0) {
      this.handleNoteOn(note, velocity);
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      this.handleNoteOff(note);
    }

    // Control Change (command 11) - for pedals, mod wheel, etc.
    if (command === 11) {
      this.handleControlChange(note, velocity); // note = CC number, velocity = value
    }
  }

  /**
   * Handle note on
   */
  handleNoteOn(note, velocity) {
    this.activeNotes.set(note, velocity);
    this.notifyListeners({
      type: 'noteon',
      note,
      velocity,
      activeNotes: this.getActiveNotes(),
    });
  }

  /**
   * Handle note off
   */
  handleNoteOff(note) {
    this.activeNotes.delete(note);
    this.notifyListeners({
      type: 'noteoff',
      note,
      activeNotes: this.getActiveNotes(),
    });
  }

  /**
   * Handle control change (sustain pedal, etc.)
   */
  handleControlChange(cc, value) {
    this.notifyListeners({
      type: 'cc',
      cc,
      value,
    });
  }

  /**
   * Get currently active notes
   */
  getActiveNotes() {
    return Array.from(this.activeNotes.keys()).sort((a, b) => a - b);
  }

  /**
   * Subscribe to MIDI events
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Get list of available MIDI devices
   */
  getDevices() {
    if (!this.midiAccess) return { inputs: [], outputs: [] };

    const inputs = Array.from(this.midiAccess.inputs.values()).map(input => ({
      id: input.id,
      name: input.name,
      manufacturer: input.manufacturer,
      state: input.state,
    }));

    const outputs = Array.from(this.midiAccess.outputs.values()).map(output => ({
      id: output.id,
      name: output.name,
      manufacturer: output.manufacturer,
      state: output.state,
    }));

    return { inputs, outputs };
  }

  /**
   * Clear all active notes (panic button)
   */
  panic() {
    this.activeNotes.clear();
    this.notifyListeners({
      type: 'panic',
      activeNotes: [],
    });
  }

  isAvailable() {
    return !!navigator.requestMIDIAccess;
  }

  getInitError() {
    return this.initError;
  }

  onDeviceChange(callback) {
    this.deviceChangeListeners.add(callback);
    return () => this.deviceChangeListeners.delete(callback);
  }

  notifyDeviceChange() {
    const devices = this.getDevices();
    this.deviceChangeListeners.forEach(cb => cb(devices));
  }
}

export default new MIDIManager();
