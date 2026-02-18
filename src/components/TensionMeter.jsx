import '../styles/TensionMeter.css';

const TensionMeter = ({ tension = 0 }) => {
  const percentage = (tension / 10) * 100;
  
  // Color gradient based on tension
  const getColor = (value) => {
    if (value < 3) return 'var(--state-on)';
    if (value < 6) return 'var(--state-mid)';
    if (value < 8) return 'var(--state-hot)';
    return 'var(--state-alert)';
  };

  const color = getColor(tension);

  return (
    <div className="tension-meter">
      <div className="tension-label">
        <span>Tension</span>
        <span className="tension-value">{tension.toFixed(1)}/10</span>
      </div>
      
      <div className="tension-bar-container">
        <div 
          className="tension-bar"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width 120ms linear, background-color 120ms linear',
          }}
        />
      </div>

      <div className="tension-description">
        {tension < 2 && 'Consonant - Stable'}
        {tension >= 2 && tension < 4 && 'Mild Tension'}
        {tension >= 4 && tension < 6 && 'Moderate Tension'}
        {tension >= 6 && tension < 8 && 'High Tension'}
        {tension >= 8 && 'Extreme Dissonance'}
      </div>
    </div>
  );
};

export default TensionMeter;
