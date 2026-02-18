"use client";

import * as React from "react";

import { cn } from "../lib/utils";

interface DynamicIconProps {
  /**
   * Icon name in format: prefix/name or prefix:name
   * Examples: "lucide/home", "mdi:account", "heroicons/check"
   */
  name: string;
  /**
   * Icon size in pixels
   * @default 28
   */
  size?: number;
  /**
   * Icon color - accepts any valid CSS color
   * Note: When not specified, the icon inherits color from parent via CSS currentColor
   */
  color?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * API key for icons.opensite.ai API
   */
  apiKey?: string;
}

// Simple in-memory cache for fetched SVGs
const svgCache = new Map<string, string>();

/**
 * Lightweight icon component that dynamically loads SVG icons from icons.opensite.ai API.
 *
 * Features:
 * - Pulls SVGs from https://icons.opensite.ai API and inlines them for CSS color inheritance
 * - Supports currentColor - icons inherit color from parent element
 * - Accepts prefix/name or prefix:name format
 * - Customizable size and explicit color via props
 * - In-memory caching to prevent duplicate fetches
 *
 * @example
 * ```tsx
 * // Icon inherits color from parent (recommended for hover states, etc.)
 * <span className="text-white hover:text-red-500">
 *   <DynamicIcon name="lucide/home" size={24} />
 * </span>
 *
 * // Icon with explicit color
 * <DynamicIcon name="mdi:account" size={32} color="#ff0000" />
 * ```
 */
export function DynamicIcon({
  name,
  size = 28,
  color,
  className,
  alt,
  apiKey,
}: DynamicIconProps) {
  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { url, iconName } = React.useMemo(() => {
    const separator = name.includes("/") ? "/" : ":";
    const [prefix, iconName] = name.split(separator);
    const key = apiKey ? `&key=${apiKey}` : "";
    const baseUrl = `https://icons.opensite.ai/api/icon/${prefix}/${iconName}?format=svg&width=${size}&height=${size}${key}`;

    return {
      url: baseUrl,
      iconName,
    };
  }, [name, size, apiKey]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchSvg = async () => {
      // Check cache first
      const cached = svgCache.get(url);
      if (cached) {
        if (isMounted) {
          setSvgContent(cached);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch icon: ${response.status}`);
        }

        let svg = await response.text();

        // Process SVG to ensure currentColor works:
        // 1. Replace any hardcoded colors with currentColor
        // 2. Ensure stroke/fill use currentColor where appropriate
        svg = processSvgForCurrentColor(svg);

        // Cache the processed SVG
        svgCache.set(url, svg);

        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load icon");
          setIsLoading(false);
        }
      }
    };

    fetchSvg();

    return () => {
      isMounted = false;
    };
  }, [url]);

  // Loading state - show placeholder with same dimensions
  if (isLoading) {
    return (
      <span
        className={cn("inline-block", className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  // Error state - show nothing or fallback
  if (error || !svgContent) {
    return (
      <span
        className={cn("inline-block", className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label={alt || iconName}
      />
    );
  }

  // Render inline SVG
  // The color prop applies an explicit color, otherwise inherits from parent via currentColor
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        color: color || "inherit",
      }}
      role="img"
      aria-label={alt || iconName}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

/**
 * Process SVG to ensure it uses currentColor for proper CSS inheritance.
 * This handles various icon libraries that may use different color approaches.
 */
function processSvgForCurrentColor(svg: string): string {
  // Replace stroke="currentColor" is already correct, but ensure fill also works
  // Some icons use fill="none" with stroke, others use fill with no stroke

  // Ensure the SVG doesn't have hardcoded colors that should be currentColor
  // Common patterns to replace:
  // - stroke="#000" or stroke="#000000" or stroke="black" -> stroke="currentColor"
  // - fill="#000" or fill="#000000" or fill="black" -> fill="currentColor"

  let processed = svg;

  // Replace common black color values with currentColor for stroke
  processed = processed.replace(
    /stroke=["'](#000000|#000|black)["']/gi,
    'stroke="currentColor"',
  );

  // Replace common black color values with currentColor for fill
  // But be careful not to replace fill="none"
  processed = processed.replace(
    /fill=["'](#000000|#000|black)["']/gi,
    'fill="currentColor"',
  );

  return processed;
}
