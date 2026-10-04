// src/lib/monad/provider.ts
import { MONAD_TESTNET } from './chain';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface MonadWalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isMonadNetwork: boolean;
  monBalance: string;
}

/**
 * Solicita la conexión con la wallet EVM del usuario (MetaMask, Rabby, etc.)
 */
export async function connectMonadWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No se detectó ninguna wallet EVM (MetaMask, Rabby, etc.). Instálala para continuar.');
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No se seleccionó ninguna cuenta.');
  }

  await ensureMonadNetwork();
  return accounts[0];
}

/**
 * Asegura que la wallet esté conectada a Monad Testnet (Chain ID 10143).
 * Si no está agregada, la añade automáticamente.
 */
export async function ensureMonadNetwork(): Promise<boolean> {
  if (!window.ethereum) return false;

  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (currentChainId.toLowerCase() === MONAD_TESTNET.chainIdHex.toLowerCase()) {
    return true;
  }

  try {
    // Intentar cambiar a la red de Monad
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_TESTNET.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // Código 4902: La red aún no está agregada en la wallet
    if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: MONAD_TESTNET.chainIdHex,
              chainName: MONAD_TESTNET.chainName,
              nativeCurrency: MONAD_TESTNET.nativeCurrency,
              rpcUrls: MONAD_TESTNET.rpcUrls,
              blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error al agregar Monad Testnet a la wallet:', addError);
        throw addError;
      }
    }
    throw switchError;
  }
}

/**
 * Obtiene el balance de MON nativo de una dirección.
 */
export async function getMonadNativeBalance(address: string): Promise<string> {
  if (!address) return '0.0000';

  try {
    const rpcUrl = MONAD_TESTNET.rpcUrls[0];
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    if (data.result) {
      const balanceWei = BigInt(data.result);
      // Convertir Wei a MON (18 decimales)
      const balanceMON = Number(balanceWei) / 1e18;
      return balanceMON.toFixed(4);
    }
    return '0.0000';
  } catch (err) {
    console.error('Error al consultar balance nativo MON:', err);
    return '0.0000';
  }
}

/**
 * Verifica si una dirección es un formato EVM válido
 */
export function isValidMonadAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Acorta una dirección EVM para mostrarla en la UI (ej. 0x1234...abcd)
 */
export function formatMonadAddress(address: string): string {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
