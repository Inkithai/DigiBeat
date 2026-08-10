import { useClock } from '../ClockContext';
import { COLORS, ClockColor } from '../types';

interface BinaryColumnProps {
  value: number;
  color: ClockColor;
  maxDigits: number;
  label?: string;
}

function BinaryColumn({ value, maxDigits, label, color }: BinaryColumnProps) {
  const { primary, glow } = COLORS[color];
  const bits = value.toString(2).padStart(maxDigits, '0').split('').reverse();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      {bits.map((bit, index) => (
        <div
          key={index}
          style={{
            width: 'clamp(1rem, 3vw, 2.5rem)',
            height: 'clamp(1rem, 3vw, 2.5rem)',
            borderRadius: '50%',
            background: bit === '1' ? primary : 'rgba(255,255,255,0.1)',
            boxShadow: bit === '1' ? `0 0 10px ${glow}, 0 0 20px ${glow}, inset 0 0 10px rgba(255,255,255,0.3)` : 'inset 0 0 5px rgba(0,0,0,0.5)',
            border: `2px solid ${bit === '1' ? primary : 'rgba(255,255,255,0.2)'}`,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
      {label && (
        <div style={{ 
          color: primary, 
          fontSize: '0.7rem',
          marginTop: '8px',
          opacity: 0.7,
          textTransform: 'uppercase',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

interface BinaryClockDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  showSeconds?: boolean;
}

export function BinaryClockDisplay({ hours, minutes, seconds, showSeconds = true }: BinaryClockDisplayProps) {
  const { settings } = useClock();
  const color = settings.color;
  
  const h1 = Math.floor(hours / 10);
  const h2 = hours % 10;
  const m1 = Math.floor(minutes / 10);
  const m2 = minutes % 10;
  const s1 = Math.floor(seconds / 10);
  const s2 = seconds % 10;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 'clamp(1rem, 4vw, 3rem)',
        padding: '3rem',
        background: 'linear-gradient(135deg, #0a0a15 0%, #151525 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Hours */}
      <BinaryColumn value={h1} maxDigits={2} label="H" color={color} />
      <BinaryColumn value={h2} maxDigits={3} label="" color={color} />
      
      <Colon color={color} />
      
      {/* Minutes */}
      <BinaryColumn value={m1} maxDigits={3} label="" color={color} />
      <BinaryColumn value={m2} maxDigits={4} label="" color={color} />
      
      {showSeconds && (
        <>
          <Colon color={color} />
          
          {/* Seconds */}
          <BinaryColumn value={s1} maxDigits={3} label="" color={color} />
          <BinaryColumn value={s2} maxDigits={4} label="" color={color} />
        </>
      )}
    </div>
  );
}

function Colon({ color }: { color: ClockColor }) {
  const { primary, glow } = COLORS[color];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            width: 'clamp(0.5rem, 1.5vw, 1rem)',
            height: 'clamp(0.5rem, 1.5vw, 1rem)',
            borderRadius: '50%',
            background: primary,
            boxShadow: `0 0 8px ${glow}`,
          }}
        />
      ))}
    </div>
  );
}
