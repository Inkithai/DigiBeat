import { useState } from 'react';
import { COLORS, ClockColor, ClockStyle, PresetMode, BackgroundTheme, BACKGROUND_THEMES } from '../types';
import { useClock } from '../ClockContext';

interface ShareModalProps {
  onClose: () => void;
}

function ShareModal({ onClose }: ShareModalProps) {
  const { getShareableURL, settings } = useClock();
  const [copied, setCopied] = useState(false);
  const url = getShareableURL();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateQRCode = () => {
    // Simple QR code generation using a data URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrUrl;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
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
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255,255,255,0.1)',
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Share Your Clock</h2>
        
        {/* QR Code */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src={generateQRCode()} 
            alt="QR Code" 
            style={{ 
              borderRadius: '12px', 
              border: '4px solid white',
              maxWidth: '200px',
            }} 
          />
        </div>
        
        {/* URL */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
            Shareable URL
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={url}
              readOnly
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                padding: '12px 20px',
                background: copied ? '#00ff88' : COLORS[settings.color].primary,
                color: '#000',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Current Config Summary */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '1rem',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Current Configuration:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ 
              background: COLORS[settings.color].primary, 
              color: '#000', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}>
              {settings.style}
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
            }}>
              {settings.format === '12' ? '12h' : '24h'}
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
            }}>
              {settings.showSeconds ? 'Seconds ON' : 'Seconds OFF'}
            </span>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
            }}>
              {BACKGROUND_THEMES[settings.backgroundTheme].name}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const { settings, updateSettings, applyPreset, controlsVisible, setControlsVisible } = useClock();
  const [isOpen, setIsOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const styles: { value: ClockStyle; label: string }[] = [
    { value: 'digital', label: 'Digital' },
    { value: 'flip', label: 'Flip' },
    { value: 'pixel', label: 'Pixel' },
    { value: 'neon', label: 'Neon' },
    { value: 'binary', label: 'Binary' },
  ];

  const presets: { value: PresetMode; label: string; icon: string }[] = [
    { value: 'default', label: 'Default', icon: '⚙' },
    { value: 'minimal', label: 'Minimal', icon: '◻' },
    { value: 'presentation', label: 'Present', icon: '📽' },
    { value: 'classroom', label: 'Class', icon: '📚' },
    { value: 'bedside', label: 'Bedside', icon: '🌙' },
    { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { value: 'streaming', label: 'Stream', icon: '📹' },
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

  const backgroundOptions: BackgroundTheme[] = ['dark', 'oled', 'gradient', 'light'];

  if (!controlsVisible) {
    return (
      <button 
        onClick={() => setControlsVisible(true)}
        aria-label="Show controls"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1.5rem',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
        }}
      >
        ⚙
      </button>
    );
  }

  return (
    <>
      <div className="settings-container">
        <button 
          className="settings-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle settings"
          aria-expanded={isOpen}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          ⚙ {isOpen ? 'Close' : 'Settings'}
        </button>

        {isOpen && (
          <div 
            className="settings-panel"
            role="dialog"
            aria-label="Clock settings"
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              background: 'rgba(10, 10, 20, 0.98)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              minWidth: '320px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '1.1rem' }}>
              Clock Settings
            </h3>

            {/* Presets */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Quick Presets
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {presets.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => applyPreset(preset.value)}
                    title={preset.label}
                    style={{
                      padding: '8px 12px',
                      background: settings.preset === preset.value ? COLORS[settings.color].primary : 'rgba(255,255,255,0.1)',
                      color: settings.preset === preset.value ? '#000' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {preset.icon}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Background */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Background
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {backgroundOptions.map(bg => (
                  <button
                    key={bg}
                    onClick={() => updateSettings({ backgroundTheme: bg })}
                    style={{
                      padding: '8px 12px',
                      background: settings.backgroundTheme === bg ? COLORS[settings.color].primary : 'rgba(255,255,255,0.1)',
                      color: settings.backgroundTheme === bg ? '#000' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    {BACKGROUND_THEMES[bg].name}
                  </button>
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

            {/* Font Size */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Font Size
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: settings.fontSize === size ? COLORS[settings.color].primary : 'rgba(255,255,255,0.1)',
                      color: settings.fontSize === size ? '#000' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {size.charAt(0).toUpperCase()}
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
                label="Keep Screen Awake"
                checked={settings.keepScreenOn}
                onChange={(checked) => updateSettings({ keepScreenOn: checked })}
                color={settings.color}
              />
              <ToggleSwitch
                label="Auto-Hide Controls"
                checked={settings.autoHideControls}
                onChange={(checked) => updateSettings({ autoHideControls: checked })}
                color={settings.color}
              />
              <ToggleSwitch
                label="High Contrast Mode"
                checked={settings.highContrast}
                onChange={(checked) => updateSettings({ highContrast: checked })}
                color={settings.color}
              />
              <ToggleSwitch
                label="Reduced Motion"
                checked={settings.reducedMotion}
                onChange={(checked) => updateSettings({ reducedMotion: checked })}
                color={settings.color}
              />
            </div>

            {/* Share Button */}
            <button
              onClick={() => setShowShare(true)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: COLORS[settings.color].primary,
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: `0 0 20px ${COLORS[settings.color].glow}`,
              }}
            >
              🔗 Share Clock
            </button>
          </div>
        )}
      </div>

      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
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
      userSelect: 'none',
    }}>
      <span style={{ color: 'white', fontSize: '0.9rem' }}>{label}</span>
      <div 
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onChange(!checked);
          }
        }}
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
