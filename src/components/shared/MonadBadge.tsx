import React from 'react';
import MonLogo from '../../assets/monad/Tokens/MON Token 32x32.svg';

interface MonadBadgeProps {
  balance?: string;
  showNetwork?: boolean;
  className?: string;
}

export const MonadBadge: React.FC<MonadBadgeProps> = ({
  balance,
  showNetwork = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-monad-void/90 text-white border border-monad-purple/40 shadow-sm ${className}`}>
      <img src={MonLogo} alt="MON" className="w-5 h-5 rounded-full" />
      {balance !== undefined && (
        <span className="font-mono font-bold text-sm tracking-tight text-white">
          {balance} <span className="text-monad-cyan text-xs">MON</span>
        </span>
      )}
      {showNetwork && (
        <span className="inline-flex items-center gap-1.5 text-xs text-monad-purple-light font-medium border-l border-white/20 pl-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Monad Testnet
        </span>
      )}
    </div>
  );
};
