import { BSPNode, Lot } from './types';

const MIN_CELL_SIZE = 80;
const GAP = 2;

export function buildBSP(
  lots: Lot[],
  x: number,
  y: number,
  w: number,
  h: number
): BSPNode[] {
  if (lots.length === 0) return [];
  if (lots.length === 1) {
    return [{ x: x + GAP, y: y + GAP, w: w - GAP * 2, h: h - GAP * 2, lotId: lots[0].id }];
  }

  // Sort by weight descending for better packing
  const sorted = [...lots].sort((a, b) => b.weight - a.weight);

  // Split based on aspect ratio
  const splitHorizontal = w >= h;

  // Find split point based on cumulative weight
  const totalWeight = sorted.reduce((s, l) => s + l.weight, 0);
  let accum = 0;
  let splitIndex = 1;

  for (let i = 0; i < sorted.length - 1; i++) {
    accum += sorted[i].weight;
    const ratio = accum / totalWeight;
    if (ratio >= 0.35) {
      splitIndex = i + 1;
      break;
    }
  }

  // Ensure at least 1 lot on each side
  splitIndex = Math.max(1, Math.min(splitIndex, sorted.length - 1));

  const leftLots = sorted.slice(0, splitIndex);
  const rightLots = sorted.slice(splitIndex);

  const leftWeight = leftLots.reduce((s, l) => s + l.weight, 0);
  const splitRatio = leftWeight / totalWeight;

  if (splitHorizontal) {
    const splitX = Math.max(MIN_CELL_SIZE, Math.floor(w * splitRatio));
    const leftNodes = buildBSP(leftLots, x, y, splitX, h);
    const rightNodes = buildBSP(rightLots, x + splitX, y, w - splitX, h);
    return [...leftNodes, ...rightNodes];
  } else {
    const splitY = Math.max(MIN_CELL_SIZE, Math.floor(h * splitRatio));
    const topNodes = buildBSP(leftLots, x, y, w, splitY);
    const bottomNodes = buildBSP(rightLots, x, y + splitY, w, h - splitY);
    return [...topNodes, ...bottomNodes];
  }
}
