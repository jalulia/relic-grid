import { BSPNode, Lot } from './types';

const MIN_CELL_W = 120;
const MIN_CELL_H = 90;
const GAP = 1;

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

  const sorted = [...lots].sort((a, b) => b.weight - a.weight);

  const splitHorizontal = w >= h;

  const totalWeight = sorted.reduce((s, l) => s + l.weight, 0);
  let accum = 0;
  let splitIndex = 1;

  for (let i = 0; i < sorted.length - 1; i++) {
    accum += sorted[i].weight;
    const ratio = accum / totalWeight;
    if (ratio >= 0.4) {
      splitIndex = i + 1;
      break;
    }
  }

  splitIndex = Math.max(1, Math.min(splitIndex, sorted.length - 1));

  const leftLots = sorted.slice(0, splitIndex);
  const rightLots = sorted.slice(splitIndex);

  const leftWeight = leftLots.reduce((s, l) => s + l.weight, 0);
  const splitRatio = Math.max(0.25, Math.min(0.75, leftWeight / totalWeight));

  if (splitHorizontal) {
    const splitX = Math.max(MIN_CELL_W, Math.floor(w * splitRatio));
    return [...buildBSP(leftLots, x, y, splitX, h), ...buildBSP(rightLots, x + splitX, y, w - splitX, h)];
  } else {
    const splitY = Math.max(MIN_CELL_H, Math.floor(h * splitRatio));
    return [...buildBSP(leftLots, x, y, w, splitY), ...buildBSP(rightLots, x, y + splitY, w, h - splitY)];
  }
}
