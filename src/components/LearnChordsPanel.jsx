import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { getRandomScaleChord } from '../data/learnChordsData';
import { recognizeChord } from '../utils/chordRecognition';
import '../styles/LearnChordsPanel.css';

const LearnChordsPanel = () => {
  const {
    learnChordsActive,
    learnChordsScale,
    learnChordsTargetChord,
    learnChordsScore,
    learnChordsStreak,
    learnChordsFeedback,
    currentAnalysis,
    activeNotes,
    setLearnChordsTargetChord,
    setLearnChordsFeedback,
    incrementLearnChordsScore,
    resetLearnChordsStreak,
    resetLearnChords,
  } = useAppStore();

  useEffect(() => {
    if (!learnChordsTargetChord && learnChordsScale) {
      startNewQuestion();
    }
  }, [learnChordsScale]);

  const startNewQuestion = () => {
    const nextChord = getRandomScaleChord(learnChordsScale);
    setLearnChordsTargetChord(nextChord);
    setLearnChordsFeedback(null);
  };

  // Clear feedback when user releases keys (so they see "In attesa..." for next attempt)
  useEffect(() => {
    if (activeNotes.length === 0 && learnChordsFeedback && learnChordsFeedback !== 'correct') {
      setLearnChordsFeedback(null);
    }
  }, [activeNotes.length]);

  useEffect(() => {
    if (!learnChordsActive || !learnChordsTargetChord || !currentAnalysis?.notes?.length) return;
    if (learnChordsFeedback === 'correct') return; // Already solved

    checkAnswer();
  }, [currentAnalysis]);

  const checkAnswer = () => {
    if (!currentAnalysis?.notes?.length) return;

    const recognition = recognizeChord(
      currentAnalysis.notes,
      {
        notes: learnChordsTargetChord.notes,
        inversion: learnChordsTargetChord.inversion,
      },
      currentAnalysis.inversion
    );

    if (recognition.result === 'correct') {
      handleCorrectAnswer();
    } else if (recognition.result === 'almost' || recognition.result === 'wrong') {
      handleIncorrectAnswer(recognition.feedback);
    }
  };

  const handleCorrectAnswer = () => {
    if (learnChordsFeedback === 'correct') return;

    setLearnChordsFeedback('correct');
    incrementLearnChordsScore();

    setTimeout(() => {
      startNewQuestion();
    }, 1500);
  };

  const handleIncorrectAnswer = (feedback) => {
    setLearnChordsFeedback(feedback);
    resetLearnChordsStreak();
  };

  const handleSkip = () => {
    resetLearnChordsStreak();
    setLearnChordsFeedback('skipped');
    setTimeout(() => {
      startNewQuestion();
    }, 500);
  };

  const handleStop = () => {
    resetLearnChords();
  };

  if (!learnChordsTargetChord) {
    return (
      <div className="learn-chords-panel">
        <div className="learn-chords-loading">
          Caricamento accordi...
        </div>
      </div>
    );
  }

  const inversionLabel = {
    'Root Position': 'posizione fondamentale',
    '1st Inversion': 'primo rivolto',
    '2nd Inversion': 'secondo rivolto',
  }[learnChordsTargetChord.inversion] || learnChordsTargetChord.inversion;

  return (
    <div className="learn-chords-panel">
      <div className="learn-chords-header">
        <h2>Impara gli Accordi</h2>
        <div className="learn-chords-scale">
          Scala: <strong>{learnChordsScale}</strong>
        </div>
        <div className="learn-chords-stats">
          <span>Punteggio: <strong>{learnChordsScore}</strong></span>
          <span>Serie: <strong>{learnChordsStreak}</strong></span>
        </div>
      </div>

      <div className="learn-chords-target">
        <h3>Fammi l'accordo:</h3>
        <div className="target-chord-name">
          {learnChordsTargetChord.name} — {inversionLabel}
        </div>
        <div className="target-chord-notes spoiler">
          <span className="spoiler-text">{learnChordsTargetChord.notes.join(' - ')}</span>
          <span className="spoiler-label">hover per rivelare</span>
        </div>
      </div>

      <div className={`learn-chords-feedback ${learnChordsFeedback === 'correct' ? 'correct' : ''} ${learnChordsFeedback === 'skipped' ? 'skipped' : ''} ${learnChordsFeedback && learnChordsFeedback !== 'correct' && learnChordsFeedback !== 'skipped' ? 'incorrect' : ''}`}>
        {learnChordsFeedback === 'correct' && 'Perfetto!'}
        {learnChordsFeedback === 'skipped' && 'Saltato'}
        {learnChordsFeedback && learnChordsFeedback !== 'correct' && learnChordsFeedback !== 'skipped' && learnChordsFeedback}
        {!learnChordsFeedback && 'In attesa...'}
      </div>

      <div className="learn-chords-controls">
        <button className="btn-learn-chords" onClick={handleSkip}>Salta</button>
        <button className="btn-learn-chords primary" onClick={handleStop}>Esci</button>
      </div>
    </div>
  );
};

export default LearnChordsPanel;
