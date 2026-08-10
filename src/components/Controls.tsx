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
      aria-label="Toggle fullscreen mode"
      aria-keyshortcuts="F"
      style={{
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '1rem',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
      }}
    >
      ⛶ Fullscreen
    </button>
  );
}

export function WakeLockStatus() {
  const { wakeLockStatus, requestWakeLock } = useClock();

  if (wakeLockStatus === 'unsupported') {
    return null;
  }

  const isActive = wakeLockStatus === 'active';
  
  return (
    <button
      onClick={requestWakeLock}
      aria-label={isActive ? 'Screen will stay awake' : 'Click to keep screen awake'}
      className={`wake-lock-status ${isActive ? 'active' : 'inactive'}`}
      title={isActive ? 'Screen will stay awake' : 'Click to keep screen awake'}
    >
      <span className="wake-lock-dot" />
      {isActive ? 'Screen Awake' : 'Keep Awake'}
    </button>
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
  const primaryColor = color || (settings.highContrast ? '#ffffff' : '#00ff88');
  const glow = color || (settings.highContrast ? '#ffffff' : 'rgba(0,255,136,0.8)');

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
