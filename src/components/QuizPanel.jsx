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
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Check answer when currentAnalysis changes
  useEffect(() => {
    if (!quizActive || !quizTargetChord || !currentAnalysis) return;

    console.log('🔍 Checking answer...', {
      currentAnalysis,
      quizTargetChord
    });

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
    
    console.log('📝 Comparison:', {
      userChromas,
      targetChromas,
      hasAllNotes,
      noExtraNotes,
      inversion: currentAnalysis.inversion
    });

    if (hasAllNotes && noExtraNotes) {
      // Check inversion
      const userInversion = currentAnalysis.inversion;
      let inversionMatch = false;

      console.log('📝 Inversion Check:', {
        targetInversion: quizTargetChord.inversion,
        userInversionType: userInversion?.type,
        userBass: userInversion?.bassNote
      });

      // Map our database inversion strings to the analysis engine's types
      if (quizTargetChord.inversion === 'Root Position' && userInversion.type === 'root') inversionMatch = true;
      if (quizTargetChord.inversion === '1st Inversion' && userInversion.type === 'first') inversionMatch = true;
      if (quizTargetChord.inversion === '2nd Inversion' && userInversion.type === 'second') inversionMatch = true;

      // Fallback: Check bass note directly if inversion type is ambiguous or 'other'
      // This helps if the analysis engine doesn't perfectly categorize it but the bass is correct
      if (!inversionMatch && userInversion) {
         const targetBassIndex = quizTargetChord.inversion === 'Root Position' ? 0 :
                                 quizTargetChord.inversion === '1st Inversion' ? 1 : 2;
         
         // Get the expected bass note from the target notes array
         // quizTargetChord.notes is like ['C', 'E', 'G'] for root, ['E', 'G', 'C'] for 1st inv
         // So the first note in that array IS the bass note
         const expectedBass = Note.pitchClass(quizTargetChord.notes[0]);
         const actualBass = Note.pitchClass(userInversion.bassNote);
         
         console.log('⚠️ Fallback Check:', { expectedBass, actualBass });

         if (expectedBass === actualBass) {
            console.log('⚠️ Inversion type mismatch but bass note is correct. Accepting.');
            inversionMatch = true;
         }
      }

      if (inversionMatch) {
        console.log('✅ Correct Answer!');
        handleCorrectAnswer();
      } else {
        console.log('❌ Wrong Inversion');
        handleIncorrectAnswer('Wrong inversion');
      }
    } else {
      console.log('❌ Wrong Notes', { hasAllNotes, noExtraNotes });
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
        <div className="target-chord-notes">
          ({quizTargetChord.notes.join(' - ')})
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
