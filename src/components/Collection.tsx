import { memo } from 'react';
import { Saint } from '../game/types';
import { getRelicImage } from '../game/relicImages';

interface CollectionProps {
  saints: Saint[];
}

const Collection = memo(({ saints }: CollectionProps) => {
  const activeSaints = saints.filter(s => s.collectedRelics.length > 0);

  return (
    <div className="flex flex-col border-t border-cell-border bg-cell shrink-0 overflow-hidden" style={{ height: 160 }}>
      <div className="flex items-center bg-cell-titlebar px-2 border-b border-cell-border" style={{ height: 16 }}>
        <span className="text-[9px] text-accent font-mono">▶ COLLECTION ({activeSaints.reduce((a, s) => a + s.collectedRelics.length, 0)} relics)</span>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5">
        {activeSaints.length === 0 ? (
          <div className="text-muted-foreground font-mono text-[9px] text-center py-3">
            Win auctions to collect relics
          </div>
        ) : (
          activeSaints.map(saint => (
            <div key={saint.id} className="mb-1.5">
              <div className="text-[9px] text-muted-foreground font-mono mb-0.5">
                {saint.name} ({saint.collectedRelics.length}/{saint.totalRelics})
              </div>
              <div className="flex flex-wrap gap-1">
                {saint.collectedRelics.map((relicName, i) => {
                  const relicId = `${saint.id}-${i}`;
                  return (
                    <div
                      key={relicName}
                      className="relative group"
                      style={{ width: 28, height: 28 }}
                    >
                      <img
                        src={getRelicImage(relicId)}
                        alt={relicName}
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 0 3px hsl(45 100% 50% / 0.4))' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-background border border-cell-border px-1 py-0.5 text-[8px] text-foreground font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-30">
                        {relicName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

Collection.displayName = 'Collection';

export default Collection;
