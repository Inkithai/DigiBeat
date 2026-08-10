import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClockProvider } from './ClockContext';
import { HomePage } from './pages/Home';
import { TimerPage } from './pages/Timer';
import { StopwatchPage } from './pages/Stopwatch';
import { PomodoroPage } from './pages/Pomodoro';
import { WorldClockPage } from './pages/WorldClockPage';
import './styles.css';

function App() {
  return (
    <ClockProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/stopwatch" element={<StopwatchPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/world-clock" element={<WorldClockPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ClockProvider>
  );
}

export default App;
