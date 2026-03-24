// Maps relic IDs to relic asset images. We have 30+ images, assigned round-robin
// so every lot gets a unique-looking golden reliquary image.

const base = import.meta.env.BASE_URL;

const RELIC_IMAGES = [
  `${base}images/relics/saint-relic-example.png`,
  `${base}images/relics/saint-relic-example1.png`,
  `${base}images/relics/saint-relic-example2.png`,
  `${base}images/relics/saint-relic-example3.png`,
  `${base}images/relics/saint-relic-example4.png`,
  `${base}images/relics/saint-relic-example5.png`,
  `${base}images/relics/saint-relic-example6.png`,
  `${base}images/relics/saint-relic-example7.png`,
  `${base}images/relics/saint-relic-example8.png`,
  `${base}images/relics/saint-relic-example9.png`,
  `${base}images/relics/saint-relic-example10.png`,
  `${base}images/relics/saint-relic-example11.png`,
  `${base}images/relics/saint-relic-example12.png`,
  `${base}images/relics/saint-relic-example13.png`,
  `${base}images/relics/saint-relic-example15.png`,
  `${base}images/relics/saint-relic-example16.png`,
  `${base}images/relics/saint-relic-example17.png`,
  `${base}images/relics/saint-relic-example18.png`,
  `${base}images/relics/saint-relic-example19.png`,
  `${base}images/relics/saint-relic-example20.png`,
  `${base}images/relics/saint-relic-example21.png`,
  `${base}images/relics/saint-relic-example22.png`,
  `${base}images/relics/saint-relic-example23.png`,
  `${base}images/relics/saint-relic-example24.png`,
  `${base}images/relics/saint-relic-example25.png`,
  `${base}images/relics/saint-relic-example26.png`,
  `${base}images/relics/saint-relic-example27.png`,
  `${base}images/relics/saint-relic-example28.png`,
  `${base}images/relics/saint-relic-example29.png`,
  `${base}images/relics/hand.png`,
  `${base}images/relics/hg.png`,
];

// Simple hash to consistently assign an image to a relic ID
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRelicImage(relicId: string): string {
  const index = hashCode(relicId) % RELIC_IMAGES.length;
  return RELIC_IMAGES[index];
}
