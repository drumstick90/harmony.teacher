import { create } from 'zustand';

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

  // Quiz state
  quizActive: false,
  quizTargetChord: null,
  quizScore: 0,
  quizFeedback: null,
  quizStreak: 0,

  // Learn Chords state
  learnChordsActive: false,
  learnChordsScale: 'C major',
  learnChordsTargetChord: null,
  learnChordsScore: 0,
  learnChordsFeedback: null,
  learnChordsStreak: 0,

  // UI state
  keyboardInputEnabled: false,
  lightTheme: false,

  // History
  chordHistory: [],
  maxHistoryLength: 50,

  // Actions
  setMidiInitialized: (initialized) => set({ midiInitialized: initialized }),
  setMidiDevices: (devices) => set({ midiDevices: devices }),
  setActiveNotes: (notes) => set({ activeNotes: notes }),

  setCurrentAnalysis: (analysis) => {
    set({ currentAnalysis: analysis });
    if (analysis) {
      const { chordHistory, maxHistoryLength } = get();
      const newHistory = [...chordHistory, analysis].slice(-maxHistoryLength);
      set({ chordHistory: newHistory });
    }
  },

  setVoiceLeadingAnalysis: (analysis) => set({ voiceLeadingAnalysis: analysis }),
  setTension: (tension) => set({ tension }),
  setFeedback: (feedback) => set({ feedback }),

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

  toggleKeyboardInput: () => set((state) => ({ keyboardInputEnabled: !state.keyboardInputEnabled })),
  setLightTheme: (enabled) => set({ lightTheme: enabled }),
  toggleLightTheme: () => set((state) => {
    const next = !state.lightTheme;
    try { localStorage.setItem('harmony-light-theme', JSON.stringify(next)); } catch (_) {}
    return { lightTheme: next };
  }),

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
