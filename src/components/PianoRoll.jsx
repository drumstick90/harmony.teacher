import { useEffect, useRef } from 'react';
import { Note } from 'tonal';
import '../styles/PianoRoll.css';

const PianoRoll = ({ activeNotes = [], analysis, theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const css = getComputedStyle(document.documentElement);
    const bgPrimary = css.getPropertyValue('--bg-primary').trim();
    const bgSecondary = css.getPropertyValue('--bg-secondary').trim();
    const borderDark = css.getPropertyValue('--border-dark').trim();
    const textSecondary = css.getPropertyValue('--text-secondary').trim();
    const textPrimary = css.getPropertyValue('--text-primary').trim();
    const warmChords = css.getPropertyValue('--warm-chords').trim();
    const stateOn = css.getPropertyValue('--state-on').trim();
    const stateMid = css.getPropertyValue('--state-mid').trim();
    const stateHot = css.getPropertyValue('--state-hot').trim();
    const stateAlert = css.getPropertyValue('--state-alert').trim();
    const activeNoteLabel = css.getPropertyValue('--active-note-label').trim() || '#0f1215';

    // Clear canvas
    ctx.fillStyle = bgPrimary;
    ctx.fillRect(0, 0, width, height);

    // Draw piano roll (C2 to C6 = MIDI 36 to 84)
    const startNote = 36; // C2
    const endNote = 84; // C6
    const noteCount = endNote - startNote;
    const noteHeight = height / noteCount;

    // Draw grid and notes
    for (let i = 0; i < noteCount; i++) {
      const midiNote = endNote - i; // Draw from top
      const y = i * noteHeight;
      const noteName = Note.fromMidi(midiNote);
      const isBlackKey = noteName.includes('#') || noteName.includes('b');
      const isActive = activeNotes.includes(midiNote);

      // Background
      ctx.fillStyle = isBlackKey ? bgSecondary : bgPrimary;
      ctx.fillRect(0, y, width, noteHeight);

      // Grid line
      ctx.strokeStyle = i % 12 === 0 ? '#47637f' : borderDark;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Active note
      if (isActive) {
        // Color based on voice position
        const voiceIndex = activeNotes.indexOf(midiNote);
        const colors = [stateOn, stateMid, stateHot, stateAlert];
        const activeColor = colors[voiceIndex % colors.length];
        ctx.fillStyle = activeColor;
        ctx.fillRect(10, y + 2, width - 20, noteHeight - 4);
        ctx.strokeStyle = 'rgba(236, 248, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(10.5, y + 2.5, width - 21, noteHeight - 5);

        // Note label
        ctx.fillStyle = activeNoteLabel;
        ctx.font = '12px monospace';
        ctx.fillText(noteName, 20, y + noteHeight / 2 + 4);
      }

      // Octave markers (C notes)
      if (noteName.startsWith('C') && !noteName.includes('#')) {
        ctx.fillStyle = textSecondary;
        ctx.font = '10px monospace';
        ctx.fillText(noteName, width - 30, y + noteHeight / 2 + 4);
      }
    }

    // Draw chord name if available
    if (analysis?.chordName) {
      ctx.fillStyle = 'rgba(30, 44, 62, 0.86)';
      ctx.fillRect(10, 10, 200, 40);
      ctx.strokeStyle = 'rgba(122, 185, 214, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10.5, 10.5, 199, 39);
      ctx.fillStyle = warmChords || textPrimary;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(analysis.chordName, 20, 35);
    }

  }, [activeNotes, analysis, theme]);

  return (
    <div className="piano-roll">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default PianoRoll;
