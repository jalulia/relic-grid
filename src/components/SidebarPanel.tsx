import React, { memo } from 'react';
import { FKeyView } from './FKeyBar';
import { GameState } from '../game/types';
import { HerasyReport } from '../game/heresy';
import { Lot } from '../game/types';
import BidPanel from './BidPanel';
import SellPanel from './SellPanel';
import PortfolioPanel from './PortfolioPanel';
import EnshrinePanel from './EnshrinePanel';
import IntelPanel from './IntelPanel';
import DoctrinePanel from './DoctrinePanel';
import TerminalFeed from './TerminalFeed';
import SysPanel from './SysPanel';
import MediaPanel from './MediaPanel';
import CompactFeed from './CompactFeed';

interface SidebarPanelProps {
  activeView: FKeyView;
  game: GameState;
  messages: HerasyReport[];
  selectedLot: Lot | null;
  isSlowed: boolean;
  onBid: (lotId: string, amount: number) => void;
  onSell: (relicId: string) => void;
  onEnshrine: (relicId: string) => void;
  onDeselect: () => void;
  startTime: number;
  saintProgress: { collected: number; total: number } | null;
}

const SidebarPanel = memo(({
  activeView, game, messages, selectedLot, isSlowed,
  onBid, onSell, onEnshrine, onDeselect, startTime, saintProgress,
}: SidebarPanelProps) => {
  const showCompactFeed = activeView !== 'log';

  return (
    <div className="flex flex-col h-full">
      {/* Active Panel */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'buy' && (
          <BidPanel
            lot={selectedLot}
            currency={game.currency}
            onBid={onBid}
            onClose={onDeselect}
            saintProgress={saintProgress}
          />
        )}
        {activeView === 'sell' && (
          <SellPanel
            portfolio={game.portfolio}
            currency={game.currency}
            onSell={onSell}
          />
        )}
        {activeView === 'port' && (
          <PortfolioPanel
            portfolio={game.portfolio}
            saints={game.saints}
            currency={game.currency}
          />
        )}
        {activeView === 'enshrine' && (
          <EnshrinePanel
            portfolio={game.portfolio}
            saints={game.saints}
            onEnshrine={onEnshrine}
          />
        )}
        {activeView === 'intel' && (
          <IntelPanel
            market={game.market}
            saints={game.saints}
            lotCount={game.lots.filter(l => l.status === 'active').length}
          />
        )}
        {activeView === 'doctrine' && <DoctrinePanel />}
        {activeView === 'log' && (
          <TerminalFeed messages={messages} isSlowed={isSlowed} />
        )}
        {activeView === 'sys' && (
          <SysPanel game={game} startTime={startTime} />
        )}
        {activeView === 'media' && (
          <MediaPanel
            market={game.market}
            saints={game.saints}
            messages={messages}
          />
        )}
      </div>

      {/* Compact Feed (shown in all views except LOG) */}
      {showCompactFeed && <CompactFeed messages={messages} />}
    </div>
  );
});

SidebarPanel.displayName = 'SidebarPanel';
export default SidebarPanel;
