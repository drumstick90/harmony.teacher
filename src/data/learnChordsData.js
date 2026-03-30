import scaleChordsJson from './scaleChords.json';
import { createShuffledQueue } from './shuffleQueue';

let cachedChords = null;
let scaleQueue = null;

/**
 * Get all chords for a scale as flat array (degree + inversion combinations)
 */
export function getScaleChords(scaleName) {
  if (cachedChords && cachedChords.scaleName === scaleName) {
    return cachedChords.chords;
  }

  const scaleData = scaleChordsJson[scaleName];
  if (!scaleData) return [];

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
  scaleQueue = createShuffledQueue(chords);
  return chords;
}

/**
 * Get the next random chord from the scale (cycles through all before repeating)
 */
export function getRandomScaleChord(scaleName) {
  const chords = getScaleChords(scaleName);
  if (chords.length === 0) return null;

  if (!scaleQueue || scaleQueue.scaleName !== scaleName) {
    scaleQueue = createShuffledQueue(chords);
    scaleQueue.scaleName = scaleName;
  }
  return scaleQueue.next();
}

export function getAvailableScales() {
  return Object.keys(scaleChordsJson);
}
