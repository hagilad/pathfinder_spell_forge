import React, { useRef, useEffect } from 'react';
import './SpellCard.css';

const SpellCard = ({ spell, theme, customLevel, customDescription }) => {
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current) {
      const el = descRef.current;
      // Start with a base readable font size in pixels (approx 0.6rem)
      let fontSize = 10;
      el.style.fontSize = fontSize + 'px';
      
      // Shrink font size until the text stops overflowing vertically
      while (el.scrollHeight > el.clientHeight && fontSize > 4) {
        fontSize -= 0.5;
        el.style.fontSize = fontSize + 'px';
      }
    }
  }, [spell, customDescription]);

  if (!spell) return null;

  const themeClass = `theme-${theme}`;

  return (
    <div className={`spell-card-wrapper ${themeClass}`}>
      <div className="spell-card">
        
        <div className="card-header">
          <h2 className="card-title">{spell.name}</h2>
          <div className="card-school">{spell.school}</div>
        </div>

        <div className="card-stats">
          {spell.isCustom && spell.customStats ? (
            spell.customStats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="stat-label">{stat.label}:</div>
                <div className="stat-value">{stat.value}</div>
              </React.Fragment>
            ))
          ) : (
            <>
              {spell.level && (
                <React.Fragment>
                  <div className="stat-label">Level:</div>
                  <div className="stat-value">{customLevel || spell.level}</div>
                </React.Fragment>
              )}
              
              {spell.castingTime && (
                <React.Fragment>
                  <div className="stat-label">{(spell.level === 'Hex' || spell.level === 'Major Hex' || spell.level === 'Grand Hex') ? 'Action:' : 'Casting Time:'}</div>
                  <div className="stat-value">{spell.castingTime}</div>
                </React.Fragment>
              )}
              
              {spell.components && (
                <React.Fragment>
                  <div className="stat-label">Components:</div>
                  <div className="stat-value">{spell.components}</div>
                </React.Fragment>
              )}
              
              {spell.range && (
                <React.Fragment>
                  <div className="stat-label">Range:</div>
                  <div className="stat-value">{spell.range}</div>
                </React.Fragment>
              )}
              
              {spell.targets && (
                <React.Fragment>
                  <div className="stat-label">Targets/Area:</div>
                  <div className="stat-value">{spell.targets}</div>
                </React.Fragment>
              )}
              
              {spell.duration && (
                <React.Fragment>
                  <div className="stat-label">Duration:</div>
                  <div className="stat-value">{spell.duration}</div>
                </React.Fragment>
              )}
              
              {spell.savingThrow && (
                <React.Fragment>
                  <div className="stat-label">Saving Throw:</div>
                  <div className="stat-value">{spell.savingThrow}</div>
                </React.Fragment>
              )}
              
              {spell.spellResistance && (
                <React.Fragment>
                  <div className="stat-label">Spell Resistance:</div>
                  <div className="stat-value">{spell.spellResistance}</div>
                </React.Fragment>
              )}
            </>
          )}
        </div>

        <div className="card-description" ref={descRef}>
          {customDescription !== undefined ? customDescription : spell.description}
        </div>
        
      </div>
    </div>
  );
};

export default SpellCard;
