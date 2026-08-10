import { useState, useEffect, useCallback } from 'react';

export function useTime(format: '12' | '24' = '24') {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const displayHours = format === '12' ? (hours % 12 || 12) : hours;
  const period = hours >= 12 ? 'PM' : 'AM';

  return {
    time,
    hours: displayHours,
    minutes,
    seconds,
    period,
    rawHours: hours,
    formatted: `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}

export function useTimer(initialMinutes: number = 25) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  useEffect(() => {
    let interval: number;
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newMinutes?: number) => {
    setIsRunning(false);
    setIsComplete(false);
    setTotalSeconds((newMinutes ?? initialMinutes) * 60);
  }, [initialMinutes]);

  return { hours, minutes, seconds, isRunning, isComplete, start, pause, reset, setTotalSeconds };
}

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: number;
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const start = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsed);
      setIsRunning(true);
    }
  };

  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setStartTime(null);
    setLaps([]);
  };
  const lap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, elapsed]);
    }
  };

  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const ms = Math.floor((elapsed % 1000) / 10);

  return { hours, minutes, seconds, ms, elapsed, isRunning, start, pause, reset, lap, laps };
}

export function usePomodoro(workMinutes: number = 25, breakMinutes: number = 5) {
  const [time, setTime] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [session, setSession] = useState(1);

  useEffect(() => {
    let interval: number;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            playSound();
            if (!isBreak) {
              setIsBreak(true);
              setSession(s => s + 1);
              return breakMinutes * 60;
            } else {
              setIsBreak(false);
              return workMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isBreak, workMinutes, breakMinutes]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(isBreak ? breakMinutes * 60 : workMinutes * 60);
  };
  const skip = () => {
    playSound();
    if (!isBreak) {
      setIsBreak(true);
      setSession(s => s + 1);
      setTime(breakMinutes * 60);
    } else {
      setIsBreak(false);
      setTime(workMinutes * 60);
    }
  };

  return { minutes, seconds, isRunning, isBreak, session, start, pause, reset, skip };
}

function playSound() {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}
