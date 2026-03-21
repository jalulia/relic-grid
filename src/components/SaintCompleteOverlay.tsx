import { useEffect, useState } from 'react';
import { playWololo } from '../game/audio';

interface Props {
  saintName: string | null;
  onDone: () => void;
}

export default function SaintCompleteOverlay({ saintName, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (saintName) {
      setVisible(true);
      playWololo();
      const timer = setTimeout(() => {
        setVisible(false);
        onDone();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [saintName, onDone]);

  if (!visible || !saintName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <div className="saint-complete text-center">
        <div className="text-accent font-mono" style={{ fontSize: 14, letterSpacing: 8 }}>
          SAINT COMPLETE
        </div>
        <div className="text-primary font-mono mt-2" style={{ fontSize: 48, letterSpacing: 4 }}>
          {saintName}
        </div>
      </div>
    </div>
  );
}
