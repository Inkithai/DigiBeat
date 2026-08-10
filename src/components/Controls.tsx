import { COLORS } from '../types';
import { useClock } from '../ClockContext';

export function FullscreenButton() {
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      aria-label="Toggle fullscreen"
      style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1.2rem',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
      }}
    >
      ⛶ Fullscreen
    </button>
  );
}

export function WakeLockStatus() {
  const { wakeLockStatus } = useClock();

  if (wakeLockStatus === 'unsupported') {
    return null;
  }

  const isActive = wakeLockStatus === 'active';
  
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: isActive ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        fontSize: '0.85rem',
        color: isActive ? '#00ff88' : 'rgba(255,255,255,0.6)',
      }}
    >
      <div 
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isActive ? '#00ff88' : 'rgba(255,255,255,0.4)',
          boxShadow: isActive ? '0 0 8px #00ff88' : 'none',
        }}
      />
      {isActive ? 'Screen Awake' : 'Screen Lock Off'}
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  color?: string;
}

export function Button({ children, onClick, variant = 'secondary', size = 'medium', disabled = false, color }: ButtonProps) {
  const { settings } = useClock();
  const primaryColor = color || COLORS[settings.color].primary;
  const glow = color || COLORS[settings.color].glow;

  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: size === 'small' ? '0.9rem' : size === 'large' ? '1.3rem' : '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: primaryColor,
      color: '#000',
      boxShadow: `0 0 20px ${glow}`,
    },
    secondary: {
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    danger: {
      background: '#ff4444',
      color: 'white',
      boxShadow: '0 0 10px rgba(255,68,68,0.5)',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyles, ...variants[variant] }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );
}
