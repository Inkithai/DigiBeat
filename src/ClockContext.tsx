import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClockSettings } from './types';

interface ClockContextType {
  settings: ClockSettings;
  updateSettings: (updates: Partial<ClockSettings>) => void;
  wakeLockStatus: 'active' | 'inactive' | 'unsupported';
  requestWakeLock: () => Promise<void>;
  releaseWakeLock: () => Promise<void>;
}

const defaultSettings: ClockSettings = {
  color: 'green',
  style: 'digital',
  format: '24',
  showSeconds: true,
  showDate: true,
  keepScreenOn: false,
};

const ClockContext = createContext<ClockContextType | undefined>(undefined);

const STORAGE_KEY = 'digibeat-settings';

export function ClockProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ClockSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [wakeLockStatus, setWakeLockStatus] = useState<'active' | 'inactive' | 'unsupported'>('inactive');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && settings.keepScreenOn) {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [settings.keepScreenOn]);

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      setWakeLockStatus('unsupported');
      return;
    }
    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setWakeLockStatus('active');
      lock.addEventListener('release', () => {
        setWakeLockStatus('inactive');
      });
    } catch {
      setWakeLockStatus('inactive');
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      setWakeLockStatus('inactive');
    }
  };

  const updateSettings = (updates: Partial<ClockSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      if ('keepScreenOn' in updates) {
        if (updates.keepScreenOn) {
          requestWakeLock();
        } else {
          releaseWakeLock();
        }
      }
      return newSettings;
    });
  };

  return (
    <ClockContext.Provider value={{ settings, updateSettings, wakeLockStatus, requestWakeLock, releaseWakeLock }}>
      {children}
    </ClockContext.Provider>
  );
}

export function useClock() {
  const context = useContext(ClockContext);
  if (!context) {
    throw new Error('useClock must be used within a ClockProvider');
  }
  return context;
}
