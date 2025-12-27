import { useQuery } from '@tanstack/react-query';

export type NetworkType = 'ethereum' | 'bsc' | 'polygon';

export interface NetworkConfig {
  id: NetworkType;
  name: string;
  chainId: number;
  symbol: string;
  explorer: string;
  explorerApi: string;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    explorerApi: 'https://api.etherscan.io/v2/api',
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    explorerApi: 'https://api.etherscan.io/v2/api',
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    explorerApi: 'https://api.etherscan.io/v2/api',
  },
};

// Approximate prices - in production, fetch from CoinGecko
const TOKEN_PRICES: Record<string, number> = {
  ETH: 2930,
  BNB: 300,
  MATIC: 0.85,
};

export interface WalletData {
  address: string;
  balance: string;
  balanceUsd: number;
  transactionCount: number;
  network: NetworkConfig;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  valueUsd: number;
  gasUsed: string;
  gasPrice: string;
  gasFee: string;
  gasFeeUsd: number;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed';
  isIncoming: boolean;
  network: NetworkConfig;
}

export interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  valueUsd: number;
  gasUsed: string;
  gasPrice: string;
  gasFee: string;
  gasFeeUsd: number;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed';
  nonce: number;
  inputData: string;
  network: NetworkConfig;
}

const getTokenPrice = (symbol: string): number => {
  return TOKEN_PRICES[symbol] || 0;
};

const fetchWalletData = async (address: string, network: NetworkType): Promise<WalletData> => {
  const config = NETWORKS[network];
  const price = getTokenPrice(config.symbol);
  
  // Fetch balance using Etherscan V2 API
  const balanceResponse = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=account&action=balance&address=${address}&tag=latest`
  );
  const balanceData = await balanceResponse.json();
  
  if (balanceData.status !== '1' && balanceData.message !== 'OK') {
    throw new Error(balanceData.result || 'Failed to fetch wallet data');
  }
  
  const balanceWei = balanceData.result || '0';
  const balanceToken = parseFloat(balanceWei) / 1e18;
  
  // Fetch transaction list to get count
  const txResponse = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc`
  );
  const txData = await txResponse.json();
  
  return {
    address,
    balance: balanceToken.toFixed(6),
    balanceUsd: balanceToken * price,
    transactionCount: txData.status === '1' ? txData.result.length : 0,
    network: config,
  };
};

const fetchWalletTransactions = async (address: string, network: NetworkType): Promise<Transaction[]> => {
  const config = NETWORKS[network];
  const price = getTokenPrice(config.symbol);
  
  const response = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc`
  );
  const data = await response.json();
  
  if (data.status !== '1') {
    return [];
  }
  
  return data.result.map((tx: any) => {
    const valueToken = parseFloat(tx.value) / 1e18;
    const gasFeeToken = (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18;
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: valueToken.toFixed(6),
      valueUsd: valueToken * price,
      gasUsed: tx.gasUsed,
      gasPrice: (parseFloat(tx.gasPrice) / 1e9).toFixed(2),
      gasFee: gasFeeToken.toFixed(6),
      gasFeeUsd: gasFeeToken * price,
      blockNumber: parseInt(tx.blockNumber),
      timestamp: parseInt(tx.timeStamp) * 1000,
      status: tx.isError === '0' ? 'success' : 'failed',
      isIncoming: tx.to?.toLowerCase() === address.toLowerCase(),
      network: config,
    };
  });
};

const fetchTransactionDetails = async (hash: string, network: NetworkType): Promise<TransactionDetails> => {
  const config = NETWORKS[network];
  const price = getTokenPrice(config.symbol);
  
  // Fetch transaction details using V2 API
  const txResponse = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=proxy&action=eth_getTransactionByHash&txhash=${hash}`
  );
  const txData = await txResponse.json();
  
  if (!txData.result) {
    throw new Error('Transaction not found');
  }
  
  const tx = txData.result;
  
  // Fetch transaction receipt for gas used and status
  const receiptResponse = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=proxy&action=eth_getTransactionReceipt&txhash=${hash}`
  );
  const receiptData = await receiptResponse.json();
  const receipt = receiptData.result;
  
  // Fetch block for timestamp
  const blockResponse = await fetch(
    `${config.explorerApi}?chainid=${config.chainId}&module=proxy&action=eth_getBlockByNumber&tag=${tx.blockNumber}&boolean=false`
  );
  const blockData = await blockResponse.json();
  const block = blockData.result;
  
  const valueToken = parseInt(tx.value, 16) / 1e18;
  const gasUsed = receipt ? parseInt(receipt.gasUsed, 16) : 0;
  const gasPrice = parseInt(tx.gasPrice, 16);
  const gasFeeToken = (gasUsed * gasPrice) / 1e18;
  const timestamp = block ? parseInt(block.timestamp, 16) * 1000 : Date.now();
  
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to || 'Contract Creation',
    value: valueToken.toFixed(6),
    valueUsd: valueToken * price,
    gasUsed: gasUsed.toString(),
    gasPrice: (gasPrice / 1e9).toFixed(2),
    gasFee: gasFeeToken.toFixed(6),
    gasFeeUsd: gasFeeToken * price,
    blockNumber: parseInt(tx.blockNumber, 16),
    timestamp,
    status: receipt && receipt.status === '0x1' ? 'success' : 'failed',
    nonce: parseInt(tx.nonce, 16),
    inputData: tx.input,
    network: config,
  };
};

export const useWalletData = (address: string, network: NetworkType = 'ethereum') => {
  return useQuery({
    queryKey: ['walletData', address, network],
    queryFn: () => fetchWalletData(address, network),
    enabled: !!address && address.length === 42,
    staleTime: 30000,
    retry: 1,
  });
};

export const useWalletTransactions = (address: string, network: NetworkType = 'ethereum') => {
  return useQuery({
    queryKey: ['walletTransactions', address, network],
    queryFn: () => fetchWalletTransactions(address, network),
    enabled: !!address && address.length === 42,
    staleTime: 30000,
    retry: 1,
  });
};

export const useTransactionDetails = (hash: string, network: NetworkType = 'ethereum') => {
  return useQuery({
    queryKey: ['transactionDetails', hash, network],
    queryFn: () => fetchTransactionDetails(hash, network),
    enabled: !!hash && hash.length === 66,
    staleTime: 60000,
    retry: 1,
  });
};
