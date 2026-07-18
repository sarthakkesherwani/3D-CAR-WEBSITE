export const PAINTS = [
  { name: 'Midnight Black', hex: '#11151f', accent: '#5b8cff' },
  { name: 'Racing Red', hex: '#c8102e', accent: '#ff3b57' },
  { name: 'Pearl White', hex: '#eef0ee', accent: '#e9e6da' },
  { name: 'Electric Blue', hex: '#0284ff', accent: '#38b6ff' },
  { name: 'Gunmetal Grey', hex: '#3f474e', accent: '#9fb2bf' },
  { name: 'Sunset Orange', hex: '#ff5d1f', accent: '#ff8449' },
  { name: 'Emerald Night', hex: '#0d5c3f', accent: '#2fd08a' },
  { name: 'Solar Gold', hex: '#c9a24f', accent: '#e6c36a' },
]

export const RIMS = [
  { name: 'Gloss Black', hex: '#0b0d10' },
  { name: 'Gunmetal', hex: '#3a4147' },
  { name: 'Brushed Silver', hex: '#c9ced6' },
  { name: 'Satin Bronze', hex: '#a2793f' },
]

export const accentFor = (hex) =>
  (PAINTS.find((p) => p.hex === hex) || PAINTS[0]).accent

// Camera keyframes per section: [position], [lookAt]
export const KEYFRAMES = [
  { pos: [6.2, 1.9, 7.4], look: [0, 0.5, 0] },           // 0 hero
  { pos: [0.3, 1.05, 7.6], look: [0, 0.55, 0] },         // 1 design — side profile
  { pos: [-6.4, 1.4, 4.4], look: [-0.7, 0.65, 0] },      // 2 power — rear 3/4
  { pos: [0.9, 3.9, 1.9], look: [-0.15, 0.85, -0.1] },   // 3 cockpit — top down
  { pos: [3.1, 0.5, 3.2], look: [1.45, 0.4, 0.55] },     // 4 grip — wheel close
  { pos: [7.6, 0.85, -2.0], look: [0.2, 0.6, 0] },       // 5 specs — long lens
  { pos: [4.4, 1.8, 5.0], look: [0, 0.5, 0] },           // 6 configurator
  { pos: [0.0, 2.4, 9.6], look: [0, 0.8, 0] },           // 7 finale
]

export const ROTATABLE = new Set([0, 6, 7])

export const FEATURES = [
  {
    id: 'design', kicker: '01 — Aerodynamics', title: 'Sculpted by wind',
    body: 'Every line earns its keep. A teardrop canopy flows into a kamm tail, feeding the ducktail spoiler while air curtains calm the wake behind each arch.',
    stats: [['0.29', 'drag coefficient'], ['312 kg', 'downforce @ 150 mph']],
    align: 'left',
  },
  {
    id: 'power', kicker: '02 — Powertrain', title: 'The heart is a storm',
    body: 'A 4.0-litre twin-turbo flat-six pairs with a 145 kW axial-flux motor. Torque fill is instant; the crescendo at 8,400 rpm is anything but quiet.',
    stats: [['850 hp', 'combined output'], ['8,400', 'rpm redline']],
    align: 'right',
  },
  {
    id: 'cockpit', kicker: '03 — Cockpit', title: 'Command centre',
    body: 'Hand-stitched Nappa leather over carbon shell seats. A curved glass cluster floats above a driver-tilted console — everything falls to hand.',
    stats: [['12.4″', 'curved glass cockpit'], ['2', 'carbon shell seats']],
    align: 'left',
  },
  {
    id: 'grip', kicker: '04 — Contact patch', title: 'Grip, engineered',
    body: 'Staggered forged wheels wrap carbon-ceramic discs and six-piston monobloc calipers. 1.2 g of lateral grip, on street rubber.',
    stats: [['420 mm', 'carbon-ceramic discs'], ['1.2 g', 'lateral grip']],
    align: 'right',
  },
]

export const SPECS = [
  { value: 2.9, decimals: 1, suffix: 's', label: '0–60 mph' },
  { value: 205, suffix: ' mph', label: 'top speed' },
  { value: 850, suffix: ' hp', label: 'power' },
  { value: 663, suffix: ' lb·ft', label: 'torque' },
  { value: 248000, prefix: '$', label: 'starting MSRP' },
]

export const SECTION_COUNT = 8
