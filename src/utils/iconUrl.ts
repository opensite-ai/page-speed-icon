import type { BuildIconRequestUrlOptions, ParsedIconName } from "../types";

export const DEFAULT_ICON_API_BASE_URL = "https://icons.opensite.ai";

export function parseIconName(name: string): ParsedIconName | null {
  if (!name || typeof name !== "string") {
    return null;
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const slashIndex = trimmed.indexOf("/");
  const colonIndex = trimmed.indexOf(":");

  let separatorIndex = -1;
  if (slashIndex >= 0 && colonIndex >= 0) {
    separatorIndex = Math.min(slashIndex, colonIndex);
  } else if (slashIndex >= 0) {
    separatorIndex = slashIndex;
  } else if (colonIndex >= 0) {
    separatorIndex = colonIndex;
  }

  if (separatorIndex <= 0 || separatorIndex >= trimmed.length - 1) {
    return null;
  }

  const prefix = trimmed.slice(0, separatorIndex).trim();
  const iconName = trimmed.slice(separatorIndex + 1).trim();

  if (!prefix || !iconName) {
    return null;
  }

  return { prefix, iconName };
}

export function buildIconRequestUrl({
  name,
  size,
  apiKey,
  baseUrl = DEFAULT_ICON_API_BASE_URL
}: BuildIconRequestUrlOptions): string {
  const parsed = parseIconName(name);
  if (!parsed) {
    throw new Error(
      `Invalid icon name \"${name}\". Expected format \"prefix/name\" or \"prefix:name\".`
    );
  }

  if (!apiKey || !apiKey.trim()) {
    throw new Error("A non-empty apiKey is required to fetch icons.");
  }

  const normalizedSize = Number.isFinite(size) && size > 0 ? Math.round(size) : 28;
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  const url = new URL(
    `/api/icon/${encodeURIComponent(parsed.prefix)}/${encodeURIComponent(parsed.iconName)}`,
    normalizedBaseUrl
  );

  url.searchParams.set("format", "svg");
  url.searchParams.set("width", String(normalizedSize));
  url.searchParams.set("height", String(normalizedSize));
  url.searchParams.set("key", apiKey);

  return url.toString();
}
