import { useState, useEffect, useCallback } from 'react';
import { COLORS } from '../types';
import { useClock } from '../ClockContext';

interface Alarm {
  id: string;
  time: { hours: number; minutes: number };
  label: string;
  enabled: boolean;
  days: number[]; // 0 = Sunday, 6 = Saturday, empty = once
  triggered: boolean;
}

const DEFAULT_ALARMS: Alarm[] = [];

export function AlarmClock() {
  const { settings } = useClock();
  const { primary, glow } = COLORS[settings.color];
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const stored = localStorage.getItem('digibeat-alarms');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_ALARMS;
      }
    }
    return DEFAULT_ALARMS;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEditor, setShowEditor] = useState(false);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('digibeat-alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for alarm triggers
  useEffect(() => {
    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentDay = now.getDay();

    alarms.forEach(alarm => {
      if (!alarm.enabled || alarm.triggered) return;

      if (alarm.time.hours === currentHours && alarm.time.minutes === currentMinutes) {
        // Check if alarm should trigger today
        if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
          // Trigger alarm
          setAlarms(prev => prev.map(a => 
            a.id === alarm.id ? { ...a, triggered: true } : a
          ));
          playAlarmSound();
        }
      }
    });
  }, [currentTime, alarms]);

  const playAlarmSound = useCallback(() => {
    // Create audio context for alarm sound
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Play alarm sound pattern
      const playPattern = () => {
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.value = 880;
        oscillator2.frequency.value = 1100;
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        
        oscillator1.stop(audioContext.currentTime + 0.2);
        oscillator2.stop(audioContext.currentTime + 0.2);
      };

      // Play pattern twice
      playPattern();
      setTimeout(playPattern, 300);
      setTimeout(playPattern, 600);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  const addAlarm = (alarm: Omit<Alarm, 'id' | 'triggered'>) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: Date.now().toString(),
      triggered: false,
    };
    setAlarms([...alarms, newAlarm]);
    setShowEditor(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const dismissAlarm = (id: string) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, triggered: false } : a
    ));
  };

  const snoozeAlarm = (id: string) => {
    // Snooze for 5 minutes
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
      setAlarms(alarms.map(a => 
        a.id === id ? { ...a, time: { hours: snoozeTime.getHours(), minutes: snoozeTime.getMinutes() }, triggered: false } : a
      ));
    }
  };

  const formatTime = (hours: number, minutes: number) => {
    const h = settings.format === '12' ? (hours % 12 || 12) : hours;
    const period = settings.format === '12' ? (hours >= 12 ? 'PM' : 'AM') : '';
    return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`.trim();
  };

  const currentAlarm = alarms.find(a => a.triggered);

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {/* Current Time Display */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          fontFamily: "'Orbitron', monospace",
          fontSize: 'clamp(3rem, 12vw, 6rem)',
          fontWeight: 'bold',
          color: primary,
          textShadow: `0 0 20px ${glow}`,
        }}>
          {formatTime(currentTime.getHours(), currentTime.getMinutes())}
        </div>
        <div style={{ 
          fontFamily: "'Orbitron', monospace",
          fontSize: 'clamp(1.5rem, 5vw, 3rem)',
          color: primary,
          opacity: 0.6,
        }}>
          :{String(currentTime.getSeconds()).padStart(2, '0')}
        </div>
        <div style={{ 
          color: 'rgba(255,255,255,0.6)',
          marginTop: '0.5rem',
          fontSize: '1rem',
        }}>
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Triggered Alarm Alert */}
      {currentAlarm && (
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          animation: 'pulse 1s infinite',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            {formatTime(currentAlarm.time.hours, currentAlarm.time.minutes)}
          </div>
          <div style={{ color: 'white', opacity: 0.9, marginBottom: '1.5rem' }}>
            {currentAlarm.label || 'Alarm'}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => snoozeAlarm(currentAlarm.id)}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              😴 Snooze 5min
            </button>
            <button
              onClick={() => dismissAlarm(currentAlarm.id)}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                color: '#ff6b6b',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              ✓ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Alarms List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Alarms</h2>
        <button
          onClick={() => setShowEditor(true)}
          style={{
            padding: '10px 20px',
            background: primary,
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: `0 0 15px ${glow}`,
          }}
        >
          + Add Alarm
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {alarms.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
          }}>
            No alarms set. Tap "+ Add Alarm" to create one.
          </div>
        ) : (
          alarms.map(alarm => (
            <div
              key={alarm.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: alarm.enabled ? 'rgba(20, 20, 35, 0.8)' : 'rgba(20, 20, 35, 0.4)',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                border: `1px solid ${alarm.enabled ? primary : 'rgba(255,255,255,0.1)'}`,
                opacity: alarm.enabled ? 1 : 0.5,
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                <div style={{ 
                  fontFamily: "'Orbitron', monospace",
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: alarm.enabled ? primary : 'rgba(255,255,255,0.5)',
                  textShadow: alarm.enabled ? `0 0 10px ${glow}` : 'none',
                }}>
                  {formatTime(alarm.time.hours, alarm.time.minutes)}
                </div>
                {alarm.label && (
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                    {alarm.label}
                  </div>
                )}
                {alarm.days.length > 0 && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {alarm.days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  style={{
                    background: 'rgba(255,68,68,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                  }}
                >
                  ×
                </button>
                <ToggleSwitch 
                  checked={alarm.enabled} 
                  onChange={() => toggleAlarm(alarm.id)}
                  color={settings.color}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alarm Editor Modal */}
      {showEditor && (
        <AlarmEditor 
          onSave={addAlarm}
          onClose={() => setShowEditor(false)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}

interface AlarmEditorProps {
  onSave: (alarm: Omit<Alarm, 'id' | 'triggered'>) => void;
  onClose: () => void;
}

function AlarmEditor({ onSave, onClose }: AlarmEditorProps) {
  const { settings } = useClock();
  const { primary } = COLORS[settings.color];
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [repeat, setRepeat] = useState(false);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    onSave({
      time: { hours, minutes },
      label,
      enabled: true,
      days: repeat ? selectedDays : [],
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(10px)',
    }} onClick={onClose}>
      <div style={{
        background: 'rgba(20, 20, 35, 0.98)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        border: '1px solid rgba(255,255,255,0.1)',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Set Alarm</h2>

        {/* Time Picker */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <select
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            style={{
              padding: '1rem',
              fontSize: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              fontFamily: "'Orbitron', monospace",
              cursor: 'pointer',
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '2rem', color: 'white' }}>:</span>
          <select
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            style={{
              padding: '1rem',
              fontSize: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              fontFamily: "'Orbitron', monospace",
              cursor: 'pointer',
            }}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
            Label (optional)
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Wake up, Meeting, etc."
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Repeat Toggle */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <ToggleSwitch 
              checked={repeat} 
              onChange={(v) => setRepeat(v)}
              color={settings.color}
            />
            <span style={{ color: 'white' }}>Repeat</span>
          </label>
        </div>

        {/* Days Selector */}
        {repeat && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {days.map((day, index) => (
              <button
                key={day}
                onClick={() => toggleDay(index)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: selectedDays.includes(index) ? primary : 'rgba(255,255,255,0.1)',
                  color: selectedDays.includes(index) ? '#000' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {day.charAt(0)}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              background: primary,
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: `0 0 15px ${COLORS[settings.color].glow}`,
            }}
          >
            Save Alarm
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color: string;
}

function ToggleSwitch({ checked, onChange, color }: ToggleSwitchProps) {
  const { primary, glow } = COLORS[color as keyof typeof COLORS] || { primary: '#00ff88', glow: 'rgba(0,255,136,0.8)' };
  
  return (
    <div 
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      style={{
        width: '50px',
        height: '28px',
        background: checked ? primary : 'rgba(255,255,255,0.2)',
        borderRadius: '14px',
        position: 'relative',
        transition: 'background 0.2s ease',
        boxShadow: checked ? `0 0 10px ${glow}` : 'none',
        cursor: 'pointer',
      }}
    >
      <div 
        style={{
          width: '24px',
          height: '24px',
          background: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: checked ? '24px' : '2px',
          transition: 'left 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}
