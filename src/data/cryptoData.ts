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
  image: string;
}

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

// Fetches top 20 crypto assets directly from CoinGecko
export const fetchCryptoAssets = async (): Promise<CryptoAsset[]> => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d"
  );
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  const data = await res.json();

  return data.map((coin: any, i: number) => ({
    id: coin.id,
    rank: coin.market_cap_rank ?? i + 1,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price ?? 0,
    change24h: coin.price_change_percentage_24h ?? 0,
    change7d: coin.price_change_percentage_7d_in_currency ?? 0,
    marketCap: coin.market_cap ?? 0,
    volume24h: coin.total_volume ?? 0,
    sparkline: coin.sparkline_in_7d?.price?.slice(-24) ?? [],
    image: (coin.image ?? "").replace("/large/", "/small/"),
  }));
};

export interface MarketGlobal {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  marketCapChange24h: number;
}

export const fetchMarketGlobal = async (): Promise<MarketGlobal> => {
  const res = await fetch("https://api.coingecko.com/api/v3/global");
  if (!res.ok) throw new Error("Failed to fetch global data");
  const { data } = await res.json();

  return {
    totalMarketCap: data.total_market_cap?.usd ?? 0,
    totalVolume: data.total_volume?.usd ?? 0,
    btcDominance: data.market_cap_percentage?.btc ?? 0,
    marketCapChange24h: data.market_cap_change_percentage_24h_usd ?? 0,
  };
};
