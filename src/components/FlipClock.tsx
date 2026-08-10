import { useState, useEffect } from 'react';
import { COLORS, ClockColor } from '../types';
import { useClock } from '../ClockContext';

interface FlipCardProps {
  value: string;
  color: ClockColor;
  label?: string;
}

function FlipCard({ value, color, label }: FlipCardProps) {
  const { primary, glow } = COLORS[color];
  const [flipping, setFlipping] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setFlipping(true);
      const timeout = setTimeout(() => {
        setPrevValue(value);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <div className="flip-card-container">
      <div 
        className="flip-card"
        style={{ 
          background: `linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)`,
          borderRadius: '8px',
          boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div 
          className="flip-card-value"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            fontFamily: "'Roboto Mono', 'SF Mono', monospace",
            fontWeight: 'bold',
            color: primary,
            textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            transition: flipping ? 'transform 0.3s ease-in-out' : 'none',
            transform: flipping ? 'rotateX(-90deg)' : 'rotateX(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          {value}
        </div>
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      </div>
      {label && (
        <div 
          style={{ 
            textAlign: 'center', 
            color: primary, 
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginTop: '0.5rem',
            opacity: 0.7,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

interface FlipClockDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  showSeconds?: boolean;
}

export function FlipClockDisplay({ hours, minutes, seconds, showSeconds = true }: FlipClockDisplayProps) {
  const { settings } = useClock();
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(0.5rem, 2vw, 1.5rem)',
        padding: '2rem',
      }}
    >
      <FlipCard value={pad(hours)} color={settings.color} label="Hours" />
      <Separator color={settings.color} />
      <FlipCard value={pad(minutes)} color={settings.color} label="Minutes" />
      {showSeconds && (
        <>
          <Separator color={settings.color} />
          <FlipCard value={pad(seconds)} color={settings.color} label="Seconds" />
        </>
      )}
    </div>
  );
}

function Separator({ color }: { color: ClockColor }) {
  const { primary, glow } = COLORS[color];
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        padding: '1rem 0',
      }}
    >
      <div 
        style={{ 
          width: 'clamp(0.5rem, 1vw, 1rem)', 
          height: 'clamp(0.5rem, 1vw, 1rem)', 
          borderRadius: '50%',
          background: primary,
          boxShadow: `0 0 10px ${glow}`,
        }} 
      />
      <div 
        style={{ 
          width: 'clamp(0.5rem, 1vw, 1rem)', 
          height: 'clamp(0.5rem, 1vw, 1rem)', 
          borderRadius: '50%',
          background: primary,
          boxShadow: `0 0 10px ${glow}`,
        }} 
      />
    </div>
  );
}
