import type React from "react";

export type ParsedIconName = {
  prefix: string;
  iconName: string;
};

export type BuildIconRequestUrlOptions = {
  name: string;
  size: number;
  apiKey: string;
  baseUrl?: string;
};

export type FetchIconSvgOptions = {
  fetcher?: typeof fetch;
};

export type IconProps = {
  /** Icon name in format: prefix/name or prefix:name */
  name: string;
  /** Icon size in pixels. */
  size?: number;
  /** Icon color; when omitted icon inherits parent color via currentColor. */
  color?: string;
  /** Additional CSS classes. */
  className?: string;
  /** Accessible label for screen readers. */
  alt?: string;
  /** icons.opensite.ai API key. */
  apiKey: string;
  /** Override API base URL if needed for private icon infra. */
  baseUrl?: string;
  /** Optional fallback rendered when icon fails to load. */
  fallback?: React.ReactNode;
};
