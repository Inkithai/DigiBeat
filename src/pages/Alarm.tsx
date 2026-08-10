import { useEffect } from 'react';
import { AlarmClock } from '../components/AlarmClock';
import { Navigation } from '../components/Navigation';
import { useClock } from '../ClockContext';

export function AlarmPage() {
  const { settings } = useClock();

  // Apply background theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', settings.backgroundTheme);
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
  }, [settings.backgroundTheme, settings.highContrast]);

  return (
    <div className="page alarm-page">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat Alarm</h1>
          <div className="header-controls">
            <Navigation />
          </div>
        </div>
      </header>

      <main className="clock-container">
        <AlarmClock />
      </main>
    </div>
  );
}
