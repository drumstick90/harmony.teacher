/**
 * Learn Chords data loader
 * Loads scale chords from JSON and provides flattened chord list for quiz
 */

import scaleChordsJson from './scaleChords.json';

let cachedChords = null;

/**
 * Get all chords for a scale as flat array (degree + inversion combinations)
 * @param {string} scaleName - e.g. "C major"
 * @returns {Array<{ degree: string, name: string, type: string, inversion: string, notes: string[], displayName: string }>}
 */
export function getScaleChords(scaleName) {
  if (cachedChords && cachedChords.scaleName === scaleName) {
    return cachedChords.chords;
  }

  const scaleData = scaleChordsJson[scaleName];
  if (!scaleData) {
    return [];
  }

  const chords = [];
  for (const deg of scaleData.degrees) {
    for (const chord of deg.chords) {
      chords.push({
        degree: deg.degree,
        name: deg.name,
        type: deg.type,
        inversion: chord.inversion,
        notes: chord.notes,
        displayName: `${deg.name} - ${chord.inversion}`,
      });
    }
  }

  cachedChords = { scaleName, chords };
  return chords;
}

/**
 * Get a random chord from the scale
 * @param {string} scaleName
 * @returns {Object|null}
 */
export function getRandomScaleChord(scaleName) {
  const chords = getScaleChords(scaleName);
  if (chords.length === 0) return null;
  return chords[Math.floor(Math.random() * chords.length)];
}

/**
 * Get available scale names
 */
export function getAvailableScales() {
  return Object.keys(scaleChordsJson);
}
