import { create } from 'zustand';

/**
 * Global application state
 */
export const useAppStore = create((set, get) => ({
  // MIDI state
  midiInitialized: false,
  midiDevices: { inputs: [], outputs: [] },
  activeNotes: [],
  
  // Analysis state
  currentAnalysis: null,
  voiceLeadingAnalysis: null,
  tension: 0,
  feedback: { suggestions: [], compliments: [] },
  
  // Exercise state
  currentExercise: null,
  exerciseProgress: 0,
  score: 0,
  
  // Quiz state
  quizActive: false,
  quizTargetChord: null,
  quizScore: 0,
  quizFeedback: null, // 'correct' | 'incorrect' | null
  quizStreak: 0,

  // Learn Chords state (Impara gli Accordi)
  learnChordsActive: false,
  learnChordsScale: 'C major',
  learnChordsTargetChord: null,
  learnChordsScore: 0,
  learnChordsFeedback: null,
  learnChordsStreak: 0,

  // UI state
  showPianoRoll: true,
  showFeedback: true,
  showTheoryPanel: true,
  showQuiz: false,
  keyboardInputEnabled: false,
  
  // History
  chordHistory: [],
  maxHistoryLength: 50,

  // Actions
  setMidiInitialized: (initialized) => set({ midiInitialized: initialized }),
  
  setMidiDevices: (devices) => set({ midiDevices: devices }),
  
  setActiveNotes: (notes) => set({ activeNotes: notes }),
  
  setCurrentAnalysis: (analysis) => {
    // Only update if analysis has changed to avoid loops, but we need to trigger updates for quiz
    // For now, just set it.
    set({ currentAnalysis: analysis });
    
    // Add to history
    if (analysis) {
      const { chordHistory, maxHistoryLength } = get();
      const newHistory = [...chordHistory, analysis].slice(-maxHistoryLength);
      set({ chordHistory: newHistory });
    }
  },
  
  setVoiceLeadingAnalysis: (analysis) => set({ voiceLeadingAnalysis: analysis }),
  
  setTension: (tension) => set({ tension }),
  
  setFeedback: (feedback) => set({ feedback }),
  
  setCurrentExercise: (exercise) => set({ 
    currentExercise: exercise,
    exerciseProgress: 0,
    score: 0,
  }),
  
  updateExerciseProgress: (progress) => set({ exerciseProgress: progress }),
  
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  
  // Quiz Actions
  setQuizActive: (active) => set({ quizActive: active }),
  setQuizTargetChord: (chord) => set({ quizTargetChord: chord }),
  setQuizFeedback: (feedback) => set({ quizFeedback: feedback }),
  incrementQuizScore: () => set((state) => ({ quizScore: state.quizScore + 1, quizStreak: state.quizStreak + 1 })),
  resetQuizStreak: () => set({ quizStreak: 0 }),
  resetQuiz: () => set({ quizActive: false, quizTargetChord: null, quizScore: 0, quizFeedback: null, quizStreak: 0 }),

  // Learn Chords Actions
  setLearnChordsActive: (active) => set({ learnChordsActive: active }),
  setLearnChordsScale: (scale) => set({ learnChordsScale: scale }),
  setLearnChordsTargetChord: (chord) => set({ learnChordsTargetChord: chord }),
  setLearnChordsFeedback: (feedback) => set({ learnChordsFeedback: feedback }),
  incrementLearnChordsScore: () => set((state) => ({ learnChordsScore: state.learnChordsScore + 1, learnChordsStreak: state.learnChordsStreak + 1 })),
  resetLearnChordsStreak: () => set({ learnChordsStreak: 0 }),
  resetLearnChords: () => set({
    learnChordsActive: false,
    learnChordsTargetChord: null,
    learnChordsScore: 0,
    learnChordsFeedback: null,
    learnChordsStreak: 0,
  }),

  togglePianoRoll: () => set((state) => ({ showPianoRoll: !state.showPianoRoll })),
  toggleFeedback: () => set((state) => ({ showFeedback: !state.showFeedback })),
  toggleTheoryPanel: () => set((state) => ({ showTheoryPanel: !state.showTheoryPanel })),
  toggleQuiz: () => set((state) => ({ showQuiz: !state.showQuiz })),
  toggleKeyboardInput: () => set((state) => ({ keyboardInputEnabled: !state.keyboardInputEnabled })),
  
  clearHistory: () => set({ chordHistory: [] }),
  
  reset: () => set({
    activeNotes: [],
    currentAnalysis: null,
    voiceLeadingAnalysis: null,
    tension: 0,
    feedback: { suggestions: [], compliments: [] },
    chordHistory: [],
  }),
}));
