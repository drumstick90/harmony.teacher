import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { getRandomChord } from '../data/chordDatabase';
import { Note } from 'tonal';
import '../styles/QuizPanel.css';

const QuizPanel = () => {
  const {
    quizActive,
    quizTargetChord,
    quizScore,
    quizStreak,
    quizFeedback,
    currentAnalysis,
    setQuizActive,
    setQuizTargetChord,
    setQuizFeedback,
    incrementQuizScore,
    resetQuizStreak,
    resetQuiz,
  } = useAppStore();

  // Start quiz on mount if not active
  useEffect(() => {
    if (!quizTargetChord) {
      startNewQuiz();
    }
  }, []);

  // Check answer when currentAnalysis changes
  useEffect(() => {
    if (!quizActive || !quizTargetChord || !currentAnalysis) return;

    checkAnswer();
  }, [currentAnalysis]);

  const startNewQuiz = () => {
    const nextChord = getRandomChord();
    setQuizTargetChord(nextChord);
    setQuizActive(true);
    setQuizFeedback(null);
  };

  const nextQuestion = () => {
    const nextChord = getRandomChord();
    setQuizTargetChord(nextChord);
    setQuizFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentAnalysis.chordName) return;

    // Check if chord name matches (simplified check)
    // We check if the detected chord name contains the root and type
    // And if the inversion matches
    
    const targetRoot = quizTargetChord.root;
    const targetType = quizTargetChord.type === 'Major' ? '' : 'm';
    const targetName = `${targetRoot}${targetType}`;
    
    // Compare pitch classes by chroma index to handle enharmonics (Eb == D#)
    const toChroma = (note) => Note.chroma(Note.pitchClass(note));
    const userChromas = currentAnalysis.notes
      .map(toChroma)
      .filter((value) => value !== null)
      .sort((a, b) => a - b);
    const targetChromas = quizTargetChord.notes
      .map(toChroma)
      .filter((value) => value !== null)
      .sort((a, b) => a - b);

    const hasAllNotes = targetChromas.every(chroma => userChromas.includes(chroma));
    const noExtraNotes = userChromas.every(chroma => targetChromas.includes(chroma));
    
    if (hasAllNotes && noExtraNotes) {
      const userInversion = currentAnalysis.inversion;
      let inversionMatch = false;

      if (quizTargetChord.inversion === 'Root Position' && userInversion.type === 'root') inversionMatch = true;
      if (quizTargetChord.inversion === '1st Inversion' && userInversion.type === 'first') inversionMatch = true;
      if (quizTargetChord.inversion === '2nd Inversion' && userInversion.type === 'second') inversionMatch = true;

      // Fallback: bass note check for ambiguous inversion types
      if (!inversionMatch && userInversion) {
         const expectedBass = Note.pitchClass(quizTargetChord.notes[0]);
         const actualBass = Note.pitchClass(userInversion.bassNote);
         if (expectedBass === actualBass) {
            inversionMatch = true;
         }
      }

      if (inversionMatch) {
        handleCorrectAnswer();
      } else {
        handleIncorrectAnswer('Wrong inversion');
      }
    } else {
      handleIncorrectAnswer('Wrong notes');
    }
  };

  const handleCorrectAnswer = () => {
    if (quizFeedback === 'correct') return; // Already handled

    setQuizFeedback('correct');
    incrementQuizScore();
    
    // Auto advance after delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleIncorrectAnswer = (reason) => {
    // Only update if not already showing incorrect to avoid flickering
    if (quizFeedback !== 'incorrect') {
      setQuizFeedback('incorrect');
      // Reset streak on wrong answer
      resetQuizStreak();
    }
  };

  const handleSkip = () => {
    resetQuizStreak();
    setQuizFeedback('skipped');
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };

  const handleStop = () => {
    resetQuiz();
  };

  if (!quizTargetChord) return <div className="quiz-panel">Loading...</div>;

  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <h2>Chord Quiz</h2>
        <div className="quiz-stats">
          <span>Score: <strong>{quizScore}</strong></span>
          <span>Streak: <strong>{quizStreak}</strong></span>
        </div>
      </div>

      <div className="quiz-target">
        <h3>Play this chord:</h3>
        <div className="target-chord-name">
          {quizTargetChord.displayName}
        </div>
        <div className="target-chord-notes spoiler">
          <span className="spoiler-text">{quizTargetChord.notes.join(' - ')}</span>
          <span className="spoiler-label">hover per rivelare</span>
        </div>
      </div>

      <div className={`quiz-feedback ${quizFeedback}`}>
        {quizFeedback === 'correct' && 'Correct'}
        {quizFeedback === 'incorrect' && 'Try Again'}
        {quizFeedback === 'skipped' && 'Skipped'}
        {!quizFeedback && 'Waiting For Input'}
      </div>

      <div className="quiz-controls">
        <button className="btn-quiz" onClick={handleSkip}>Skip</button>
        <button className="btn-quiz primary" onClick={handleStop}>Exit Quiz</button>
      </div>
    </div>
  );
};

export default QuizPanel;
