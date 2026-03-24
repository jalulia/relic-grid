import { FKeyView } from '../components/FKeyBar';

export interface WindowConfig {
  id: FKeyView;
  title: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  defaultAnchor: 'left' | 'right' | null;
}

export interface WindowState {
  id: FKeyView;
  isOpen: boolean;
  position: { x: number; y: number };
  size: { w: number; h: number };
  anchor: 'left' | 'right' | null;
  zIndex: number;
  /** Saved floating size for restoring after undock */
  floatingSize: { w: number; h: number } | null;
}

export interface WindowManagerState {
  windows: Record<string, WindowState>;
  topZ: number;
  lastFocused: FKeyView | null;
}

/** Layout constants */
export const LAYOUT = {
  TICKER_WIDTH: 220,
  FKEY_BAR_HEIGHT: 32,
  SAINT_TRACKER_HEIGHT: 32,
  TITLE_BAR_HEIGHT: 16,
  DOCK_SNAP_THRESHOLD: 260,
  DOCK_RIGHT_MARGIN: 40,
  DOCK_WIDTH_RATIO: 0.35,
  MIN_DOCK_WIDTH: 300,
  MAX_DOCK_WIDTH: 480,
} as const;

export function getDockWidth(): number {
  const available = window.innerWidth - LAYOUT.TICKER_WIDTH;
  const w = Math.round(available * LAYOUT.DOCK_WIDTH_RATIO);
  return Math.max(LAYOUT.MIN_DOCK_WIDTH, Math.min(LAYOUT.MAX_DOCK_WIDTH, w));
}

export function getDockGeometry(side: 'left' | 'right', index: number, total: number): { x: number; y: number; w: number; h: number } {
  const dockW = side === 'left' ? LAYOUT.TICKER_WIDTH : getDockWidth();
  const topOffset = LAYOUT.SAINT_TRACKER_HEIGHT + LAYOUT.TITLE_BAR_HEIGHT;
  const totalH = window.innerHeight - topOffset - LAYOUT.FKEY_BAR_HEIGHT;
  const perWindowH = Math.floor(totalH / Math.max(1, total));
  const x = side === 'left' ? 0 : window.innerWidth - dockW;
  const y = topOffset + index * perWindowH;
  const h = index === total - 1 ? totalH - index * perWindowH : perWindowH;
  return { x, y, w: dockW, h };
}

export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: 'buy', title: 'BUY — BID PANEL', defaultWidth: 320, defaultHeight: 220, minWidth: 260, minHeight: 160, defaultAnchor: 'right' },
  { id: 'sell', title: 'SELL — MARKET ORDERS', defaultWidth: 320, defaultHeight: 400, minWidth: 260, minHeight: 200, defaultAnchor: null },
  { id: 'port', title: 'PORTFOLIO OVERVIEW', defaultWidth: 340, defaultHeight: 450, minWidth: 280, minHeight: 200, defaultAnchor: null },
  { id: 'enshrine', title: 'ENSHRINE — LOCK RELICS', defaultWidth: 320, defaultHeight: 400, minWidth: 260, minHeight: 200, defaultAnchor: null },
  { id: 'intel', title: 'INTEL — MARKET CONDITIONS', defaultWidth: 300, defaultHeight: 500, minWidth: 240, minHeight: 200, defaultAnchor: null },
  { id: 'doctrine', title: 'DOCTRINE DEPLOYMENT', defaultWidth: 280, defaultHeight: 200, minWidth: 220, minHeight: 140, defaultAnchor: null },
  { id: 'log', title: 'TERMINAL FEED', defaultWidth: 320, defaultHeight: 350, minWidth: 260, minHeight: 160, defaultAnchor: 'right' },
  { id: 'sys', title: 'SYSTEM STATUS', defaultWidth: 260, defaultHeight: 320, minWidth: 220, minHeight: 160, defaultAnchor: null },
  { id: 'media', title: 'THE HOLY OBSERVER', defaultWidth: 380, defaultHeight: 520, minWidth: 320, minHeight: 300, defaultAnchor: null },
];

export function getWindowConfig(id: FKeyView): WindowConfig {
  return WINDOW_CONFIGS.find(c => c.id === id)!;
}
