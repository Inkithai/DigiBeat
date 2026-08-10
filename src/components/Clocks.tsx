import { useMemo } from 'react';
import { COLORS, ClockColor } from '../types';
import { useClock } from '../ClockContext';

interface DigitProps {
  value: number;
  color: ClockColor;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

function SevenSegmentDigit({ value, color, size = 'medium' }: DigitProps) {
  const { primary, glow } = COLORS[color];
  const segments = useMemo(() => {
    const patterns: Record<string, boolean[]> = {
      '0': [true, true, true, true, true, true, false],
      '1': [false, true, true, false, false, false, false],
      '2': [true, true, false, true, true, false, true],
      '3': [true, true, true, true, false, false, true],
      '4': [false, true, true, false, false, true, true],
      '5': [true, false, true, true, false, true, true],
      '6': [true, false, true, true, true, true, true],
      '7': [true, true, true, false, false, false, false],
      '8': [true, true, true, true, true, true, true],
      '9': [true, true, true, true, false, true, true],
    };
    return patterns[String(value)] || patterns['0'];
  }, [value]);

  const sizeClasses = {
    small: { width: 30, height: 50 },
    medium: { width: 60, height: 100 },
    large: { width: 90, height: 150 },
    xlarge: { width: 120, height: 200 },
  };

  const { width, height } = sizeClasses[size];

  return (
    <svg width={width} height={height} viewBox="0 0 60 100" style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
      {/* Segment A - Top */}
      <polygon
        points="12,5 48,5 45,15 15,15"
        fill={segments[0] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment B - Top Right */}
      <polygon
        points="50,10 50,45 45,50 45,20"
        fill={segments[1] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment C - Bottom Right */}
      <polygon
        points="50,55 50,90 45,95 45,55"
        fill={segments[2] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment D - Bottom */}
      <polygon
        points="15,85 45,85 48,95 12,95"
        fill={segments[3] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment E - Bottom Left */}
      <polygon
        points="10,55 10,90 15,95 15,55"
        fill={segments[4] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment F - Top Left */}
      <polygon
        points="10,10 10,45 15,50 15,20"
        fill={segments[5] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
      {/* Segment G - Middle */}
      <polygon
        points="15,48 45,48 42,52 18,52"
        fill={segments[6] ? primary : `${primary}22`}
        stroke={primary}
        strokeWidth="0.5"
      />
    </svg>
  );
}

interface DigitalClockDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  showSeconds?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export function DigitalClockDisplay({ hours, minutes, seconds, showSeconds = true, size = 'large' }: DigitalClockDisplayProps) {
  const { settings } = useClock();
  const color = settings.color;
  const { primary, glow } = COLORS[color];

  return (
    <div 
      className="clock-display"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: primary,
        textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}`,
        fontFamily: 'monospace',
      }}
    >
      <SevenSegmentDigit value={Math.floor(hours / 10)} color={color} size={size} />
      <SevenSegmentDigit value={hours % 10} color={color} size={size} />
      <Colon size={size} color={color} />
      <SevenSegmentDigit value={Math.floor(minutes / 10)} color={color} size={size} />
      <SevenSegmentDigit value={minutes % 10} color={color} size={size} />
      {showSeconds && (
        <>
          <Colon size={size} color={color} />
          <SevenSegmentDigit value={Math.floor(seconds / 10)} color={color} size={size} />
          <SevenSegmentDigit value={seconds % 10} color={color} size={size} />
        </>
      )}
    </div>
  );
}

function Colon({ size, color }: { size: 'small' | 'medium' | 'large' | 'xlarge'; color: ClockColor }) {
  const { primary, glow } = COLORS[color];
  const heights = { small: 50, medium: 100, large: 150, xlarge: 200 };
  const dotSize = { small: 8, medium: 12, large: 18, xlarge: 24 };
  const h = heights[size];
  const r = dotSize[size];

  return (
    <svg width={r * 1.5} height={h} viewBox={`0 0 15 ${h}`} style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
      <circle cx="7.5" cy={h * 0.3} r={r / 2} fill={primary} />
      <circle cx="7.5" cy={h * 0.7} r={r / 2} fill={primary} />
    </svg>
  );
}

interface SimpleDigitalProps {
  hours: number;
  minutes: number;
  seconds: number;
  period?: string;
  showSeconds?: boolean;
}

export function SimpleDigital({ hours, minutes, seconds, period, showSeconds = true }: SimpleDigitalProps) {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div 
      className="simple-digital"
      style={{ 
        fontFamily: "'Orbitron', 'Roboto Mono', monospace",
        fontSize: 'clamp(3rem, 15vw, 12rem)',
        fontWeight: 'bold',
        color: primary,
        textShadow: `0 0 30px ${glow}, 0 0 60px ${glow}, 0 0 90px ${glow}`,
        letterSpacing: '0.05em',
        userSelect: 'none',
      }}
    >
      {pad(hours)}:{pad(minutes)}
      {showSeconds && `:${pad(seconds)}`}
      {period && (
        <span style={{ fontSize: '0.3em', marginLeft: '0.5em', opacity: 0.8 }}>
          {period}
        </span>
      )}
    </div>
  );
}
