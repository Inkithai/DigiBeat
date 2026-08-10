import { useState } from 'react';
import { COLORS, ClockColor, ClockStyle } from '../types';
import { useClock } from '../ClockContext';

export function SettingsPanel() {
  const { settings, updateSettings } = useClock();
  const [isOpen, setIsOpen] = useState(false);

  const styles: { value: ClockStyle; label: string }[] = [
    { value: 'digital', label: 'Digital' },
    { value: 'flip', label: 'Flip' },
    { value: 'pixel', label: 'Pixel' },
    { value: 'neon', label: 'Neon' },
    { value: 'binary', label: 'Binary' },
  ];

  const colorOptions: { value: ClockColor; label: string }[] = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'white', label: 'White' },
    { value: 'amber', label: 'Amber' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'cyan', label: 'Cyan' },
  ];

  return (
    <div className="settings-container">
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle settings"
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1.2rem',
          backdropFilter: 'blur(10px)',
        }}
      >
        ⚙ {isOpen ? 'Close' : 'Settings'}
      </button>

      {isOpen && (
        <div 
          className="settings-panel"
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: 'rgba(10, 10, 20, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '90vw',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.1rem' }}>
            Clock Settings
          </h3>

          {/* Clock Style */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Style
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {styles.map(style => (
                <button
                  key={style.value}
                  onClick={() => updateSettings({ style: style.value })}
                  style={{
                    padding: '10px 16px',
                    background: settings.style === style.value ? COLORS[settings.color].primary : 'rgba(255,255,255,0.1)',
                    color: settings.style === style.value ? '#000' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ color: color.value })}
                  aria-label={color.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: COLORS[color.value].primary,
                    border: settings.color === color.value ? '3px solid white' : '2px solid transparent',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: `0 0 10px ${COLORS[color.value].glow}`,
                    transition: 'transform 0.2s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Time Format
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['12', '24'] as const).map(format => (
                <button
                  key={format}
                  onClick={() => updateSettings({ format })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: settings.format === format ? COLORS[settings.color].primary : 'rgba(255,255,255,0.1)',
                    color: settings.format === format ? '#000' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {format === '12' ? '12 Hour' : '24 Hour'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ToggleSwitch
              label="Show Seconds"
              checked={settings.showSeconds}
              onChange={(checked) => updateSettings({ showSeconds: checked })}
              color={settings.color}
            />
            <ToggleSwitch
              label="Show Date"
              checked={settings.showDate}
              onChange={(checked) => updateSettings({ showDate: checked })}
              color={settings.color}
            />
            <ToggleSwitch
              label="Keep Screen On"
              checked={settings.keepScreenOn}
              onChange={(checked) => updateSettings({ keepScreenOn: checked })}
              color={settings.color}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color: ClockColor;
}

function ToggleSwitch({ label, checked, onChange, color }: ToggleSwitchProps) {
  const { primary, glow } = COLORS[color];
  
  return (
    <label style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: '8px 0',
    }}>
      <span style={{ color: 'white', fontSize: '0.9rem' }}>{label}</span>
      <div 
        onClick={() => onChange(!checked)}
        style={{
          width: '50px',
          height: '28px',
          background: checked ? primary : 'rgba(255,255,255,0.2)',
          borderRadius: '14px',
          position: 'relative',
          transition: 'background 0.2s ease',
          boxShadow: checked ? `0 0 10px ${glow}` : 'none',
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
    </label>
  );
}
