import React, { useRef, useCallback, useState } from 'react';
import { FKeyView } from '../components/FKeyBar';
import { useWindowManager } from './WindowManager';
import { getWindowConfig, LAYOUT } from './types';

interface FloatingWindowProps {
  windowId: FKeyView;
  children: React.ReactNode;
}

export default function FloatingWindow({ windowId, children }: FloatingWindowProps) {
  const { state, dispatch, bringToFront, closeWindow } = useWindowManager();
  const win = state.windows[windowId];
  const config = getWindowConfig(windowId);
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; wasDocked: boolean } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | null>(null);

  // ── DRAG ──
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (!win?.isOpen) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-window-control]')) return;
    e.preventDefault();
    bringToFront(windowId);

    const wasDocked = win.anchor !== null;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.position.x,
      origY: win.position.y,
      wasDocked,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current || !elRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;

      // If docked and dragged more than 20px, undock
      if (dragRef.current.wasDocked && (Math.abs(dx) > 20 || Math.abs(dy) > 20)) {
        dragRef.current.wasDocked = false;
        const restoredW = win.floatingSize?.w ?? config.defaultWidth;
        dragRef.current.origX = ev.clientX - restoredW / 2;
        dragRef.current.origY = ev.clientY - 11;
        dragRef.current.startX = ev.clientX;
        dragRef.current.startY = ev.clientY;
        dispatch({ type: 'UNDOCK_WINDOW', id: windowId, x: dragRef.current.origX, y: dragRef.current.origY });
      }

      const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.origX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.origY + dy));
      elRef.current.style.left = newX + 'px';
      elRef.current.style.top = newY + 'px';

      // Snap zone preview
      if (newX < LAYOUT.DOCK_SNAP_THRESHOLD) {
        setSnapPreview('left');
      } else if (newX + (elRef.current.offsetWidth) > window.innerWidth - LAYOUT.DOCK_RIGHT_MARGIN) {
        setSnapPreview('right');
      } else {
        setSnapPreview(null);
      }
    };

    const onUp = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const finalX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.origX + dx));
      const finalY = Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.origY + dy));
      const wasDocked = dragRef.current.wasDocked;
      dragRef.current = null;
      setSnapPreview(null);

      if (wasDocked) {
        // Was docked and didn't undock (small drag) — just bring to front, keep docked
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        return;
      }

      // Check dock snap zones
      if (finalX < LAYOUT.DOCK_SNAP_THRESHOLD) {
        dispatch({ type: 'DOCK_WINDOW', id: windowId, side: 'left' });
      } else if (finalX + (win?.size.w ?? 0) > window.innerWidth - LAYOUT.DOCK_RIGHT_MARGIN) {
        dispatch({ type: 'DOCK_WINDOW', id: windowId, side: 'right' });
      } else {
        dispatch({ type: 'MOVE_WINDOW', id: windowId, x: finalX, y: finalY });
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [windowId, win?.position, win?.size.w, win?.isOpen, win?.anchor, win?.floatingSize, config.defaultWidth, bringToFront, dispatch]);

  // ── RESIZE ──
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    if (!win?.isOpen) return;
    e.preventDefault();
    e.stopPropagation();
    bringToFront(windowId);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.size.w,
      origH: win.size.h,
    };

    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current || !elRef.current) return;
      const dw = ev.clientX - resizeRef.current.startX;
      const dh = ev.clientY - resizeRef.current.startY;
      const newW = Math.max(config.minWidth, resizeRef.current.origW + dw);
      const newH = Math.max(config.minHeight, resizeRef.current.origH + dh);
      elRef.current.style.width = newW + 'px';
      elRef.current.style.height = newH + 'px';
    };

    const onUp = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dw = ev.clientX - resizeRef.current.startX;
      const dh = ev.clientY - resizeRef.current.startY;
      const finalW = Math.max(config.minWidth, resizeRef.current.origW + dw);
      const finalH = Math.max(config.minHeight, resizeRef.current.origH + dh);
      resizeRef.current = null;
      dispatch({ type: 'RESIZE_WINDOW', id: windowId, w: finalW, h: finalH });
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [windowId, win?.size, win?.isOpen, config.minWidth, config.minHeight, bringToFront, dispatch]);

  // Early return AFTER all hooks
  if (!win || !win.isOpen) return null;

  const isDocked = win.anchor !== null;

  return (
    <>
      {/* Snap zone preview overlay */}
      {snapPreview && (
        <div
          style={{
            position: 'fixed',
            top: LAYOUT.SAINT_TRACKER_HEIGHT + LAYOUT.TITLE_BAR_HEIGHT,
            left: snapPreview === 'left' ? LAYOUT.TICKER_WIDTH : undefined,
            right: snapPreview === 'right' ? 0 : undefined,
            width: Math.round((window.innerWidth - LAYOUT.TICKER_WIDTH) * LAYOUT.DOCK_WIDTH_RATIO),
            height: window.innerHeight - LAYOUT.SAINT_TRACKER_HEIGHT - LAYOUT.TITLE_BAR_HEIGHT - LAYOUT.FKEY_BAR_HEIGHT,
            background: 'hsla(225, 80%, 50%, 0.12)',
            border: '1px solid hsla(225, 80%, 50%, 0.3)',
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'opacity 0.15s ease',
          }}
        />
      )}

      <div
        ref={elRef}
        onMouseDown={() => bringToFront(windowId)}
        style={{
          position: 'fixed',
          left: win.position.x,
          top: win.position.y,
          width: win.size.w,
          height: win.size.h,
          zIndex: win.zIndex,
          border: isDocked ? '1px solid hsl(225 60% 25%)' : '1px solid hsl(225 80% 35%)',
          background: 'hsl(240 12% 4%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          pointerEvents: 'auto',
          boxShadow: isDocked ? 'none' : '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title Bar */}
        <div
          onMouseDown={onDragStart}
          style={{
            height: 22,
            background: isDocked ? 'hsl(240 10% 6%)' : 'hsl(240 10% 8%)',
            borderBottom: '1px solid hsl(225 15% 18%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            cursor: 'grab',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {isDocked && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 7,
                color: 'hsl(225 60% 45%)',
              }}>
                {win.anchor === 'left' ? '◀' : '▶'}
              </span>
            )}
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: 'hsl(240 5% 55%)',
            }}>
              {config.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }} data-window-control>
            <button
              onClick={() => closeWindow(windowId)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                fontWeight: 600,
                color: 'hsl(240 5% 45%)',
                cursor: 'pointer',
                padding: '0 2px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* Resize Handle — only for floating windows */}
        {!isDocked && (
          <div
            onMouseDown={onResizeStart}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              cursor: 'nwse-resize',
            }}
          />
        )}
      </div>
    </>
  );
}
