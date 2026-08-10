import { useEffect } from 'react';
import { WorldClock } from '../components/WorldClock';
import { Navigation } from '../components/Navigation';
import { useClock } from '../ClockContext';

export function WorldClockPage() {
  const { settings } = useClock();

  // Apply background theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', settings.backgroundTheme);
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
  }, [settings.backgroundTheme, settings.highContrast]);

  return (
    <div className="page world-clock-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat World Clock</h1>
          <div className="header-controls">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="clock-container">
        <WorldClock />
      </main>
    </div>
  );
}
