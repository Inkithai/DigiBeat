import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTime';
import { useClock } from '../ClockContext';
import { TimerDisplay } from '../components/DateDisplay';
import { Button } from '../components/Controls';
import { Navigation } from '../components/Navigation';
import { COLORS } from '../types';

export function TimerPage() {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [inputMinutes, setInputMinutes] = useState('25');
  const timer = useTimer(initialMinutes);

  // Apply background theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', settings.backgroundTheme);
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
  }, [settings.backgroundTheme, settings.highContrast]);

  const handleSetTime = () => {
    const mins = parseInt(inputMinutes) || 0;
    if (mins > 0 && mins <= 999) {
      setInitialMinutes(mins);
      timer.reset(mins);
    }
  };

  const presets = [5, 10, 15, 25, 30, 45, 60];

  return (
    <div className="page timer-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat Timer</h1>
          <div className="header-controls">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="clock-container">
        <div className="clock-wrapper">
          {timer.isComplete ? (
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{
                  fontSize: 'clamp(3rem, 15vw, 8rem)',
                  fontWeight: 'bold',
                  color: '#ff6b6b',
                  textShadow: '0 0 30px rgba(255,107,107,0.8)',
                  animation: 'pulse 1s infinite',
                }}
              >
                TIME'S UP!
              </div>
            </div>
          ) : (
            <TimerDisplay 
              hours={timer.hours} 
              minutes={timer.minutes} 
              seconds={timer.seconds}
              color={primary}
              glow={glow}
            />
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {timer.isRunning ? (
              <Button onClick={timer.pause} variant="primary" color="#ffaa00">
                ⏸ Pause
              </Button>
            ) : (
              <Button 
                onClick={timer.start} 
                variant="primary"
                color={primary}
                disabled={timer.isComplete}
              >
                ▶ Start
              </Button>
            )}
            <Button onClick={() => timer.reset()} variant="secondary">
              ↺ Reset
            </Button>
          </div>

          <div style={{ marginTop: '3rem', maxWidth: '400px', margin: '3rem auto 0' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {presets.map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setInputMinutes(String(mins));
                    setInitialMinutes(mins);
                    timer.reset(mins);
                  }}
                  style={{
                    padding: '8px 12px',
                    background: initialMinutes === mins ? primary : 'rgba(255,255,255,0.1)',
                    color: initialMinutes === mins ? '#000' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <input
                type="number"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                placeholder="Minutes"
                min="1"
                max="999"
                aria-label="Custom minutes"
                style={{
                  width: '100px',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  textAlign: 'center',
                }}
              />
              <Button onClick={handleSetTime} variant="secondary">
                Set
              </Button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}
