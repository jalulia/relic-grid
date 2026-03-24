import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { FKeyView } from '../components/FKeyBar';
import { WindowManagerState, WindowState, WINDOW_CONFIGS, getWindowConfig, getDockGeometry } from './types';

// ── INITIAL STATE ──

let cascadeOffset = 0;

function createInitialState(): WindowManagerState {
  const windows: Record<string, WindowState> = {};

  WINDOW_CONFIGS.forEach(config => {
    const isDefaultOpen = config.defaultAnchor !== null;
    const x = !config.defaultAnchor ? 300 + cascadeOffset * 24 : 0;
    const y = !config.defaultAnchor ? 80 + cascadeOffset * 24 : 0;

    if (!config.defaultAnchor) cascadeOffset++;

    windows[config.id] = {
      id: config.id,
      isOpen: isDefaultOpen,
      position: { x, y },
      size: { w: config.defaultWidth, h: config.defaultHeight },
      anchor: config.defaultAnchor,
      zIndex: isDefaultOpen ? 101 : 100,
      floatingSize: null,
    };
  });

  // Calculate proper dock geometry for initially docked windows
  recalcDocked(windows, 'left');
  recalcDocked(windows, 'right');

  return { windows, topZ: 102, lastFocused: 'buy' };
}

// ── Helpers ──

/** Recalculate position and size for all docked windows on a given side */
function recalcDocked(windows: Record<string, WindowState>, side: 'left' | 'right'): void {
  const docked = Object.values(windows)
    .filter(w => w.isOpen && w.anchor === side)
    .sort((a, b) => a.zIndex - b.zIndex);
  docked.forEach((w, i) => {
    const geo = getDockGeometry(side, i, docked.length);
    windows[w.id] = { ...windows[w.id], position: { x: geo.x, y: geo.y }, size: { w: geo.w, h: geo.h } };
  });
}

// ── ACTIONS ──

type WindowAction =
  | { type: 'TOGGLE_WINDOW'; id: FKeyView }
  | { type: 'OPEN_WINDOW'; id: FKeyView }
  | { type: 'CLOSE_WINDOW'; id: FKeyView }
  | { type: 'BRING_TO_FRONT'; id: FKeyView }
  | { type: 'MOVE_WINDOW'; id: FKeyView; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; id: FKeyView; w: number; h: number }
  | { type: 'DOCK_WINDOW'; id: FKeyView; side: 'left' | 'right' }
  | { type: 'UNDOCK_WINDOW'; id: FKeyView; x: number; y: number }
  | { type: 'RECALC_DOCKED' }
  // Legacy — kept for backwards compat but prefer DOCK_WINDOW
  | { type: 'ANCHOR_WINDOW'; id: FKeyView; side: 'left' | 'right' }
  | { type: 'UNANCHOR_WINDOW'; id: FKeyView };

function reducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
  const windows = { ...state.windows };

  switch (action.type) {
    case 'TOGGLE_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      if (!win.isOpen) {
        const topZ = state.topZ + 1;
        windows[action.id] = { ...win, isOpen: true, zIndex: topZ };
        // Recalc if it has a dock anchor
        if (win.anchor) recalcDocked(windows, win.anchor);
        return { windows, topZ, lastFocused: action.id };
      }
      const isTop = Object.values(windows).filter(w => w.isOpen).every(w => w.zIndex <= win.zIndex);
      if (isTop) {
        windows[action.id] = { ...win, isOpen: false };
        if (win.anchor) recalcDocked(windows, win.anchor);
        return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
      }
      const topZ = state.topZ + 1;
      windows[action.id] = { ...win, zIndex: topZ };
      return { windows, topZ, lastFocused: action.id };
    }

    case 'OPEN_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      const topZ = state.topZ + 1;
      windows[action.id] = { ...win, isOpen: true, zIndex: topZ };
      if (win.anchor) recalcDocked(windows, win.anchor);
      return { windows, topZ, lastFocused: action.id };
    }

    case 'CLOSE_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      const side = win.anchor;
      windows[action.id] = { ...win, isOpen: false, anchor: null };
      if (side) recalcDocked(windows, side);
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    case 'BRING_TO_FRONT': {
      const win = windows[action.id];
      if (!win) return state;
      const topZ = state.topZ + 1;
      windows[action.id] = { ...win, zIndex: topZ };
      return { windows, topZ, lastFocused: action.id };
    }

    case 'MOVE_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      windows[action.id] = { ...win, position: { x: action.x, y: action.y }, anchor: null };
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    case 'RESIZE_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      const config = getWindowConfig(action.id);
      const w = Math.max(config.minWidth, action.w);
      const h = Math.max(config.minHeight, action.h);
      windows[action.id] = { ...win, size: { w, h } };
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    case 'DOCK_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      const topZ = state.topZ + 1;
      // Save current floating size before docking
      windows[action.id] = {
        ...win,
        anchor: action.side,
        zIndex: topZ,
        floatingSize: win.anchor ? win.floatingSize : { w: win.size.w, h: win.size.h },
      };
      recalcDocked(windows, action.side);
      return { windows, topZ, lastFocused: action.id };
    }

    case 'UNDOCK_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      const side = win.anchor;
      const config = getWindowConfig(action.id);
      const restoredSize = win.floatingSize ?? { w: config.defaultWidth, h: config.defaultHeight };
      const topZ = state.topZ + 1;
      windows[action.id] = {
        ...win,
        anchor: null,
        position: { x: action.x, y: action.y },
        size: restoredSize,
        floatingSize: null,
        zIndex: topZ,
      };
      if (side) recalcDocked(windows, side);
      return { windows, topZ, lastFocused: action.id };
    }

    case 'RECALC_DOCKED': {
      recalcDocked(windows, 'left');
      recalcDocked(windows, 'right');
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    // Legacy compat
    case 'ANCHOR_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      windows[action.id] = { ...win, anchor: action.side };
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    case 'UNANCHOR_WINDOW': {
      const win = windows[action.id];
      if (!win) return state;
      windows[action.id] = { ...win, anchor: null };
      return { windows, topZ: state.topZ, lastFocused: state.lastFocused };
    }

    default:
      return state;
  }
}

// ── CONTEXT ──

interface WindowManagerContextValue {
  state: WindowManagerState;
  dispatch: React.Dispatch<WindowAction>;
  toggleWindow: (id: FKeyView) => void;
  openWindow: (id: FKeyView) => void;
  closeWindow: (id: FKeyView) => void;
  bringToFront: (id: FKeyView) => void;
  getOpenWindows: () => WindowState[];
  isWindowOpen: (id: FKeyView) => boolean;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const toggleWindow = useCallback((id: FKeyView) => dispatch({ type: 'TOGGLE_WINDOW', id }), []);
  const openWindow = useCallback((id: FKeyView) => dispatch({ type: 'OPEN_WINDOW', id }), []);
  const closeWindow = useCallback((id: FKeyView) => dispatch({ type: 'CLOSE_WINDOW', id }), []);
  const bringToFront = useCallback((id: FKeyView) => dispatch({ type: 'BRING_TO_FRONT', id }), []);
  const getOpenWindows = useCallback(() => Object.values(state.windows).filter(w => w.isOpen), [state.windows]);
  const isWindowOpen = useCallback((id: FKeyView) => state.windows[id]?.isOpen ?? false, [state.windows]);

  // Recalculate docked windows on viewport resize
  useEffect(() => {
    const handleResize = () => dispatch({ type: 'RECALC_DOCKED' });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WindowManagerContext.Provider value={{ state, dispatch, toggleWindow, openWindow, closeWindow, bringToFront, getOpenWindows, isWindowOpen }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
