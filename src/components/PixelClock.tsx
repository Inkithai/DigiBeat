import { COLORS, ClockColor } from '../types';
import { useClock } from '../ClockContext';

const PIXEL_SIZE = 8;

const FONT: Record<string, (0 | 1)[][]> = {
  '0': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '1': [
    [0,1,1,0,0],
    [1,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  '2': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  '3': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  '4': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  '6': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  '8': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '9': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  ':': [
    [0],
    [1],
    [0],
    [1],
    [0],
  ],
};

interface PixelDigitProps {
  char: string;
  color: ClockColor;
  scale?: number;
}

function PixelDigit({ char, color, scale = 1 }: PixelDigitProps) {
  const { primary, glow } = COLORS[color];
  const pattern = FONT[char] || FONT['0'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {pattern.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '2px' }}>
          {row.map((pixel, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: PIXEL_SIZE * scale,
                height: PIXEL_SIZE * scale,
                backgroundColor: pixel ? primary : 'transparent',
                boxShadow: pixel ? `0 0 ${4 * scale}px ${glow}, inset 0 0 ${2 * scale}px rgba(255,255,255,0.3)` : 'none',
                borderRadius: '1px',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PixelClockDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  showSeconds?: boolean;
  scale?: number;
}

export function PixelClockDisplay({ hours, minutes, seconds, showSeconds = true, scale = 2 }: PixelClockDisplayProps) {
  const { settings } = useClock();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(hours)}:${pad(minutes)}${showSeconds ? `:${pad(seconds)}` : ''}`;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 16px)',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
        borderRadius: '16px',
        border: '2px solid rgba(255,255,255,0.1)',
      }}
    >
      {timeStr.split('').map((char, index) => (
        <PixelDigit 
          key={index} 
          char={char} 
          color={settings.color} 
          scale={scale}
        />
      ))}
    </div>
  );
}
