import { useState, useMemo, useEffect } from 'react';
import { Search, Printer, Plus, Sparkles } from 'lucide-react';
import spellsData from './data/spells.json';
import hexesData from './data/hexes.json';
import SpellCard from './components/SpellCard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dataType, setDataType] = useState('spells');
  const [selectedSpellId, setSelectedSpellId] = useState(spellsData[0].id);
  const [theme, setTheme] = useState('shamanic');
  const [customLevel, setCustomLevel] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  // Custom Abilities State
  const [customAbilities, setCustomAbilities] = useState(() => {
    try {
      const saved = localStorage.getItem('pathfinderCustomAbilities');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('pathfinderCustomAbilities', JSON.stringify(customAbilities));
  }, [customAbilities]);

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customAbilityName, setCustomAbilityName] = useState('');
  const [customAbilityType, setCustomAbilityType] = useState('');
  const [customAbilityStats, setCustomAbilityStats] = useState([{label: '', value: ''}]);
  const [customAbilityDesc, setCustomAbilityDesc] = useState('');
  const [customAbilityError, setCustomAbilityError] = useState('');

  // Print Mode State
  const [printGrid, setPrintGrid] = useState([]);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const activeData = dataType === 'spells' ? spellsData : dataType === 'hexes' ? hexesData : customAbilities;

  // Filtered Spells
  const filteredSpells = useMemo(() => {
    if (!searchQuery) return activeData;
    return activeData.filter(spell => 
      spell.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeData]);

  const activeSpell = useMemo(() => {
    if (activeData.length === 0) return null;
    return activeData.find(s => s.id === selectedSpellId) || activeData[0];
  }, [selectedSpellId, activeData]);

  const handleDataTypeChange = (e) => {
    const newType = e.target.value;
    setDataType(newType);
    const newData = newType === 'spells' ? spellsData : newType === 'hexes' ? hexesData : customAbilities;
    if (newData.length > 0) {
      setSelectedSpellId(newData[0].id);
    }
    setSearchQuery('');
  };

  const handleSaveCustomAbility = () => {
    if (!customAbilityName.trim() || !customAbilityType.trim() || !customAbilityDesc.trim()) {
      setCustomAbilityError("Name, Type, and Description are required.");
      return;
    }
    const validStats = customAbilityStats.filter(s => s.label.trim() && s.value.trim());
    if (validStats.length === 0) {
      setCustomAbilityError("You must provide at least one stat with both a label and value.");
      return;
    }

    const newAbility = {
      id: `custom-${Date.now()}`,
      name: customAbilityName,
      school: customAbilityType,
      isCustom: true,
      customStats: validStats,
      description: customAbilityDesc
    };

    setCustomAbilities([...customAbilities, newAbility]);
    setIsCreatingCustom(false);
    setDataType('custom');
    setSelectedSpellId(newAbility.id);
    
    setCustomAbilityName('');
    setCustomAbilityType('');
    setCustomAbilityStats([{label: '', value: ''}]);
    setCustomAbilityDesc('');
    setCustomAbilityError('');
  };

  // When spell changes, populate custom description with default description
  useEffect(() => {
    if (activeSpell) {
      setCustomDescription(activeSpell.description);
    }
  }, [activeSpell]);

  const handleAddToGrid = () => {
    setPrintGrid([...printGrid, { spell: activeSpell, theme, customLevel, customDescription, id: Date.now() }]);
  };

  const handlePrint = () => {
    window.print();
  };

  // If in Print Mode, render paginated grids
  if (isPrintMode) {
    // Chunk cards into groups of 9
    const pages = [];
    for (let i = 0; i < printGrid.length; i += 9) {
      pages.push(printGrid.slice(i, i + 9));
    }

    return (
      <div className="print-mode-container" style={{ background: '#e0e0e0', minHeight: '100vh', padding: '20px 0' }}>
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }} className="no-print">
          <button className="btn btn-primary" onClick={handlePrint} style={{ marginRight: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            <Printer size={18} /> Print All ({pages.length} Pages)
          </button>
          <button className="btn btn-outline" onClick={() => setIsPrintMode(false)} style={{ background: 'white', color: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Back to Forge
          </button>
        </div>
        
        {pages.map((pageCards, pageIndex) => (
          <div key={pageIndex} className="print-page">
            {pageCards.map((item) => (
              <div key={item.id}>
                <SpellCard spell={item.spell} theme={item.theme} customLevel={item.customLevel} customDescription={item.customDescription} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Standard Split Screen
  return (
    <div className="app-container">
      {/* Left Control Panel */}
      <aside className="control-panel">
        <h1><Sparkles className="icon-pulse" /> Pathfinder Spell Forge</h1>
        
        <div className="form-group">
          <label>Search Type</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={dataType} onChange={handleDataTypeChange} style={{ flex: 1 }}>
              <option value="spells">Spells</option>
              <option value="hexes">Hexes</option>
              <option value="custom">Custom</option>
            </select>
            <button className="btn btn-outline" onClick={() => setIsCreatingCustom(!isCreatingCustom)} style={{ padding: '0 10px' }}>
              {isCreatingCustom ? 'Cancel' : <Plus size={18} />}
            </button>
          </div>
        </div>

        {!isCreatingCustom ? (
          <>
            <div className="form-group">
              <label>Search {dataType === 'spells' ? 'Spell' : dataType === 'hexes' ? 'Hex' : 'Custom'}</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder={dataType === 'custom' ? "e.g., Custom Feat..." : "e.g., Fireball..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '35px' }}
                />
              </div>
              
              {searchQuery && filteredSpells.length === 0 && (
                <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px', padding: '5px' }}>
                  Nothing found.
                </div>
              )}

              {searchQuery && filteredSpells.length > 0 && (
                <ul style={{ 
                  listStyle: 'none', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '6px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  marginTop: '5px'
                }}>
                  {filteredSpells.slice(0, 50).map(spell => (
                    <li 
                      key={spell.id}
                      onClick={() => { 
                        setSelectedSpellId(spell.id); 
                        setSearchQuery(''); 
                      }}
                      style={{ 
                        padding: '8px 12px', 
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: spell?.id === selectedSpellId ? 'rgba(0, 188, 212, 0.2)' : 'transparent',
                        color: spell?.id === selectedSpellId ? 'var(--primary-color)' : 'var(--text-light)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: spell?.id === selectedSpellId ? 'bold' : 'normal' }}>{spell.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{spell.school}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {activeSpell && (
              <>
                {!activeSpell.isCustom && (
                  <div className="form-group">
                    <label>Custom Level Override</label>
                    <input 
                      type="text" 
                      placeholder={`Default: ${activeSpell.level}`}
                      value={customLevel}
                      onChange={(e) => setCustomLevel(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Edit Description</label>
                  <textarea 
                    rows="6"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      background: 'rgba(0,0,0,0.2)', 
                      border: '1px solid var(--border-color)', 
                      color: 'var(--text-color)',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>Create Custom Ability</h2>
            {customAbilityError && <div style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{customAbilityError}</div>}
            
            <div className="form-group">
              <label>Name *</label>
              <input type="text" value={customAbilityName} onChange={e => setCustomAbilityName(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Type (e.g. Feat, Trait) *</label>
              <input type="text" value={customAbilityType} onChange={e => setCustomAbilityType(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Stats (Needs at least 1) *</label>
              {customAbilityStats.map((stat, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                  <input type="text" placeholder="Label (e.g. Uses)" value={stat.label} onChange={e => {
                    const newStats = [...customAbilityStats];
                    newStats[idx].label = e.target.value;
                    setCustomAbilityStats(newStats);
                  }} style={{ flex: 1 }} />
                  <input type="text" placeholder="Value (e.g. 3/day)" value={stat.value} onChange={e => {
                    const newStats = [...customAbilityStats];
                    newStats[idx].value = e.target.value;
                    setCustomAbilityStats(newStats);
                  }} style={{ flex: 2 }} />
                </div>
              ))}
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginTop: '5px' }} onClick={() => setCustomAbilityStats([...customAbilityStats, {label: '', value: ''}])}>
                + Add Stat
              </button>
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea 
                value={customAbilityDesc} 
                onChange={e => setCustomAbilityDesc(e.target.value)} 
                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-light)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.75rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleSaveCustomAbility} style={{ flex: 1 }}>Save Custom</button>
            </div>
          </div>
        )}

        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

        <h2>Card Design</h2>
        
        <div className="form-group">
          <label>Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="shamanic">Shamanic (Bone & Spirit)</option>
            <option value="divine">Divine (Holy & Light)</option>
            <option value="nature">Nature (Earth & Vines)</option>
            <option value="arcanist">Arcanist (Neon Runes)</option>
            <option value="stars">Stars (Cosmic Void)</option>
            <option value="library">Library (Ancient Tomes)</option>
          </select>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0', flex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-outline" onClick={handleAddToGrid}>
            <Plus size={18} /> Add to Print Grid ({printGrid.length} cards)
          </button>
          
          {printGrid.length > 0 && (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '5px',
                background: 'rgba(0,0,0,0.2)',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '5px',
                maxHeight: '250px',
                overflowY: 'auto'
              }}>
                {printGrid.map((item) => (
                  <div key={item.id} style={{ position: 'relative', aspectRatio: '63/88', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}>
                      {item.spell ? <SpellCard spell={item.spell} theme={item.theme} customLevel={item.customLevel} customDescription={item.customDescription} /> : null}
                    </div>
                    <button 
                      onClick={() => setPrintGrid(printGrid.filter(g => g.id !== item.id))}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255,0,0,0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => setIsPrintMode(true)}>
                <Printer size={18} /> Go to Print View
              </button>
            </>
          )}
        </div>

      </aside>

      {/* Right Live Preview */}
      <main className="preview-area">
        <h2 style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.5)' }}>Live Preview</h2>
        
        <div style={{ 
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '600px'
        }}>
          {activeSpell ? (
            <SpellCard spell={activeSpell} theme={theme} customLevel={customLevel} customDescription={customDescription} />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center' }}>
              <p>No custom abilities found.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Click the <strong>+</strong> button to create one!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
