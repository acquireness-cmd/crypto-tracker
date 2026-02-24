import { useQuery } from "@tanstack/react-query";
import { fetchCryptoAssets, fetchMarketGlobal } from "@/data/cryptoData";

export const useCryptoAssets = () =>
  useQuery({
    queryKey: ["cryptoAssets"],
    queryFn: fetchCryptoAssets,
    refetchInterval: 10000,
    staleTime: 5000,
  });

export const useMarketGlobal = () =>
  useQuery({
    queryKey: ["marketGlobal"],
    queryFn: fetchMarketGlobal,
    refetchInterval: 10000,
    staleTime: 5000,
  });
