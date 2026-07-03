"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";

export type PodToken = {
  tokenId: number;
  tokenUri: string | null;
};

type PodMetadata = {
  name: string;
  symbol: string;
  totalSupply: number;
};

type SuccessResponse<T> = { ok: true } & T & Record<string, unknown>;
type ErrorResponse = { ok: false; error: string };
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => ({}))) as Partial<ApiResponse<T>>;
  if (!response.ok || !data || data.ok === false) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as ErrorResponse).error === "string"
        ? (data as ErrorResponse).error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data as SuccessResponse<T>;
}

export function usePodPoap() {
  const { address } = useSolanaWallet();
  const [metadata, setMetadata] = useState<PodMetadata | null>(null);
  const [tokens, setTokens] = useState<PodToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureAddress = useCallback(async () => {
    if (!address) {
      throw new Error("Connect a wallet to continue.");
    }
    return address;
  }, [address]);

  const refreshTokens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const owner = await ensureAddress();
      const data = await fetchJson<{ tokens: PodToken[] }>(
        `/api/pod-poap/tokens/${encodeURIComponent(owner)}`
      );
      setTokens(data.tokens ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tokens");
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [ensureAddress]);

  useEffect(() => {
    if (address) {
      refreshTokens();
    }
  }, [address, refreshTokens]);

  const totalOwned = useMemo(() => tokens.length, [tokens]);

  return {
    address,
    metadata,
    tokens,
    totalOwned,
    loading,
    error,
    refreshTokens,
    ensureAddress,
  };
}
