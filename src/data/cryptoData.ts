export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
}

const generateSparkline = (trend: number): number[] => {
  const points: number[] = [];
  let value = 50 + Math.random() * 20;
  for (let i = 0; i < 24; i++) {
    value += (Math.random() - 0.5 + trend * 0.1) * 5;
    value = Math.max(10, Math.min(90, value));
    points.push(value);
  }
  return points;
};

export const cryptoAssets: CryptoAsset[] = [
  { id: "bitcoin", rank: 1, name: "Bitcoin", symbol: "BTC", price: 96842.31, change24h: 2.34, change7d: 5.12, marketCap: 1912000000000, volume24h: 42300000000, sparkline: generateSparkline(1) },
  { id: "ethereum", rank: 2, name: "Ethereum", symbol: "ETH", price: 3421.87, change24h: -1.23, change7d: 3.45, marketCap: 411000000000, volume24h: 18700000000, sparkline: generateSparkline(-0.5) },
  { id: "tether", rank: 3, name: "Tether", symbol: "USDT", price: 1.00, change24h: 0.01, change7d: -0.02, marketCap: 139000000000, volume24h: 67800000000, sparkline: generateSparkline(0) },
  { id: "solana", rank: 4, name: "Solana", symbol: "SOL", price: 198.45, change24h: 4.56, change7d: 12.34, marketCap: 96200000000, volume24h: 5400000000, sparkline: generateSparkline(2) },
  { id: "bnb", rank: 5, name: "BNB", symbol: "BNB", price: 685.23, change24h: 1.12, change7d: 2.34, marketCap: 98500000000, volume24h: 2100000000, sparkline: generateSparkline(0.5) },
  { id: "xrp", rank: 6, name: "XRP", symbol: "XRP", price: 2.41, change24h: -2.87, change7d: -1.23, marketCap: 138000000000, volume24h: 8900000000, sparkline: generateSparkline(-1) },
  { id: "cardano", rank: 7, name: "Cardano", symbol: "ADA", price: 0.98, change24h: 3.21, change7d: 8.76, marketCap: 34800000000, volume24h: 1200000000, sparkline: generateSparkline(1.5) },
  { id: "dogecoin", rank: 8, name: "Dogecoin", symbol: "DOGE", price: 0.327, change24h: -0.45, change7d: 6.54, marketCap: 48200000000, volume24h: 3100000000, sparkline: generateSparkline(0.3) },
  { id: "avalanche", rank: 9, name: "Avalanche", symbol: "AVAX", price: 38.67, change24h: 5.89, change7d: 15.23, marketCap: 15800000000, volume24h: 890000000, sparkline: generateSparkline(2.5) },
  { id: "polkadot", rank: 10, name: "Polkadot", symbol: "DOT", price: 7.23, change24h: -1.67, change7d: 4.32, marketCap: 10200000000, volume24h: 420000000, sparkline: generateSparkline(-0.3) },
];

export const formatPrice = (price: number): string => {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
};

export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};
