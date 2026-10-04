import React, { useState, useEffect } from 'react';
import { Wallet, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import MonLogo from '../../assets/monad/Tokens/MON Token 32x32.svg';
import { 
  connectMonadWallet, 
  ensureMonadNetwork, 
  getMonadNativeBalance, 
  formatMonadAddress 
} from '../../lib/monad/provider';
import { MONAD_TESTNET } from '../../lib/monad/chain';

export const MonadConnectButton: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.0000');
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const onMonad = chainId.toLowerCase() === MONAD_TESTNET.chainIdHex.toLowerCase();
        setIsWrongNetwork(!onMonad);
        if (onMonad) {
          const bal = await getMonadNativeBalance(accounts[0]);
          setBalance(bal);
        }
      } else {
        setAddress(null);
      }
    } catch (e) {
      console.error('Error checking wallet:', e);
    }
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          checkConnection();
        } else {
          setAddress(null);
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectMonadWallet();
      setAddress(addr);
      setIsWrongNetwork(false);
      const bal = await getMonadNativeBalance(addr);
      setBalance(bal);
    } catch (err: any) {
      alert(err.message || 'Error al conectar con Monad');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await ensureMonadNetwork();
      setIsWrongNetwork(false);
      if (address) {
        const bal = await getMonadNativeBalance(address);
        setBalance(bal);
      }
    } catch (err: any) {
      alert('No se pudo cambiar a Monad Testnet');
    }
  };

  if (!address) {
    return (
      <button
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-monad-purple hover:bg-monad-purple-hover text-white text-xs font-semibold shadow-md transition-all active:scale-95"
      >
        <img src={MonLogo} alt="Monad" className="w-4 h-4 rounded-full" />
        <span>{loading ? 'Conectando...' : 'Conectar Monad'}</span>
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <button
        onClick={handleSwitchNetwork}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-md transition-all"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Cambiar a Monad</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-monad-void border border-monad-purple/40 text-white text-xs font-mono">
        <img src={MonLogo} alt="MON" className="w-4 h-4 rounded-full" />
        <span className="font-bold text-white">{balance} MON</span>
        <span className="text-gray-400">|</span>
        <span className="text-monad-cyan font-sans">{formatMonadAddress(address)}</span>
      </div>

      <a
        href={MONAD_TESTNET.faucetUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Obtener MON de prueba en el Faucet Oficial"
        className="px-2 py-1 rounded-lg bg-monad-purple/20 hover:bg-monad-purple/30 text-monad-purple-light text-xs font-medium border border-monad-purple/30 flex items-center gap-1 transition-all"
      >
        <span>Faucet</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
