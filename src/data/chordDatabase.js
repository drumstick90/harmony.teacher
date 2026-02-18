/**
 * Chord Database for Quiz Mode
 * Contains Major and Minor chords with all inversions
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_TYPES = {
  MAJOR: 'Major',
  MINOR: 'Minor',
};

export const INVERSIONS = {
  ROOT: 'Root Position',
  FIRST: '1st Inversion',
  SECOND: '2nd Inversion',
};

// Helper to get note index
const getNoteIndex = (note) => NOTES.indexOf(note);

// Helper to get note name from index
const getNoteName = (index) => NOTES[index % 12];

// Generate chord notes
const generateChord = (root, type, inversion) => {
  const rootIndex = getNoteIndex(root);
  let intervals;

  if (type === CHORD_TYPES.MAJOR) {
    intervals = [0, 4, 7]; // Root, Major 3rd, Perfect 5th
  } else {
    intervals = [0, 3, 7]; // Root, Minor 3rd, Perfect 5th
  }

  // Apply inversion
  if (inversion === INVERSIONS.FIRST) {
    intervals = [intervals[1], intervals[2], intervals[0] + 12];
  } else if (inversion === INVERSIONS.SECOND) {
    intervals = [intervals[2], intervals[0] + 12, intervals[1] + 12];
  }

  return intervals.map(interval => getNoteName(rootIndex + interval));
};

// Generate full database
const generateDatabase = () => {
  const database = [];
  const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Natural roots for simplicity first
  // Add sharps/flats if needed later: 'C#', 'D#', 'F#', 'G#', 'A#', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'

  roots.forEach(root => {
    // Major Chords
    Object.values(INVERSIONS).forEach(inversion => {
      database.push({
        root,
        type: CHORD_TYPES.MAJOR,
        inversion,
        name: `${root} Major`,
        displayName: `${root} Major - ${inversion}`,
        notes: generateChord(root, CHORD_TYPES.MAJOR, inversion),
      });
    });

    // Minor Chords
    Object.values(INVERSIONS).forEach(inversion => {
      database.push({
        root,
        type: CHORD_TYPES.MINOR,
        inversion,
        name: `${root} Minor`,
        displayName: `${root} Minor - ${inversion}`,
        notes: generateChord(root, CHORD_TYPES.MINOR, inversion),
      });
    });
  });

  return database;
};

export const chordDatabase = generateDatabase();

// Helper to get a random chord
export const getRandomChord = () => {
  const randomIndex = Math.floor(Math.random() * chordDatabase.length);
  return chordDatabase[randomIndex];
};
