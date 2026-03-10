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

console.log('📦 App.jsx - All imports loaded');

function App() {
  console.log('🎨 App component rendering...');

  const {
    midiInitialized,
    activeNotes,
    currentAnalysis,
    voiceLeadingAnalysis,
    tension,
    feedback,
    quizActive,
    learnChordsActive,
    keyboardInputEnabled,
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
    toggleQuiz,
    toggleKeyboardInput,
  } = useAppStore();

  const [bassMovement, setBassMovement] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [midiError, setMidiError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

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
      
      // Subscribe to MIDI events
      MIDIManager.subscribe(handleMIDIEvent);
    } catch (error) {
      console.error('MIDI initialization failed:', error);
      setMidiError(error.message);
    }
  };

  const initializeAudio = async () => {
    try {
      await AudioEngine.initialize();
      setAudioInitialized(true);
      console.log('🔊 Audio engine ready');
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  };

  const handleMIDIEvent = async (event) => {
    // console.log('MIDI Event:', event.type, 'Note:', event.note, 'Audio enabled:', audioEnabled);
    
    if (event.type === 'noteon') {
      // Play audio if enabled
      if (audioEnabled && audioInitialized) {
        // console.log('🎵 Playing note:', event.note, 'velocity:', event.velocity);
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
      // Release audio if enabled
      if (audioEnabled && audioInitialized) {
        // console.log('🎵 Releasing note:', event.note);
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

      // Bass movement analysis
      const bass = MusicTheory.analyzeBassMovement();
      setBassMovement(bass);
    }

    // Generate feedback
    const feedbackData = MusicTheory.generateFeedback(analysis, voiceLeading);
    setFeedback(feedbackData);
  };

  const toggleAudio = async () => {
    const newState = !audioEnabled;
    console.log('🎛️ Toggle audio:', audioEnabled, '→', newState);
    
    // Update state FIRST
    setAudioEnabled(newState);
    
    // Then enable engine
    AudioEngine.setEnabled(newState);
    
    // Log for debugging
    if (newState) {
      console.log('🔊 Synth enabled - State updated to:', newState);
      
      // Start Tone.js context
      try {
        await Tone.start();
        console.log('✅ Tone.js started, context state:', Tone.context.state);
      } catch (error) {
        console.error('❌ Failed to start Tone.js:', error);
        return;
      }
      
      // Test note
      setTimeout(async () => {
        console.log('🎵 Playing test note C4...');
        try {
          await AudioEngine.playNote(60, 80);
          setTimeout(() => AudioEngine.releaseNote(60), 500);
        } catch (error) {
          console.error('❌ Test note failed:', error);
        }
      }, 100);
    } else {
      console.log('🔇 Synth disabled');
    }
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
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
              <p>⚠️ MIDI Error: {midiError}</p>
              <p>Make sure your MIDI keyboard is connected and Web MIDI is supported.</p>
            </div>
          )}

          {midiInitialized && (
            <div className="success-box">
              <p>✓ MIDI Initialized Successfully</p>
              <p>Detected devices: {MIDIManager.getDevices().inputs.length} input(s)</p>
            </div>
          )}

          <button 
            className="btn-start"
            onClick={() => setShowWelcome(false)}
            disabled={!midiInitialized}
          >
            {midiInitialized ? 'Start Session' : 'Initializing MIDI'}
          </button>

          {!MIDIManager.isAvailable() && (
            <p className="warning">
              Web MIDI API not supported in this browser. Try Chrome, Edge, or Opera.
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
