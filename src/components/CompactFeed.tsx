import React, { memo } from 'react';
import { HerasyReport } from '../game/heresy';

interface CompactFeedProps {
  messages: HerasyReport[];
}

const CompactFeed = memo(({ messages }: CompactFeedProps) => {
  const recent = messages.slice(-4);
  return (
    <div
      className="border-t border-cell-border bg-background px-2 py-1 shrink-0 overflow-hidden"
      style={{ height: 60 }}
    >
      <div className="text-[8px] text-muted-foreground font-mono mb-0.5" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
        FEED
      </div>
      {recent.map(msg => (
        <div
          key={msg.id}
          className="flex items-start gap-1 text-[9px] font-mono leading-tight"
          style={{ padding: '1px 0' }}
        >
          <span
            className="shrink-0 mt-0.5"
            style={{
              width: 4,
              height: 4,
              background: msg.sect.id === 'flagellant' ? 'hsl(0 70% 50%)' :
                msg.sect.id === 'cathar' ? 'hsl(195 55% 50%)' :
                msg.sect.id === 'gnostic' ? 'hsl(300 55% 50%)' :
                msg.sect.id === 'bogomil' ? 'hsl(130 60% 36%)' :
                msg.sect.id === 'waldensian' ? 'hsl(30 80% 50%)' :
                'hsl(240 5% 45%)',
              display: 'inline-block',
            }}
          />
          <span className="text-muted-foreground truncate">{msg.message}</span>
        </div>
      ))}
    </div>
  );
});

CompactFeed.displayName = 'CompactFeed';
export default CompactFeed;
