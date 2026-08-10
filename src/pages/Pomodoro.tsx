import { useEffect } from 'react';
import { usePomodoro } from '../hooks/useTime';
import { useClock } from '../ClockContext';
import { TimerDisplay } from '../components/DateDisplay';
import { Button } from '../components/Controls';
import { Navigation } from '../components/Navigation';
import { COLORS } from '../types';

export function PomodoroPage() {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const pomodoro = usePomodoro(25, 5);

  // Apply background theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', settings.backgroundTheme);
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
  }, [settings.backgroundTheme, settings.highContrast]);

  return (
    <div className="page pomodoro-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat Pomodoro</h1>
          <div className="header-controls">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="clock-container">
        <div className="clock-wrapper">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span 
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                background: pomodoro.isBreak ? 'rgba(255,107,107,0.2)' : 'rgba(0,255,136,0.2)',
                borderRadius: '20px',
                color: pomodoro.isBreak ? '#ff6b6b' : '#00ff88',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {pomodoro.isBreak ? 'Break Time' : 'Focus Time'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Session</span>
            <span style={{ 
              color: primary, 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              textShadow: `0 0 10px ${glow}`,
            }}>
              {pomodoro.session}
            </span>
          </div>

          <TimerDisplay 
            hours={0}
            minutes={pomodoro.minutes} 
            seconds={pomodoro.seconds}
            color={primary}
            glow={glow}
            isBreak={pomodoro.isBreak}
          />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {pomodoro.isRunning ? (
              <Button onClick={pomodoro.pause} variant="primary" color="#ffaa00">
                ⏸ Pause
              </Button>
            ) : (
              <Button 
                onClick={pomodoro.start} 
                variant="primary"
                color={primary}
              >
                ▶ {pomodoro.isBreak ? 'Resume Break' : 'Start Focus'}
              </Button>
            )}
            <Button onClick={pomodoro.reset} variant="secondary">
              ↺ Reset
            </Button>
            <Button onClick={pomodoro.skip} variant="secondary">
              ⏭ Skip
            </Button>
          </div>

          <div style={{ 
            marginTop: '3rem', 
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem',
            maxWidth: '400px',
          }}>
            <p>The Pomodoro Technique uses 25-minute focus sessions followed by 5-minute breaks. After 4 sessions, take a longer break.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
