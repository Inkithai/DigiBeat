import { useStopwatch } from '../hooks/useTime';
import { useClock } from '../ClockContext';
import { StopwatchDisplay } from '../components/DateDisplay';
import { Button } from '../components/Controls';
import { Navigation } from '../components/Navigation';
import { COLORS } from '../types';

export function StopwatchPage() {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const sw = useStopwatch();

  const formatLapTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
  };

  return (
    <div className="page stopwatch-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat Stopwatch</h1>
          <div className="header-controls">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="clock-container">
        <div className="clock-wrapper">
          <StopwatchDisplay 
            hours={sw.hours} 
            minutes={sw.minutes} 
            seconds={sw.seconds}
            ms={sw.ms}
            color={primary}
            glow={glow}
          />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {sw.isRunning ? (
              <Button onClick={sw.pause} variant="primary" color="#ffaa00">
                ⏸ Pause
              </Button>
            ) : (
              <Button 
                onClick={sw.start} 
                variant="primary"
                color={primary}
              >
                ▶ {sw.elapsed > 0 ? 'Resume' : 'Start'}
              </Button>
            )}
            <Button 
              onClick={sw.lap} 
              variant="secondary"
              disabled={!sw.isRunning && sw.elapsed === 0}
            >
              ⏱ Lap
            </Button>
            <Button onClick={sw.reset} variant="danger">
              ↺ Reset
            </Button>
          </div>

          {sw.laps.length > 0 && (
            <div style={{ marginTop: '3rem', maxWidth: '500px', margin: '3rem auto 0', width: '100%' }}>
              <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '1rem' }}>Laps</h3>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                padding: '1rem',
              }}>
                {sw.laps.map((lap, index) => {
                  const prevLap = index > 0 ? sw.laps[index - 1] : 0;
                  const lapTime = lap - prevLap;
                  return (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                    >
                      <span style={{ color: primary }}>Lap {index + 1}</span>
                      <span style={{ fontFamily: 'monospace' }}>{formatLapTime(lap)}</span>
                      <span style={{ fontFamily: 'monospace', opacity: 0.7, fontSize: '0.85rem' }}>
                        +{formatLapTime(lapTime)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
