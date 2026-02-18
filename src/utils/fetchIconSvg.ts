import type { FetchIconSvgOptions } from "../types";
import { processSvgForCurrentColor } from "./svg";

const svgCache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

export function clearIconCache(): void {
  svgCache.clear();
  inFlight.clear();
}

export async function fetchIconSvg(
  url: string,
  { fetcher = fetch }: FetchIconSvgOptions = {}
): Promise<string> {
  const cached = svgCache.get(url);
  if (cached) {
    return cached;
  }

  const inflightRequest = inFlight.get(url);
  if (inflightRequest) {
    return inflightRequest;
  }

  const request = (async () => {
    const response = await fetcher(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch icon: ${response.status}`);
    }

    const rawSvg = await response.text();
    const processedSvg = processSvgForCurrentColor(rawSvg);
    svgCache.set(url, processedSvg);
    return processedSvg;
  })();

  inFlight.set(url, request);

  try {
    return await request;
  } finally {
    inFlight.delete(url);
  }
}
