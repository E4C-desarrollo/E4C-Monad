// src/lib/monad/chain.ts

export interface MonadNetworkConfig {
  chainId: number;
  chainIdHex: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  faucetUrl: string;
  iconUrls?: string[];
}

export const MONAD_TESTNET: MonadNetworkConfig = {
  chainId: 10143,
  chainIdHex: '0x279f',
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: [
    'https://testnet-rpc.monad.xyz',
    'https://rpc.ankr.com/monad_testnet'
  ],
  blockExplorerUrls: [
    'https://testnet.monadexplorer.com',
    'https://testnet.monadscan.com',
    'https://testnet.monadvision.com'
  ],
  faucetUrl: 'https://faucet.monad.xyz'
};

export const MONAD_MAINNET: MonadNetworkConfig = {
  chainId: 143, // Placeholder standard Monad ID
  chainIdHex: '0x8f',
  chainName: 'Monad Mainnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: [
    'https://rpc.monad.xyz'
  ],
  blockExplorerUrls: [
    'https://monadscan.com'
  ],
  faucetUrl: ''
};

export const ACTIVE_MONAD_NETWORK = MONAD_TESTNET;
