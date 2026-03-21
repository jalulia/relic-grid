export const SAINTS_DATA = [
  {
    id: 'ambrose',
    name: 'AMBROSE',
    relics: [
      'First Cervical Vertebra', 'Third Metacarpal', 'Left Femur Fragment',
      'Molar (Upper Right)', 'Rib Section VII', 'Phalanx of Index Finger',
      'Scapula Fragment', 'Portion of Cranium', 'Dried Blood Vial',
      'Woven Hair Lock', 'Toenail Fragment', 'Dust of Tibia'
    ],
    provenance: 'Basilica di Sant\'Ambrogio, Milan'
  },
  {
    id: 'lucia',
    name: 'LUCIA',
    relics: [
      'Left Eye (Preserved)', 'Right Eye (Preserved)', 'Jawbone Fragment',
      'Palm Splinter', 'Vertebra C3', 'Finger Bone (Ring)',
      'Dried Tears Ampulla', 'Veil Thread Bundle', 'Tooth (Canine)',
      'Rib Fragment IV'
    ],
    provenance: 'Church of SS. Geremia e Lucia, Venice'
  },
  {
    id: 'sebastian',
    name: 'SEBASTIAN',
    relics: [
      'Arrow-Pierced Rib', 'Left Humerus', 'Collarbone Fragment',
      'Blood-Soaked Linen', 'Kneecap (Right)', 'Spinal Disc L2',
      'Forearm Bone (Ulna)', 'Sternum Piece', 'Ankle Bone (Talus)',
      'Shoulder Blade Chip', 'Toenail of Great Toe', 'Skin Fragment'
    ],
    provenance: 'Basilica of San Sebastiano, Rome'
  },
  {
    id: 'teresa',
    name: 'TERESA',
    relics: [
      'Heart (Transverberated)', 'Left Hand (Incorrupt)', 'Right Foot Fragment',
      'Spinal Vertebra T7', 'Hair Clipping', 'Fingernail (Thumb)',
      'Rib Bone Section', 'Cheekbone Fragment'
    ],
    provenance: 'Convento de Santa Teresa, Ávila'
  },
  {
    id: 'bartholomew',
    name: 'BARTHOLOMEW',
    relics: [
      'Flayed Skin Fragment I', 'Flayed Skin Fragment II', 'Cranial Plate',
      'Femur Head', 'Radius Bone', 'Wisdom Tooth',
      'Vertebra L4', 'Clavicle Piece', 'Metatarsal III',
      'Pelvis Fragment', 'Sacrum Chip'
    ],
    provenance: 'Basilica di San Bartolomeo, Rome'
  },
  {
    id: 'agatha',
    name: 'AGATHA',
    relics: [
      'Veil (Fire-Resistant)', 'Breast Relic (Wax Seal)', 'Jawbone',
      'Finger Bone (Pinky)', 'Ash Residue Vial', 'Rib Fragment II',
      'Shoulder Joint Piece', 'Tooth (Incisor)', 'Hip Bone Sliver'
    ],
    provenance: 'Cathedral of Sant\'Agata, Catania'
  },
  {
    id: 'francis',
    name: 'FRANCIS',
    relics: [
      'Stigmata Hand Cloth', 'Tunic Fragment', 'Rib Section III',
      'Tonsured Hair Lock', 'Finger Bone (Middle)', 'Toe Bone (Left Great)',
      'Vertebra C7', 'Wrist Bone (Scaphoid)', 'Blood on Linen Strip',
      'Kneecap Fragment', 'Ankle Bone (Calcaneus)', 'Elbow Joint Piece',
      'Femur Splinter'
    ],
    provenance: 'Basilica di San Francesco, Assisi'
  },
  {
    id: 'catherine',
    name: 'CATHERINE',
    relics: [
      'Head (Preserved)', 'Thumb (Right)', 'Rib Fragment VI',
      'Shoulder Blade Piece', 'Tooth (Molar)', 'Vertebra T3',
      'Finger Bone (Index)', 'Wrist Fragment', 'Collarbone Section',
      'Shin Bone Chip'
    ],
    provenance: 'Basilica di San Domenico, Siena'
  }
];

export const RELIC_CLASSES: Record<number, string> = {
  1: 'I — Body Part',
  2: 'II — Possession',
  3: 'III — Touched Object'
};

export function getRelicClass(relicName: string): 1 | 2 | 3 {
  if (relicName.includes('Veil') || relicName.includes('Tunic') || relicName.includes('Cloth') || relicName.includes('Linen')) return 2;
  if (relicName.includes('Vial') || relicName.includes('Ampulla') || relicName.includes('Dust') || relicName.includes('Ash')) return 3;
  return 1;
}

export function generateProvenance(baseProv: string, year?: number): string {
  const y = year || (1200 + Math.floor(Math.random() * 500));
  return `${baseProv}, ${y}`;
}
