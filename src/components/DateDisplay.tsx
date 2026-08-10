interface DateDisplayProps {
  date: Date;
}

export function DateDisplay({ date }: DateDisplayProps) {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formatted = date.toLocaleDateString('en-US', options);

  return (
    <div 
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 'clamp(1rem, 3vw, 1.8rem)',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: '1rem',
        letterSpacing: '0.05em',
      }}
    >
      {formatted}
    </div>
  );
}

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  color?: string;
  glow?: string;
  isBreak?: boolean;
}

export function TimerDisplay({ hours, minutes, seconds, color = '#00ff88', glow = 'rgba(0,255,136,0.8)', isBreak = false }: TimerDisplayProps) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const displayColor = isBreak ? '#ff6b6b' : color;
  const displayGlow = isBreak ? 'rgba(255,107,107,0.8)' : glow;

  return (
    <div 
      style={{
        fontFamily: "'Orbitron', 'Roboto Mono', monospace",
        fontSize: 'clamp(4rem, 20vw, 16rem)',
        fontWeight: 'bold',
        color: displayColor,
        textShadow: `
          0 0 20px ${displayGlow},
          0 0 40px ${displayGlow},
          0 0 60px ${displayGlow},
          0 0 80px ${displayGlow}
        `,
        letterSpacing: '0.1em',
        userSelect: 'none',
      }}
    >
      {hours > 0 && `${pad(hours)}:`}{pad(minutes)}:{pad(seconds)}
    </div>
  );
}

interface StopwatchDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
  color?: string;
  glow?: string;
}

export function StopwatchDisplay({ hours, minutes, seconds, ms, color = '#00ff88', glow = 'rgba(0,255,136,0.8)' }: StopwatchDisplayProps) {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  return (
    <div 
      style={{
        fontFamily: "'Orbitron', 'Roboto Mono', monospace",
        fontSize: 'clamp(3rem, 15vw, 12rem)',
        fontWeight: 'bold',
        color: color,
        textShadow: `
          0 0 20px ${glow},
          0 0 40px ${glow},
          0 0 60px ${glow}
        `,
        letterSpacing: '0.05em',
        userSelect: 'none',
      }}
    >
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      <span style={{ fontSize: '0.4em', opacity: 0.8 }}>.{pad(ms, 2)}</span>
    </div>
  );
}
