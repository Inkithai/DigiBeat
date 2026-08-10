import { useClock } from '../ClockContext';

interface NeonClockDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  showSeconds?: boolean;
  period?: string;
}

export function NeonClockDisplay({ hours, minutes, seconds, showSeconds = true, period }: NeonClockDisplayProps) {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const pad = (n: number) => String(n).padStart(2, '0');

  const text = `${pad(hours)}:${pad(minutes)}${showSeconds ? `:${pad(seconds)}` : ''}`;

  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '3rem',
        textAlign: 'center',
      }}
    >
      {/* Glow layers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(4rem, 18vw, 14rem)',
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontWeight: 'bold',
          color: primary,
          filter: `blur(40px) brightness(2)`,
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      >
        {text}
      </div>
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(4rem, 18vw, 14rem)',
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontWeight: 'bold',
          color: primary,
          filter: `blur(20px) brightness(1.5)`,
          opacity: 0.8,
          pointerEvents: 'none',
        }}
      >
        {text}
      </div>

      {/* Main text */}
      <div
        style={{
          fontSize: 'clamp(4rem, 18vw, 14rem)',
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontWeight: 'bold',
          color: primary,
          textShadow: `
            0 0 10px ${glow},
            0 0 20px ${glow},
            0 0 40px ${glow},
            0 0 80px ${glow},
            0 0 120px ${glow}
          `,
          letterSpacing: '0.05em',
          animation: 'neon-flicker 3s infinite',
        }}
      >
        {text}
      </div>

      {period && (
        <div
          style={{
            fontSize: 'clamp(1rem, 4vw, 3rem)',
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontWeight: 'bold',
            color: primary,
            textShadow: `0 0 10px ${glow}, 0 0 20px ${glow}`,
            marginTop: '0.5rem',
            opacity: 0.8,
          }}
        >
          {period}
        </div>
      )}

      <style>{`
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 24%, 55% {
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

import { COLORS } from '../types';
