export type ClockColor = 'red' | 'green' | 'blue' | 'white' | 'amber' | 'purple' | 'pink' | 'cyan';
export type ClockStyle = 'digital' | 'flip' | 'pixel' | 'neon' | 'binary';
export type TimeFormat = '12' | '24';
export type PresetMode = 'default' | 'minimal' | 'presentation' | 'classroom' | 'bedside' | 'kitchen' | 'streaming';
export type BackgroundTheme = 'dark' | 'oled' | 'gradient' | 'light' | 'custom';

export interface ClockSettings {
  color: ClockColor;
  style: ClockStyle;
  format: TimeFormat;
  showSeconds: boolean;
  showDate: boolean;
  keepScreenOn: boolean;
  preset: PresetMode;
  backgroundTheme: BackgroundTheme;
  customBackground: string;
  autoHideControls: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
}

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isComplete: boolean;
}

export interface PomodoroState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
  session: number;
}

export const PRESETS: Record<PresetMode, Partial<ClockSettings>> = {
  default: {
    showSeconds: true,
    showDate: true,
    autoHideControls: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'large',
    backgroundTheme: 'dark',
  },
  minimal: {
    showSeconds: true,
    showDate: false,
    autoHideControls: true,
    reducedMotion: true,
    highContrast: false,
    fontSize: 'xlarge',
    backgroundTheme: 'oled',
  },
  presentation: {
    showSeconds: true,
    showDate: true,
    autoHideControls: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'xlarge',
    backgroundTheme: 'dark',
  },
  classroom: {
    showSeconds: true,
    showDate: true,
    autoHideControls: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'large',
    backgroundTheme: 'gradient',
  },
  bedside: {
    showSeconds: false,
    showDate: true,
    autoHideControls: true,
    reducedMotion: true,
    highContrast: false,
    fontSize: 'large',
    backgroundTheme: 'oled',
  },
  kitchen: {
    showSeconds: true,
    showDate: false,
    autoHideControls: false,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    backgroundTheme: 'light',
  },
  streaming: {
    showSeconds: true,
    showDate: false,
    autoHideControls: true,
    reducedMotion: true,
    highContrast: false,
    fontSize: 'large',
    backgroundTheme: 'oled',
  },
};

export const COLORS: Record<ClockColor, { primary: string; glow: string }> = {
  red: { primary: '#ff3333', glow: 'rgba(255, 51, 51, 0.8)' },
  green: { primary: '#00ff88', glow: 'rgba(0, 255, 136, 0.8)' },
  blue: { primary: '#3399ff', glow: 'rgba(51, 153, 255, 0.8)' },
  white: { primary: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)' },
  amber: { primary: '#ffaa00', glow: 'rgba(255, 170, 0, 0.8)' },
  purple: { primary: '#aa66ff', glow: 'rgba(170, 102, 255, 0.8)' },
  pink: { primary: '#ff66aa', glow: 'rgba(255, 102, 170, 0.8)' },
  cyan: { primary: '#00ffff', glow: 'rgba(0, 255, 255, 0.8)' },
};

export const HIGH_CONTRAST_COLORS: Record<ClockColor, { primary: string; glow: string }> = {
  red: { primary: '#ff0000', glow: '#ff0000' },
  green: { primary: '#00ff00', glow: '#00ff00' },
  blue: { primary: '#0088ff', glow: '#0088ff' },
  white: { primary: '#ffffff', glow: '#ffffff' },
  amber: { primary: '#ffcc00', glow: '#ffcc00' },
  purple: { primary: '#cc88ff', glow: '#cc88ff' },
  pink: { primary: '#ff88aa', glow: '#ff88aa' },
  cyan: { primary: '#00ddff', glow: '#00ddff' },
};

export const CITIES: City[] = [
  { id: 'ny', name: 'New York', country: 'USA', timezone: 'America/New_York' },
  { id: 'la', name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { id: 'lon', name: 'London', country: 'UK', timezone: 'Europe/London' },
  { id: 'par', name: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { id: 'ber', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { id: 'tok', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { id: 'sha', name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { id: 'syd', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { id: 'dub', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { id: 'sin', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'mos', name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { id: 'mum', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { id: 'sao', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { id: 'tor', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { id: 'van', name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { id: 'rom', name: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { id: 'mad', name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { id: 'lis', name: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { id: 'war', name: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
  { id: 'prg', name: 'Prague', country: 'Czechia', timezone: 'Europe/Prague' },
  { id: 'vie', name: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna' },
  { id: 'ath', name: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { id: 'ist', name: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { id: 'cai', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { id: 'joh', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { id: 'nbo', name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { id: 'lag', name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { id: 'jkt', name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { id: 'hkg', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { id: 'sel', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { id: 'per', name: 'Perth', country: 'Australia', timezone: 'Australia/Perth' },
  { id: 'mel', name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { id: 'akl', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { id: 'hon', name: 'Honolulu', country: 'USA', timezone: 'Pacific/Honolulu' },
  { id: 'anc', name: 'Anchorage', country: 'USA', timezone: 'America/Anchorage' },
  { id: 'den', name: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { id: 'chi', name: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { id: 'phx', name: 'Phoenix', country: 'USA', timezone: 'America/Phoenix' },
  { id: 'mex', name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { id: 'bog', name: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota' },
  { id: 'lim', name: 'Lima', country: 'Peru', timezone: 'America/Lima' },
  { id: 'scl', name: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
  { id: 'bau', name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
];

export const BACKGROUND_THEMES: Record<BackgroundTheme, { name: string; background: string; gradient?: string }> = {
  dark: { 
    name: 'Dark', 
    background: '#0a0a0f',
    gradient: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
  },
  oled: { 
    name: 'OLED Black', 
    background: '#000000',
    gradient: '#000000',
  },
  gradient: { 
    name: 'Gradient', 
    background: '#1a1a2e',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  light: { 
    name: 'Light', 
    background: '#f5f5f5',
    gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  },
  custom: { 
    name: 'Custom', 
    background: '#0a0a0f',
  },
};
