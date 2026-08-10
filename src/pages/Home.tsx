import { useEffect, useCallback } from 'react';
import { useTime } from '../hooks/useTime';
import { useClock } from '../ClockContext';
import { SimpleDigital } from '../components/Clocks';
import { FlipClockDisplay } from '../components/FlipClock';
import { PixelClockDisplay } from '../components/PixelClock';
import { NeonClockDisplay } from '../components/NeonClock';
import { BinaryClockDisplay } from '../components/BinaryClock';
import { DateDisplay } from '../components/DateDisplay';
import { SettingsPanel } from '../components/SettingsPanel';
import { FullscreenButton, WakeLockStatus } from '../components/Controls';
import { Navigation } from '../components/Navigation';

export function HomePage() {
  const { settings } = useClock();
  const { hours, minutes, seconds, period, time } = useTime(settings.format);
  
  // Apply background theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', settings.backgroundTheme);
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
  }, [settings.backgroundTheme, settings.highContrast]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'f':
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      case 's':
        e.preventDefault();
        useClock().updateSettings({ showSeconds: !settings.showSeconds });
        break;
      case 'd':
        e.preventDefault();
        useClock().updateSettings({ showDate: !settings.showDate });
        break;
      case 't':
        e.preventDefault();
        useClock().updateSettings({ keepScreenOn: !settings.keepScreenOn });
        break;
      case 'h':
        e.preventDefault();
        useClock().updateSettings({ highContrast: !settings.highContrast });
        break;
      case 'escape':
        // Close any open panels - handled by SettingsPanel
        break;
    }
  }, [settings.showSeconds, settings.showDate, settings.keepScreenOn, settings.highContrast]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => {
      const indicator = document.getElementById('offline-indicator');
      if (indicator) {
        indicator.classList.toggle('visible', !navigator.onLine);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const renderClock = () => {
    switch (settings.style) {
      case 'digital':
        return <SimpleDigital 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          period={settings.format === '12' ? period : undefined} 
          showSeconds={settings.showSeconds} 
        />;
      case 'flip':
        return <FlipClockDisplay 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          showSeconds={settings.showSeconds} 
        />;
      case 'pixel':
        return <PixelClockDisplay 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          showSeconds={settings.showSeconds} 
        />;
      case 'neon':
        return <NeonClockDisplay 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          showSeconds={settings.showSeconds} 
          period={settings.format === '12' ? period : undefined} 
        />;
      case 'binary':
        return <BinaryClockDisplay 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          showSeconds={settings.showSeconds} 
        />;
      default:
        return <SimpleDigital 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          period={settings.format === '12' ? period : undefined} 
          showSeconds={settings.showSeconds} 
        />;
    }
  };

  return (
    <div className="page home-page">
      {/* Offline indicator */}
      <div id="offline-indicator" className="offline-indicator">
        📡 You're offline - DigiBeat is still working!
      </div>

      <header className="header">
        <div className="header-content">
          <h1 className="logo">DigiBeat</h1>
          <div className="header-controls">
            <WakeLockStatus />
            <FullscreenButton />
            <SettingsPanel />
          </div>
        </div>
      </header>

      <Navigation />

      <main className="clock-container">
        <div className="clock-wrapper">
          {renderClock()}
          {settings.showDate && <DateDisplay date={time} />}
        </div>
      </main>

      <footer className="footer">
        <p>Your beautiful ambient time display</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Keyboard: <kbd>F</kbd> Fullscreen • <kbd>S</kbd> Seconds • <kbd>D</kbd> Date • <kbd>T</kbd> Wake Lock • <kbd>H</kbd> Contrast
        </p>
      </footer>
    </div>
  );
}
