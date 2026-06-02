const fs = require('fs');
const path = require('path');

const hexesPath = path.join(__dirname, 'src', 'data', 'hexes.json');
let hexes = [];
try {
  hexes = JSON.parse(fs.readFileSync(hexesPath, 'utf8'));
} catch (err) {
  console.error("Could not read hexes.json", err);
}

const additionalHexes = [
  {
    id: "shaman-fury",
    name: "Fury",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "Wisdom modifier rounds",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman incites a creature within 30 feet into a primal fury. The target receives a +2 morale bonus on attack rolls and a +2 resistance bonus on saving throws against fear. This lasts for a number of rounds equal to the shaman's Wisdom modifier. At 8th and 16th levels, these bonuses increase by +1. Once a creature has benefited from the fury hex, it cannot benefit from it again for 24 hours."
  },
  {
    id: "shaman-intimidating-display",
    name: "Intimidating Display",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman gains Dazzling Display as a bonus feat, even if she does not meet the prerequisites. She can use this ability without a weapon in hand."
  },
  {
    id: "shaman-shapeshift",
    name: "Shapeshift",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "personal",
    targets: "you",
    duration: "1 minute/level",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman transforms herself into another form, as if using alter self, for a number of minutes per day equal to her shaman level. These minutes do not need to be consecutive, but must be spent in 1-minute increments. At 8th level, this hex works like beast shape I. At 12th level, it works like beast shape II. At 16th level, it works like beast shape III."
  },
  {
    id: "shaman-silkstring-snare",
    name: "Silkstring Snare",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round/level",
    savingThrow: "Reflex negates",
    spellResistance: "yes",
    description: "The shaman causes a snare of spider silk to erupt from the ground, entangling a target within 30 feet. The target is entangled and anchored in place. It can escape with a successful Strength check or Escape Artist check (DC = hex's save DC) as a full-round action, or by dealing slashing damage equal to the shaman's level to the silk."
  },
  {
    id: "shaman-tongues",
    name: "Tongues",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman understands any spoken language, as if under the permanent effects of the tongues spell."
  },
  {
    id: "shaman-wings",
    name: "Wings",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "personal",
    targets: "you",
    duration: "1 minute/level",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman grows a pair of wings for a number of minutes per day equal to her shaman level (must be spent in 1-minute increments). Initially, she can use them as a secondary natural attack dealing 1d3 damage. At 3rd level, she can use them as feather fall. At 7th level, she gains a fly speed of 30 feet (poor maneuverability). Selecting this hex a second time at 8th level doubles the duration and improves maneuverability to average."
  },
  {
    id: "shaman-witch-hex",
    name: "Witch Hex",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "varies",
    components: "",
    range: "varies",
    targets: "varies",
    duration: "varies",
    savingThrow: "varies",
    spellResistance: "varies",
    description: "The shaman selects any one hex normally available to the witch class. She treats her shaman level as her witch level when determining the powers and abilities of the hex. She uses her Wisdom modifier in place of her Intelligence modifier for the hex. She cannot select a hex with the same name as a shaman hex."
  }
];

const combined = [...hexes, ...additionalHexes];
fs.writeFileSync(hexesPath, JSON.stringify(combined, null, 2), 'utf8');
console.log(`Added ${additionalHexes.length} additional Shaman hexes. Total hexes: ${combined.length}.`);
