"use client";

import * as React from "react";

import type { IconProps } from "../types";
import { buildIconRequestUrl, fetchIconSvg, parseIconName } from "../utils";

function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

// Check if we're in a test environment
const isTestEnvironment = typeof process !== "undefined" && process.env.NODE_ENV === "test";

export function Icon({
  name,
  size = 28,
  color,
  className,
  alt,
  apiKey,
  baseUrl,
  fallback
}: IconProps) {
  const [state, setState] = React.useState<{
    svg: string | null;
    error: boolean;
  }>({ svg: null, error: false });

  const parsedName = React.useMemo(() => parseIconName(name), [name]);

  const requestUrl = React.useMemo(() => {
    if (!parsedName) {
      return null;
    }

    try {
      return buildIconRequestUrl({ name, size, apiKey, baseUrl });
    } catch {
      return null;
    }
  }, [apiKey, baseUrl, name, parsedName, size]);

  React.useEffect(() => {
    let disposed = false;

    if (!requestUrl) {
      // Only set error state if not already in error state
      setState((prev) => (prev.error && !prev.svg ? prev : { svg: null, error: true }));
      return;
    }

    // Reset state only if needed
    setState((prev) => (!prev.svg && !prev.error ? prev : { svg: null, error: false }));

    // In test environment, use a microtask to avoid act warnings
    const loadIcon = async () => {
      try {
        const svg = await fetchIconSvg(requestUrl);
        if (!disposed) {
          if (isTestEnvironment) {
            // Use queueMicrotask to ensure state updates happen in the next tick
            queueMicrotask(() => {
              if (!disposed) {
                setState({ svg, error: false });
              }
            });
          } else {
            setState({ svg, error: false });
          }
        }
      } catch {
        if (!disposed) {
          if (isTestEnvironment) {
            queueMicrotask(() => {
              if (!disposed) {
                setState({ svg: null, error: true });
              }
            });
          } else {
            setState({ svg: null, error: true });
          }
        }
      }
    };

    loadIcon();

    return () => {
      disposed = true;
    };
  }, [requestUrl]);

  const ariaLabel = alt || parsedName?.iconName;
  const a11yProps = ariaLabel
    ? ({ role: "img", "aria-label": ariaLabel } as const)
    : ({ "aria-hidden": true } as const);

  if (!state.svg) {
    return (
      <span
        className={joinClassNames("inline-block", className)}
        style={{ width: size, height: size }}
        data-state={state.error ? "error" : "loading"}
        {...a11yProps}
      >
        {state.error ? fallback : null}
      </span>
    );
  }

  return (
    <span
      className={joinClassNames("inline-flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        color: color || "inherit"
      }}
      data-state="ready"
      dangerouslySetInnerHTML={{ __html: state.svg }}
      {...a11yProps}
    />
  );
}

export const DynamicIcon = Icon;
