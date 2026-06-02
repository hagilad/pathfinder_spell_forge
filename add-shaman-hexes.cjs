const fs = require('fs');
const path = require('path');

const hexesPath = path.join(__dirname, 'src', 'data', 'hexes.json');
let existingHexes = [];
try {
  existingHexes = JSON.parse(fs.readFileSync(hexesPath, 'utf8'));
} catch (err) {
  console.error("Could not read existing hexes.json", err);
}

// Ensure we don't have duplicates if run multiple times
existingHexes = existingHexes.filter(h => !h.school.includes('Shaman Hex') || h.id === 'shaman-chant' || h.id === 'shaman-protective-luck');

const newShamanHexes = [
  // Base Shaman Hexes (Shared with Witch)
  {
    id: "shaman-healing",
    name: "Healing",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "touch",
    targets: "creature touched",
    duration: "instantaneous",
    savingThrow: "Will half (if used to damage)",
    spellResistance: "yes",
    description: "A shaman can soothe the wounds of those she touches. This acts as a cure light wounds spell, using the shaman's caster level. Once a creature has benefited from the healing hex, it cannot benefit from it again for 24 hours. At 5th level, this hex acts like cure moderate wounds."
  },
  {
    id: "shaman-evil-eye",
    name: "Evil Eye",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "3 rounds + 1 round/2 levels",
    savingThrow: "Will partial",
    spellResistance: "yes",
    description: "The shaman can cause doubt to creep into the mind of a foe that she can see within 30 feet. The target takes a –2 penalty on one of the following (shaman's choice): AC, ability checks, attack rolls, saving throws, or skill checks. This hex lasts for a number of rounds equal to 3 + the shaman's Wisdom modifier. A Will save reduces this to just 1 round."
  },
  {
    id: "shaman-fortune",
    name: "Fortune",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round",
    savingThrow: "Will negates (harmless)",
    spellResistance: "yes (harmless)",
    description: "The shaman can grant a creature within 30 feet a bit of good luck for 1 round. The target can call upon this good luck once per round, allowing him to roll any ability check, attack roll, saving throw, or skill check twice and take the better result. He must decide to use this ability before the first roll is made. A creature cannot be the target of this hex again for 24 hours."
  },
  {
    id: "shaman-misfortune",
    name: "Misfortune",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round (see text)",
    savingThrow: "Will negates",
    spellResistance: "yes",
    description: "The shaman can cause a creature within 30 feet to suffer grave misfortune for 1 round. Anytime the creature makes an ability check, attack roll, saving throw, or skill check, it must roll twice and take the worse result. A Will save negates this hex. A creature cannot be the target of this hex again for 24 hours."
  },
  {
    id: "shaman-slumber",
    name: "Slumber",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "close (25 ft. + 5 ft./2 levels)",
    targets: "one creature",
    duration: "1 round/level",
    savingThrow: "Will negates",
    spellResistance: "yes",
    description: "A shaman can cause a creature to fall into a deep, magical sleep, as per the spell sleep. The creature receives a Will save to negate the effect. If the save fails, the creature falls asleep for a number of rounds equal to the shaman's level. This hex can affect a creature of any HD. The creature will not wake due to noise or light, but others can rouse it with a standard action. Whether or not the save is successful, a creature cannot be the target of this hex again for 24 hours."
  },
  {
    id: "shaman-ward",
    name: "Ward",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "touch",
    targets: "creature touched",
    duration: "until discharged or target is damaged",
    savingThrow: "Will negates (harmless)",
    spellResistance: "yes (harmless)",
    description: "A shaman can use this hex to place a protective ward over one creature. The warded creature receives a +2 deflection bonus to AC and a +2 resistance bonus on saving throws. This ward lasts until the warded creature is hit or fails a saving throw. A shaman can have only one ward active at a time."
  },
  {
    id: "shaman-secret",
    name: "Secret",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman receives one metamagic feat as a bonus feat. The shaman must meet the prerequisites for the feat."
  },
  {
    id: "shaman-fetish",
    name: "Fetish",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman receives Craft Wondrous Item as a bonus feat and gains a +4 insight bonus on Spellcraft checks made to identify magic items."
  },
  {
    id: "shaman-draconic-resilience",
    name: "Draconic Resilience",
    school: "Shaman Hex",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman gains a cloak of draconic resilience. She ignores the effects of extreme temperatures as if using endure elements."
  },

  // Battle Spirit
  {
    id: "shaman-battle-ward",
    name: "Battle Ward",
    school: "Shaman Hex (Battle)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "touch",
    targets: "creature touched",
    duration: "until discharged",
    savingThrow: "Will negates (harmless)",
    spellResistance: "yes (harmless)",
    description: "The shaman touches a willing creature and grants it a battle ward. When the warded creature is attacked, it gains a +3 deflection bonus to its AC. Each time the warded creature is attacked, the deflection bonus reduces by 1 (to a minimum of +0). A creature cannot be the target of this hex again for 24 hours."
  },
  {
    id: "shaman-hamstring",
    name: "Hamstring",
    school: "Shaman Hex (Battle)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round/level",
    savingThrow: "Fortitude negates",
    spellResistance: "yes",
    description: "The shaman curses a creature with cramped, sluggish muscles. The target’s movement speed is reduced by half, and it cannot take 5-foot steps. A Fortitude save negates this effect. A creature cannot be the target of this hex again for 24 hours."
  },
  
  // Bones Spirit
  {
    id: "shaman-bone-lock",
    name: "Bone Lock",
    school: "Shaman Hex (Bones)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round/level",
    savingThrow: "Fortitude partial",
    spellResistance: "yes",
    description: "The shaman curses a creature to suffer from stiffening joints and brittle bones. The target is staggered for a number of rounds equal to the shaman’s level. A Fortitude save reduces this effect to 1 round. A creature cannot be the target of this hex again for 24 hours."
  },
  
  // Flame Spirit
  {
    id: "shaman-cinder-dance",
    name: "Cinder Dance",
    school: "Shaman Hex (Flame)",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman’s base speed increases by 10 feet. At 10th level, the shaman can take a 5-foot step even in difficult terrain."
  },
  {
    id: "shaman-fire-nimbus",
    name: "Fire Nimbus",
    school: "Shaman Hex (Flame)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "30 ft.",
    targets: "one creature",
    duration: "1 round/level",
    savingThrow: "Will negates",
    spellResistance: "yes",
    description: "The shaman causes a creature to be surrounded by a halo of flames. These flames shed light like a torch but do not damage the creature. However, any creature that strikes the target with a non-reach melee weapon takes 1d6 points of fire damage + 1 point for every 2 shaman levels she possesses."
  },

  // Heavens Spirit
  {
    id: "shaman-lure-of-the-heavens",
    name: "Lure of the Heavens",
    school: "Shaman Hex (Heavens)",
    level: "Hex",
    castingTime: "1 standard action (or none)",
    components: "",
    range: "personal",
    targets: "you",
    duration: "1 minute/level (or permanent)",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman’s connection to the skies above is so strong that her feet barely touch the ground. At 1st level, the shaman leaves no tracks, as if she were under the effects of pass without trace. At 5th level, she can hover up to 6 inches above the ground or even liquid surfaces, as if levitating. At 10th level, she gains the ability to fly, as per the spell fly, for a number of minutes per day equal to her shaman level."
  },
  {
    id: "shaman-heaven-leap",
    name: "Heaven's Leap",
    school: "Shaman Hex (Heavens)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "close (25 ft. + 5 ft./2 levels)",
    targets: "one willing creature",
    duration: "instantaneous",
    savingThrow: "Will negates (harmless)",
    spellResistance: "yes (harmless)",
    description: "The shaman is adept at creating tiny tears in the fabric of space. She can teleport a willing creature she can see within 30 feet to any other unoccupied space within 30 feet of herself. A creature cannot be the target of this hex again for 24 hours."
  },

  // Life Spirit
  {
    id: "shaman-enhanced-cures",
    name: "Enhanced Cures",
    school: "Shaman Hex (Life)",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "When the shaman casts a cure spell, the maximum number of hit points she can heal is determined by her shaman level, not the limit imposed by the spell itself. For example, a 10th-level shaman casting cure light wounds heals 1d8+10 hit points instead of the normal 1d8+5 maximum."
  },
  {
    id: "shaman-life-link",
    name: "Life Link",
    school: "Shaman Hex (Life)",
    level: "Hex",
    castingTime: "1 standard action",
    components: "",
    range: "close (25 ft. + 5 ft./2 levels)",
    targets: "one creature/level",
    duration: "1 minute/level",
    savingThrow: "Will negates (harmless)",
    spellResistance: "yes (harmless)",
    description: "The shaman forms a mystic bond with willing allies. Whenever a bonded ally takes damage, if they have taken 5 or more points of damage, they heal 5 hit points and the shaman takes 5 points of damage. The shaman can end the bond as an immediate action."
  },

  // Waves Spirit
  {
    id: "shaman-crashing-waves",
    name: "Crashing Waves",
    school: "Shaman Hex (Waves)",
    level: "Hex",
    castingTime: "none",
    components: "",
    range: "personal",
    targets: "you",
    duration: "permanent",
    savingThrow: "none",
    spellResistance: "no",
    description: "The shaman’s water spells wash over her enemies. When the shaman casts a spell with the water descriptor, the caster level is increased by 1. Furthermore, if a creature fails its saving throw against a water spell cast by the shaman, it must succeed at a Fortitude save or fall prone."
  }
];

const combined = [...existingHexes, ...newShamanHexes];
fs.writeFileSync(hexesPath, JSON.stringify(combined, null, 2), 'utf8');
console.log(`Added ${newShamanHexes.length} Shaman hexes. Total hexes: ${combined.length}.`);
