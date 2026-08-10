import { useState, useMemo, useEffect } from 'react';
import { CITIES, City, COLORS } from '../types';
import { useClock } from '../ClockContext';

export function WorldClock() {
  const { settings } = useClock();
  const [selectedCities, setSelectedCities] = useState<City[]>([
    CITIES[3], // Paris
    CITIES[5], // Tokyo
    CITIES[0], // New York
  ]);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCities = useMemo(() => {
    return CITIES.filter(city => 
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
    ).filter(city => !selectedCities.some(sc => sc.id === city.id));
  }, [search, selectedCities]);

  const addCity = (city: City) => {
    setSelectedCities([...selectedCities, city]);
    setShowPicker(false);
    setSearch('');
  };

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
  };

  const getTimeInCity = (timezone: string) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: settings.showSeconds ? '2-digit' : undefined,
        hour12: settings.format === '12',
      });
    } catch {
      return '--:--:--';
    }
  };

  const getDateInCity = (timezone: string) => {
    try {
      return currentTime.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const getOffset = (timezone: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(currentTime);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      return offsetPart?.value || '';
    } catch {
      return '';
    }
  };

  const getDayOffset = (timezone: string) => {
    try {
      const cityDate = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      const localDay = currentTime.getDate();
      const cityDay = cityDate.getDate();
      
      if (cityDay > localDay) return 'Tomorrow';
      if (cityDay < localDay) return 'Yesterday';
      return 'Today';
    } catch {
      return 'Today';
    }
  };

  const { primary, glow } = COLORS[settings.color];

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>World Clock</h2>
        <button
          onClick={() => setShowPicker(!showPicker)}
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
          + Add City
        </button>
      </div>

      {showPicker && (
        <div 
          style={{
            background: 'rgba(20, 20, 35, 0.95)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <input
            type="text"
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              marginBottom: '12px',
            }}
          />
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredCities.slice(0, 10).map(city => (
              <button
                key={city.id}
                onClick={() => addCity(city)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>{city.name}, {city.country}</span>
                <span style={{ opacity: 0.6 }}>{getOffset(city.timezone)}</span>
              </button>
            ))}
            {filteredCities.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                No cities found
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {selectedCities.map(city => (
          <div
            key={city.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(20, 20, 35, 0.8)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>{city.name}</h3>
                <span style={{ 
                  color: getDayOffset(city.timezone) !== 'Today' ? '#ffaa00' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                  {getDayOffset(city.timezone)}
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                {city.country} • {getDateInCity(city.timezone)} • {getOffset(city.timezone)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div 
                style={{ 
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  color: primary,
                  textShadow: `0 0 10px ${glow}`,
                }}
              >
                {getTimeInCity(city.timezone)}
              </div>
              <button
                onClick={() => removeCity(city.id)}
                aria-label={`Remove ${city.name}`}
                style={{
                  background: 'rgba(255,68,68,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ff4444',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  transition: 'all 0.2s ease',
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
          No cities added. Click "Add City" to compare time zones.
        </div>
      )}
    </div>
  );
}
