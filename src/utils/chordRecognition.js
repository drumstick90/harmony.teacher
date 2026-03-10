import { Note } from 'tonal';

/**
 * Fuzzy chord recognition for "Impara gli Accordi" mode.
 * Handles mixed scenarios: not all notes correct, not all wrong.
 *
 * @param {string[]} userNotes - Note names from user input (e.g. from MIDI)
 * @param {Object} targetChord - { notes: string[], inversion: string }
 * @param {Object} userInversion - From MusicTheory.analyzeInversion()
 * @returns {{ result: 'correct'|'almost'|'wrong', correctCount: number, wrongCount: number, missingCount: number, feedback: string }}
 */
export function recognizeChord(userNotes, targetChord, userInversion) {
  const toChroma = (note) => {
    const pc = Note.pitchClass(note);
    return pc ? Note.chroma(pc) : null;
  };

  const userChromas = [...new Set(
    userNotes
      .map(toChroma)
      .filter((c) => c !== null)
  )].sort((a, b) => a - b);

  const targetChromas = [...new Set(
    targetChord.notes
      .map(toChroma)
      .filter((c) => c !== null)
  )].sort((a, b) => a - b);

  const correctCount = targetChromas.filter((tc) => userChromas.includes(tc)).length;
  const wrongCount = userChromas.filter((uc) => !targetChromas.includes(uc)).length;
  const missingCount = targetChromas.length - correctCount;

  // Map inversion strings to analysis types
  const inversionTypeMap = {
    'Root Position': 'root',
    '1st Inversion': 'first',
    '2nd Inversion': 'second',
  };
  const expectedInversionType = inversionTypeMap[targetChord.inversion];
  const userInversionType = userInversion?.type;
  const inversionMatch = expectedInversionType === userInversionType;

  // Fallback: check bass note
  let bassMatch = false;
  if (!inversionMatch && userInversion?.bassNote) {
    const expectedBass = Note.pitchClass(targetChord.notes[0]);
    const actualBass = Note.pitchClass(userInversion.bassNote);
    bassMatch = expectedBass === actualBass;
  }

  const inversionCorrect = inversionMatch || bassMatch;

  // Decision logic
  let result;
  let feedback;

  if (correctCount === 3 && wrongCount === 0 && inversionCorrect) {
    result = 'correct';
    feedback = 'Perfetto!';
  } else if (correctCount === 3 && wrongCount === 0 && !inversionCorrect) {
    result = 'almost';
    feedback = 'Note giuste, ma rivolto sbagliato. Riprova.';
  } else if (correctCount === 3 && wrongCount === 1) {
    result = 'almost';
    feedback = 'Quasi! Hai una nota in più sbagliata.';
  } else if (correctCount === 3 && wrongCount > 1) {
    result = 'wrong';
    feedback = `Troppe note sbagliate (${wrongCount} extra). Riprova.`;
  } else if (correctCount === 2) {
    result = 'almost';
    feedback = `2 note su 3 corrette. Manca una nota.`;
  } else if (correctCount === 1) {
    result = 'wrong';
    feedback = 'Solo 1 nota corretta. Riprova.';
  } else {
    result = 'wrong';
    feedback = 'Note sbagliate. Riprova.';
  }

  return {
    result,
    correctCount,
    wrongCount,
    missingCount,
    feedback,
    inversionCorrect,
  };
}
