import { useEffect, useState } from 'react';
import { useAppStore } from './stores/appStore';
import MIDIManager from './engine/MIDIManager';
import MusicTheory from './engine/MusicTheory';
import AudioEngine from './engine/AudioEngine';
import * as Tone from 'tone';
import ChordDisplay from './components/ChordDisplay';
import PianoRoll from './components/PianoRoll';
import TensionMeter from './components/TensionMeter';
import QuizPanel from './components/QuizPanel';
import LearnChordsPanel from './components/LearnChordsPanel';
import { getScaleChords } from './data/learnChordsData';
import './styles/App.css';

function App() {

  const {
    midiInitialized,
    activeNotes,
    currentAnalysis,
    tension,
    quizActive,
    learnChordsActive,
    keyboardInputEnabled,
    lightTheme,
    setMidiInitialized,
    setMidiDevices,
    setActiveNotes,
    setCurrentAnalysis,
    setVoiceLeadingAnalysis,
    setTension,
    setFeedback,
    setQuizActive,
    setLearnChordsActive,
    resetLearnChords,
    toggleKeyboardInput,
    setLightTheme,
    toggleLightTheme,
  } = useAppStore();

  const [showWelcome, setShowWelcome] = useState(true);
  const [midiError, setMidiError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Load light theme preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('harmony-light-theme');
      if (saved !== null) setLightTheme(JSON.parse(saved));
    } catch (_) {}
  }, [setLightTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', lightTheme ? 'light' : '');
  }, [lightTheme]);

  // Initialize MIDI and preload scale chords
  useEffect(() => {
    initializeMIDI();
    initializeAudio();
    getScaleChords('C major'); // Preload in background
  }, []);

  // Update keyboard input state
  useEffect(() => {
    MIDIManager.setKeyboardEnabled(keyboardInputEnabled);
  }, [keyboardInputEnabled]);

  const initializeMIDI = async () => {
    try {
      await MIDIManager.initialize();
      setMidiInitialized(true);
      setMidiDevices(MIDIManager.getDevices());
      
      if (MIDIManager.getInitError()) {
        setMidiError(MIDIManager.getInitError());
      }

      MIDIManager.subscribe(handleMIDIEvent);
      MIDIManager.onDeviceChange((devices) => {
        setMidiDevices(devices);
      });
    } catch (error) {
      console.error('MIDI initialization failed:', error);
      setMidiError(error.message);
    }
  };

  const refreshMIDI = async () => {
    const devices = await MIDIManager.refreshDevices();
    if (devices) {
      setMidiDevices(devices);
      setMidiError(MIDIManager.getInitError());
    }
  };

  const initializeAudio = async () => {
    try {
      await AudioEngine.initialize();
      setAudioInitialized(true);
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  const handleMIDIEvent = async (event) => {
    if (event.type === 'noteon') {
      if (audioEnabled && audioInitialized) {
        try {
          await AudioEngine.playNote(event.note, event.velocity);
        } catch (error) {
          console.error('Error playing note:', error);
        }
      }
      
      const notes = event.activeNotes;
      setActiveNotes(notes);

      if (notes.length > 0) {
        analyzeChord(notes);
      }
    } else if (event.type === 'noteoff') {
      if (audioEnabled && audioInitialized) {
        try {
          AudioEngine.releaseNote(event.note);
        } catch (error) {
          console.error('Error releasing note:', error);
        }
      }
      
      const notes = event.activeNotes;
      setActiveNotes(notes);

      if (notes.length === 0) {
        setCurrentAnalysis(null);
        setVoiceLeadingAnalysis(null);
        setTension(0);
      } else {
        analyzeChord(notes);
      }
    }
  };

  const analyzeChord = (notes) => {
    // Chord analysis
    const analysis = MusicTheory.analyzeChord(notes);
    setCurrentAnalysis(analysis);

    // Tension calculation
    const tensionValue = MusicTheory.calculateTension(notes);
    setTension(tensionValue);

    // Voice leading analysis
    const voiceLeading = MusicTheory.analyzeVoiceLeading();
    if (voiceLeading) {
      setVoiceLeadingAnalysis(voiceLeading);
    }

    const feedbackData = MusicTheory.generateFeedback(analysis, voiceLeading);
    setFeedback(feedbackData);
  };

  const toggleAudio = async () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    AudioEngine.setEnabled(newState);

    if (newState) {
      try {
        await Tone.start();
      } catch (error) {
        console.error('Failed to start Tone.js:', error);
        return;
      }

      setTimeout(async () => {
        try {
          await AudioEngine.playNote(60, 80);
          setTimeout(() => AudioEngine.releaseNote(60), 500);
        } catch (error) {
          console.error('Test note failed:', error);
        }
      }, 100);
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <button
          className="btn-icon theme-toggle-welcome"
          onClick={toggleLightTheme}
          title={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
          aria-label={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
        >
          {lightTheme ? '☀' : '🌙'}
        </button>
        <div className="welcome-content">
          <h1>Harmony Analyzer</h1>
          <p className="tagline">Real-Time Chord Recognition & Voicing Analysis</p>
          
          <div className="features">
            <div className="feature">
              <span className="icon">01</span>
              <h3>Chord Recognition</h3>
              <p>Instant identification of any chord you play</p>
            </div>
            <div className="feature">
              <span className="icon">02</span>
              <h3>Voicing Analysis</h3>
              <p>Understand your chord voicings, spacing, and register</p>
            </div>
            <div className="feature">
              <span className="icon">03</span>
              <h3>Quiz Mode</h3>
              <p>Practice recognizing chords and inversions</p>
            </div>
          </div>

          {midiError && (
            <div className="error-box">
              <p>MIDI: {midiError}</p>
            </div>
          )}

          {midiInitialized && (
            <div className={MIDIManager.getDevices().inputs.length > 0 ? 'success-box' : 'warning-box'}>
              {MIDIManager.getDevices().inputs.length > 0 ? (
                <>
                  <p>&#10003; MIDI connesso</p>
                  {MIDIManager.getDevices().inputs.map((d, i) => (
                    <p key={i} className="device-name">{d.name} ({d.state})</p>
                  ))}
                </>
              ) : (
                <>
                  <p>Nessun dispositivo MIDI rilevato</p>
                  <p className="hint">
                    Se la tastiera e' collegata ad un altro programma (es. Ableton), 
                    controlla che il browser abbia i permessi MIDI: clicca sull'icona 
                    del lucchetto nella barra degli indirizzi &gt; Permessi &gt; MIDI.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="welcome-buttons">
            <button 
              className="btn-start"
              onClick={() => setShowWelcome(false)}
              disabled={!midiInitialized}
            >
              {midiInitialized ? 'Start Session' : 'Inizializzazione MIDI...'}
            </button>

            {midiInitialized && MIDIManager.getDevices().inputs.length === 0 && (
              <button 
                className="btn-refresh"
                onClick={refreshMIDI}
              >
                Refresh MIDI
              </button>
            )}
          </div>

          {!MIDIManager.isAvailable() && (
            <p className="warning">
              Web MIDI API non supportata. Usa Chrome, Edge o Opera.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (learnChordsActive) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Harmony Analyzer</h1>
          <div className="header-controls">
            <button 
              className={`btn-icon ${lightTheme ? 'active' : ''}`}
              onClick={toggleLightTheme}
              title={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
              aria-label={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
            >
              {lightTheme ? '☀' : '🌙'}
            </button>
            <button 
              className={`btn-toggle ${keyboardInputEnabled ? 'active' : ''}`}
              onClick={toggleKeyboardInput}
              aria-pressed={keyboardInputEnabled}
              title={keyboardInputEnabled ? 'Disable Keyboard Input' : 'Enable Keyboard Input'}
            >
              Keys
            </button>
            <button 
              className={`btn-toggle ${audioEnabled ? 'active' : ''}`}
              onClick={toggleAudio}
              aria-pressed={audioEnabled}
              disabled={!audioInitialized}
              title={audioEnabled ? 'Disable synth' : 'Enable synth'}
            >
              {audioEnabled ? 'Synth On' : 'Synth Off'}
            </button>
            <button 
              className="btn-icon active"
              onClick={resetLearnChords}
              title="Esci da Impara gli Accordi"
            >
              Esci
            </button>
          </div>
        </header>

        <div className="app-layout simple two-column">
          <div className="left-panel">
            <PianoRoll 
              activeNotes={activeNotes} 
              analysis={currentAnalysis}
              theme={lightTheme ? 'light' : 'dark'}
            />
            <TensionMeter tension={tension} />
          </div>

          <div className="center-panel full-width">
            <LearnChordsPanel />
          </div>
        </div>

        <footer className="app-footer">
          <div className="status">
            {midiInitialized ? (
              <>
                <span className="status-dot active"></span>
                <span>MIDI Connected | {activeNotes.length} note(s) active</span>
              </>
            ) : (
              <>
                <span className="status-dot inactive"></span>
                <span>MIDI Disconnected</span>
              </>
            )}
          </div>
          {currentAnalysis && (
            <div className="current-chord">
              {currentAnalysis.chordName}
            </div>
          )}
          <div className="audio-status">
            {audioEnabled && 'Synth Active'}
          </div>
        </footer>
      </div>
    );
  }

  if (quizActive) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Harmony Analyzer</h1>
          <div className="header-controls">
            <button 
              className={`btn-icon ${lightTheme ? 'active' : ''}`}
              onClick={toggleLightTheme}
              title={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
              aria-label={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
            >
              {lightTheme ? '☀' : '🌙'}
            </button>
            <button 
              className={`btn-toggle ${keyboardInputEnabled ? 'active' : ''}`}
              onClick={toggleKeyboardInput}
              aria-pressed={keyboardInputEnabled}
              title={keyboardInputEnabled ? 'Disable Keyboard Input' : 'Enable Keyboard Input (A/W/S/E/D/F/T/G/Y/H/U/J/K)'}
            >
              Keys
            </button>
            <button 
              className={`btn-toggle ${audioEnabled ? 'active' : ''}`}
              onClick={toggleAudio}
              aria-pressed={audioEnabled}
              disabled={!audioInitialized}
              title={audioEnabled ? 'Disable synth' : 'Enable synth'}
            >
              {audioEnabled ? 'Synth On' : 'Synth Off'}
            </button>
            <button 
              className="btn-icon active"
              onClick={() => setQuizActive(false)}
              title="Exit Quiz Mode"
            >
              Exit Quiz
            </button>
          </div>
        </header>

        <div className="app-layout simple two-column">
          <div className="left-panel">
            <PianoRoll 
              activeNotes={activeNotes} 
              analysis={currentAnalysis}
              theme={lightTheme ? 'light' : 'dark'}
            />
            <TensionMeter tension={tension} />
          </div>

          <div className="center-panel full-width">
            <QuizPanel />
          </div>
        </div>

        <footer className="app-footer">
          <div className="status">
            {midiInitialized ? (
              <>
                <span className="status-dot active"></span>
                <span>MIDI Connected | {activeNotes.length} note(s) active</span>
              </>
            ) : (
              <>
                <span className="status-dot inactive"></span>
                <span>MIDI Disconnected</span>
              </>
            )}
          </div>
          {currentAnalysis && (
            <div className="current-chord">
              {currentAnalysis.chordName}
            </div>
          )}
          <div className="audio-status">
            {audioEnabled && 'Synth Active'}
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
        <header className="app-header">
          <h1>Harmony Analyzer</h1>
          <div className="header-controls">
            <button 
              className={`btn-icon ${lightTheme ? 'active' : ''}`}
              onClick={toggleLightTheme}
              title={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
              aria-label={lightTheme ? 'Tema scuro' : 'Tema chiaro'}
            >
              {lightTheme ? '☀' : '🌙'}
            </button>
            <button 
              className={`btn-toggle ${keyboardInputEnabled ? 'active' : ''}`}
              onClick={toggleKeyboardInput}
              aria-pressed={keyboardInputEnabled}
              title={keyboardInputEnabled ? 'Disable Keyboard Input' : 'Enable Keyboard Input (A/W/S/E/D/F/T/G/Y/H/U/J/K)'}
            >
              Keys
            </button>
            <button 
              className={`btn-toggle ${learnChordsActive ? 'active' : ''}`}
              onClick={() => { setQuizActive(false); setLearnChordsActive(true); }}
              aria-pressed={learnChordsActive}
              title="Impara gli accordi della scala (Do maggiore)"
            >
              Impara Accordi
            </button>
            <button 
              className={`btn-toggle ${quizActive ? 'active' : ''}`}
              onClick={() => { setLearnChordsActive(false); setQuizActive(!quizActive); }}
              aria-pressed={quizActive}
              title="Start Chord Quiz"
            >
              Quiz Mode
            </button>
            <button 
              className={`btn-toggle ${audioEnabled ? 'active' : ''}`}
              onClick={toggleAudio}
              aria-pressed={audioEnabled}
              disabled={!audioInitialized}
              title={audioEnabled ? 'Disable synth' : 'Enable synth'}
            >
              {audioEnabled ? 'Synth On' : 'Synth Off'}
            </button>
            
            <button 
              className="btn-icon"
              onClick={() => MusicTheory.clearHistory()}
              title="Clear History"
            >
              Clear
            </button>
            <button 
              className="btn-icon"
              onClick={() => setShowWelcome(true)}
              title="Back to Welcome"
            >
              Home
            </button>
          </div>
        </header>

      <div className="app-layout simple two-column">
        {/* Left Panel - Piano Roll & Tension */}
        <div className="left-panel">
          <PianoRoll
            activeNotes={activeNotes}
            analysis={currentAnalysis}
            theme={lightTheme ? 'light' : 'dark'}
          />
          <TensionMeter tension={tension} />
        </div>

        {/* Center Panel - Chord Display (full width) */}
        <div className="center-panel full-width">
          <ChordDisplay analysis={currentAnalysis} />
        </div>
      </div>

      <footer className="app-footer">
        <div className="status">
          {midiInitialized ? (
            <>
              <span className="status-dot active"></span>
              <span>MIDI Connected | {activeNotes.length} note(s) active</span>
            </>
          ) : (
            <>
              <span className="status-dot inactive"></span>
              <span>MIDI Disconnected</span>
            </>
          )}
        </div>
        {currentAnalysis && (
          <div className="current-chord">
            {currentAnalysis.chordName}
          </div>
        )}
        <div className="audio-status">
          {audioEnabled && 'Synth Active'}
        </div>
      </footer>
    </div>
  );
}

export default App;
