import { WorldClock } from '../components/WorldClock';
import { Navigation } from '../components/Navigation';

export function WorldClockPage() {
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
