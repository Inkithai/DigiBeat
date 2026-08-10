import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../types';
import { useClock } from '../ClockContext';

export function Navigation() {
  const location = useLocation();
  const { settings } = useClock();
  const { primary } = COLORS[settings.color];

  const navItems = [
    { path: '/', label: 'Clock' },
    { path: '/timer', label: 'Timer' },
    { path: '/stopwatch', label: 'Stopwatch' },
    { path: '/pomodoro', label: 'Pomodoro' },
    { path: '/world-clock', label: 'World Clock' },
  ];

  return (
    <nav 
      style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'rgba(10, 10, 20, 0.8)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isActive ? '#000' : 'white',
              background: isActive ? primary : 'transparent',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 0 15px ${COLORS[settings.color].glow}` : 'none',
            }}
            onMouseOver={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
