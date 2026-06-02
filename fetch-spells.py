import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls_to_try = [
    "https://raw.githubusercontent.com/c0d3rman/PathfinderMonsterDatabase/master/Spells.json",
    "https://raw.githubusercontent.com/baileymh/statblock-library/master/data/spells.json",
    "https://raw.githubusercontent.com/VttAssets/vtt-pathfinder/master/data/spells.json"
]

data = None
for u in urls_to_try:
    try:
        print(f"Trying {u}")
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, context=ctx)
        data = json.loads(res.read().decode('utf-8'))
        print(f"Success! Found {len(data)} items.")
        break
    except Exception as e:
        print(f"Failed: {e}")

if data:
    spells = []
    for row in data:
        # Check mapping
        name = row.get('name') or row.get('Name', '')
        if not name: continue
        
        desc = row.get('description') or row.get('description_formatted') or row.get('Description', '')
        
        spells.append({
            "id": name.lower().replace(' ', '-'),
            "name": name,
            "school": row.get('school') or row.get('School', ''),
            "level": row.get('spell_level') or row.get('spellLevel') or row.get('Level', ''),
            "castingTime": row.get('casting_time') or row.get('castingTime') or row.get('CastingTime', ''),
            "components": row.get('components') or row.get('Components', ''),
            "range": row.get('range') or row.get('Range', ''),
            "area": row.get('area') or row.get('Area', ''),
            "targets": row.get('targets') or row.get('Targets', ''),
            "duration": row.get('duration') or row.get('Duration', ''),
            "savingThrow": row.get('saving_throw') or row.get('savingThrow') or row.get('SavingThrow', ''),
            "spellResistance": row.get('spell_resistence') or row.get('spellResistance') or row.get('SpellResistance', ''),
            "description": desc
        })

    with open('src/data/spells.json', 'w', encoding='utf-8') as f:
        json.dump(spells, f, indent=2)
    print(f"Saved {len(spells)} spells to spells.json")
    
    # Check for Enhanced Diplomacy
    ed = [s for s in spells if 'enhanced diplomacy' in s['name'].lower()]
    print(f"Enhanced Diplomacy found: {len(ed)} -> {ed[0] if ed else 'No'}")
else:
    print("Could not fetch from any URL")
