"use client";

import * as React from "react";

import type { IconProps } from "../types";
import { buildIconRequestUrl, fetchIconSvg, parseIconName } from "../utils";

function joinClassNames(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

function IconComponent({
  name,
  size = 28,
  color,
  className,
  alt,
  apiKey,
  baseUrl,
  fallback,
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
      setState((prev) =>
        prev.error && !prev.svg ? prev : { svg: null, error: true },
      );
      return;
    }

    // Reset state only if needed
    setState((prev) =>
      !prev.svg && !prev.error ? prev : { svg: null, error: false },
    );

    // In test environment, use a microtask to avoid act warnings
    const loadIcon = async () => {
      try {
        const svg = await fetchIconSvg(requestUrl);
        if (!disposed) {
          setState({ svg, error: false });
        }
      } catch {
        if (!disposed) {
          setState({ svg: null, error: true });
        }
      }
    };

    loadIcon();

    return () => {
      disposed = true;
    };
  }, [requestUrl]);

  const ariaLabel = React.useMemo(() => {
    return alt || parsedName?.iconName;
  }, [alt, parsedName?.iconName]);

  const a11yProps = React.useMemo(() => {
    return ariaLabel
      ? ({ role: "img", "aria-label": ariaLabel } as const)
      : ({ "aria-hidden": true } as const);
  }, [ariaLabel]);

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
      className={joinClassNames(
        "inline-flex items-center justify-center",
        className,
      )}
      style={{
        width: size,
        height: size,
        color: color || "inherit",
      }}
      data-state="ready"
      dangerouslySetInnerHTML={{ __html: state.svg }}
      {...a11yProps}
    />
  );
}

function areIconPropsEqual(previous: IconProps, next: IconProps): boolean {
  return (
    previous.name === next.name &&
    previous.size === next.size &&
    previous.color === next.color &&
    previous.className === next.className &&
    previous.alt === next.alt &&
    previous.apiKey === next.apiKey &&
    previous.baseUrl === next.baseUrl &&
    previous.fallback === next.fallback
  );
}

export const Icon = React.memo(IconComponent, areIconPropsEqual);
Icon.displayName = "Icon";

export const DynamicIcon = Icon;
