import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ClockSettings, ClockColor, ClockStyle, TimeFormat, PresetMode, BackgroundTheme, PRESETS } from './types';

interface ClockContextType {
  settings: ClockSettings;
  updateSettings: (updates: Partial<ClockSettings>) => void;
  applyPreset: (preset: PresetMode) => void;
  getShareableURL: () => string;
  wakeLockStatus: 'active' | 'inactive' | 'unsupported';
  requestWakeLock: () => Promise<void>;
  releaseWakeLock: () => Promise<void>;
  controlsVisible: boolean;
  setControlsVisible: (visible: boolean) => void;
}

const defaultSettings: ClockSettings = {
  color: 'green',
  style: 'digital',
  format: '24',
  showSeconds: true,
  showDate: true,
  keepScreenOn: false,
  preset: 'default',
  backgroundTheme: 'dark',
  customBackground: '#0a0a0f',
  autoHideControls: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'large',
};

const ClockContext = createContext<ClockContextType | undefined>(undefined);

const STORAGE_KEY = 'digibeat-settings';

function parseURLSettings(): Partial<ClockSettings> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const urlSettings: Partial<ClockSettings> = {};
  
  const color = params.get('color');
  if (color && ['red', 'green', 'blue', 'white', 'amber', 'purple', 'pink', 'cyan'].includes(color)) {
    urlSettings.color = color as ClockColor;
  }
  
  const style = params.get('style');
  if (style && ['digital', 'flip', 'pixel', 'neon', 'binary'].includes(style)) {
    urlSettings.style = style as ClockStyle;
  }
  
  const format = params.get('format');
  if (format && ['12', '24'].includes(format)) {
    urlSettings.format = format as TimeFormat;
  }
  
  const preset = params.get('preset');
  if (preset && ['default', 'minimal', 'presentation', 'classroom', 'bedside', 'kitchen', 'streaming'].includes(preset)) {
    urlSettings.preset = preset as PresetMode;
  }
  
  const bg = params.get('bg');
  if (bg && ['dark', 'oled', 'gradient', 'light'].includes(bg)) {
    urlSettings.backgroundTheme = bg as BackgroundTheme;
  }
  
  if (params.has('seconds')) urlSettings.showSeconds = params.get('seconds') === '1' || params.get('seconds') === 'true';
  if (params.has('date')) urlSettings.showDate = params.get('date') === '1' || params.get('date') === 'true';
  if (params.has('keepawake')) urlSettings.keepScreenOn = params.get('keepawake') === '1' || params.get('keepawake') === 'true';
  if (params.has('autohide')) urlSettings.autoHideControls = params.get('autohide') === '1' || params.get('autohide') === 'true';
  if (params.has('reducedmotion')) urlSettings.reducedMotion = params.get('reducedmotion') === '1' || params.get('reducedmotion') === 'true';
  if (params.has('highcontrast')) urlSettings.highContrast = params.get('highcontrast') === '1' || params.get('highcontrast') === 'true';
  
  return urlSettings;
}

export function ClockProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ClockSettings>(() => {
    const urlSettings = parseURLSettings();
    const stored = localStorage.getItem(STORAGE_KEY);
    let storedSettings = defaultSettings;
    
    if (stored) {
      try {
        storedSettings = { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        storedSettings = defaultSettings;
      }
    }
    
    // URL settings override everything
    return { ...storedSettings, ...urlSettings };
  });

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [wakeLockStatus, setWakeLockStatus] = useState<'active' | 'inactive' | 'unsupported'>('inactive');
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Wake Lock on visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && settings.keepScreenOn) {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [settings.keepScreenOn]);

  const requestWakeLock = useCallback(async () => {
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
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      setWakeLockStatus('inactive');
    }
  }, [wakeLock]);

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

  const applyPreset = (preset: PresetMode) => {
    const presetSettings = PRESETS[preset];
    updateSettings({ preset, ...presetSettings });
  };

  const getShareableURL = () => {
    const params = new URLSearchParams();
    params.set('color', settings.color);
    params.set('style', settings.style);
    params.set('format', settings.format);
    params.set('seconds', settings.showSeconds ? '1' : '0');
    params.set('date', settings.showDate ? '1' : '0');
    params.set('keepawake', settings.keepScreenOn ? '1' : '0');
    params.set('autohide', settings.autoHideControls ? '1' : '0');
    params.set('highcontrast', settings.highContrast ? '1' : '0');
    params.set('preset', settings.preset);
    params.set('bg', settings.backgroundTheme);
    
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?${params.toString()}`;
  };

  // Auto-hide controls
  useEffect(() => {
    if (!settings.autoHideControls) {
      setControlsVisible(true);
      return;
    }

    let timeout: number;
    
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (settings.autoHideControls) {
          setControlsVisible(false);
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      timeout = window.setTimeout(() => {
        if (settings.autoHideControls) {
          setControlsVisible(false);
        }
      }, 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial timeout
    timeout = window.setTimeout(() => {
      if (settings.autoHideControls) {
        setControlsVisible(false);
      }
    }, 5000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [settings.autoHideControls]);

  return (
    <ClockContext.Provider value={{ 
      settings, 
      updateSettings, 
      applyPreset, 
      getShareableURL,
      wakeLockStatus, 
      requestWakeLock, 
      releaseWakeLock,
      controlsVisible,
      setControlsVisible,
    }}>
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
