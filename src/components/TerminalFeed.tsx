import { memo, useRef, useEffect } from 'react';
import { HerasyReport } from '../game/heresy';

interface TerminalFeedProps {
  messages: HerasyReport[];
  isSlowed: boolean;
}

const TerminalFeed = memo(({ messages, isSlowed }: TerminalFeedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="flex flex-col bg-cell flex-1 overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between bg-cell-titlebar px-2 border-b border-cell-border" style={{ height: 16 }}>
        <span className="text-[9px] text-muted-foreground font-mono">TRIBUNAL_FEED.LOG</span>
        {isSlowed && (
          <span className="text-[8px] text-accent font-mono animate-pulse">▓ HERESY DETECTED — MARKET DELAY ▓</span>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 font-mono"
        style={{ fontSize: 9, lineHeight: '14px' }}
      >
        {messages.map(msg => (
          <div key={msg.id} className="flex items-start gap-1.5 py-0.5">
            <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${msg.sect.dotClass}`} />
            <span className={`${msg.sect.colorClass} break-all`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

TerminalFeed.displayName = 'TerminalFeed';

export default TerminalFeed;
