const fs = require('fs');
const https = require('https');

const URL = 'https://gist.githubusercontent.com/cityofwalls/0fdeb2da5d7b475968c8de88c75e77ad/raw';
const OUTPUT_FILE = 'src/data/spells.json';

const specificSpells = [
  {
    "id": "enhanced-diplomacy",
    "name": "Enhanced Diplomacy",
    "school": "divination",
    "level": "cleric/oracle 0, druid 0, hunter 0",
    "castingTime": "1 standard action",
    "components": "V, S",
    "range": "touch",
    "targets": "creature touched",
    "duration": "1 min. or until discharged",
    "savingThrow": "Will negates (harmless)",
    "spellResistance": "yes (harmless)",
    "description": "You imbue the subject with divine diplomacy skills. The creature gains a +2 competence bonus on a single Diplomacy or Intimidate check. The creature must choose to use the bonus before making the roll to which it applies."
  },
  {
    "id": "flash-forward",
    "name": "Flash Forward",
    "school": "conjuration (teleportation)",
    "level": "bard 4, bloodrager 4, magus 4, paladin 4",
    "castingTime": "1 standard action",
    "components": "V, S",
    "range": "personal",
    "targets": "you",
    "duration": "1 round",
    "savingThrow": "none",
    "spellResistance": "no",
    "description": "You can make a charge attack against a foe. At the end of your charge, you instantly teleport back to the exact location from which you started your charge. Your movement doesn't provoke attacks of opportunity."
  },
  {
    "id": "spellcurse",
    "name": "Spellcurse",
    "school": "necromancy [curse]",
    "level": "cleric/oracle 3, inquisitor 3, witch 3",
    "castingTime": "1 standard action",
    "components": "V, S",
    "range": "medium (100 ft. + 10 ft./level)",
    "targets": "one creature",
    "duration": "instantaneous",
    "savingThrow": "Will half",
    "spellResistance": "yes",
    "description": "You cause the magical energy of spells currently affecting the target to crackle with hostile power. The target takes 1d6 points of damage for each spell affecting it. If the target fails its save, it is also sickened for 1 round."
  },
  {
    "id": "touch-of-slumber",
    "name": "Touch of Slumber",
    "school": "enchantment (compulsion) [mind-affecting]",
    "level": "cleric/oracle 4, druid 4, shaman 4, witch 4",
    "castingTime": "1 standard action",
    "components": "V, S",
    "range": "touch",
    "targets": "one nonhostile creature touched",
    "duration": "1 hour/level",
    "savingThrow": "Will negates",
    "spellResistance": "yes",
    "description": "The target falls into a deep, peaceful sleep. A creature affected by this spell awakens only if it takes damage. Noise or even vigorous prodding won't rouse it."
  }
];

console.log(`Downloading spell database from ${URL}...`);

https.get(URL, (res) => {
  let rawData = '';

  res.on('data', (chunk) => {
    rawData += chunk;
  });

  res.on('end', () => {
    try {
      console.log('Download complete. Parsing JSON...');
      const parsedData = JSON.parse(rawData);
      
      const spellsMap = new Map();

      // Map the downloaded data to our format
      parsedData.forEach(spell => {
        const name = spell.name || '';
        if (!name) return;
        
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        spellsMap.set(id, {
          id: id,
          name: name,
          school: spell.school || '',
          level: spell.spell_level || '',
          castingTime: spell.casting_time || '',
          components: spell.components || '',
          range: spell.range || '',
          area: spell.area || '',
          targets: spell.targets || '',
          duration: spell.duration || '',
          savingThrow: spell.saving_throw || '',
          spellResistance: spell.spell_resistence || spell.spell_resistance || '',
          description: spell.description || spell.description_formatted || ''
        });
      });

      // Inject our specific spells if they don't exist or overwrite them to ensure they are correct
      specificSpells.forEach(s => {
        spellsMap.set(s.id, s);
      });

      const finalSpells = Array.from(spellsMap.values());

      // Sort alphabetically by name
      finalSpells.sort((a, b) => a.name.localeCompare(b.name));

      console.log(`Writing ${finalSpells.length} spells to ${OUTPUT_FILE}...`);
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalSpells, null, 2));
      console.log('Success!');

    } catch (e) {
      console.error('Error parsing or writing data:', e.message);
    }
  });

}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
