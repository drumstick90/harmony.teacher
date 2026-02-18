import '../styles/ChordDisplay.css';

const ChordDisplay = ({ analysis }) => {
  if (!analysis || !analysis.chordName) {
    return (
      <div className="chord-display empty">
        <div className="chord-name">—</div>
        <div className="chord-notes">Play some notes...</div>
      </div>
    );
  }

  const { chordName, notes, voicing, alternatives, confidence, inversion } = analysis;
  
  // Confidence color
  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'var(--state-on)';
    if (conf >= 60) return 'var(--state-mid)';
    if (conf >= 40) return 'var(--state-hot)';
    return 'var(--state-alert)';
  };

  return (
    <div className="chord-display">
      <div className="chord-header">
        <div className="chord-name">{chordName}</div>
        
        {confidence !== undefined && (
          <div 
            className="confidence-badge"
            style={{ 
              borderColor: getConfidenceColor(confidence),
              color: getConfidenceColor(confidence)
            }}
          >
            {confidence}%
          </div>
        )}
      </div>
      
      <div className="chord-notes">
        {notes.join(' ')}
      </div>
      
      {alternatives && alternatives.length > 0 && (
        <div className="alternatives">
          <span className="alt-label">Also:</span>
          <span className="alt-names">{alternatives.join(' · ')}</span>
        </div>
      )}

      {inversion && (
        <div className="inversion-display">
          <div className={`inversion-badge ${inversion.type}`}>
            {inversion.position}
          </div>
          <div className="inversion-desc">
            {inversion.description}
          </div>
        </div>
      )}

      {voicing && (
        <div className="voicing-info">
          <div className="voicing-badges">
            <span className={`badge ${voicing.type}`}>
              {voicing.type === 'open' ? 'Open' : 'Close'} Voicing
            </span>
            
            {voicing.isDropVoicing && (
              <span className="badge special">
                Drop Voicing
              </span>
            )}
            
            <span className="badge range">
              Range: {voicing.range} semitones
            </span>
          </div>

          <div className="voicing-details">
            <div className="detail">
              <span className="label">Bass:</span>
              <span className="value">{voicing.bass}</span>
            </div>
            <div className="detail">
              <span className="label">Top:</span>
              <span className="value">{voicing.top}</span>
            </div>
            <div className="detail">
              <span className="label">Spacing:</span>
              <span className="value">
                {voicing.spacing.hasClusters && 'Clusters'}
                {voicing.spacing.hasPerfect4th && ' 4ths'}
                {voicing.spacing.hasMajor3rd && ' 3rds'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordDisplay;
