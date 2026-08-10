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

  const renderClock = () => {
    switch (settings.style) {
      case 'digital':
        return <SimpleDigital hours={hours} minutes={minutes} seconds={seconds} period={settings.format === '12' ? period : undefined} showSeconds={settings.showSeconds} />;
      case 'flip':
        return <FlipClockDisplay hours={hours} minutes={minutes} seconds={seconds} showSeconds={settings.showSeconds} />;
      case 'pixel':
        return <PixelClockDisplay hours={hours} minutes={minutes} seconds={seconds} showSeconds={settings.showSeconds} />;
      case 'neon':
        return <NeonClockDisplay hours={hours} minutes={minutes} seconds={seconds} showSeconds={settings.showSeconds} period={settings.format === '12' ? period : undefined} />;
      case 'binary':
        return <BinaryClockDisplay hours={hours} minutes={minutes} seconds={seconds} showSeconds={settings.showSeconds} />;
      default:
        return <SimpleDigital hours={hours} minutes={minutes} seconds={seconds} period={settings.format === '12' ? period : undefined} showSeconds={settings.showSeconds} />;
    }
  };

  return (
    <div className="page home-page">
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
      </footer>
    </div>
  );
}
