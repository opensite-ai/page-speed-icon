import { act, render as rtlRender, RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Custom render function that ensures proper act() wrapping
 * for async state updates in Icon components
 */
export async function renderWithIconAsync(
  ui: ReactElement
): Promise<RenderResult> {
  let result: RenderResult;

  await act(async () => {
    result = rtlRender(ui);
  });

  return result!;
}

// Re-export everything from testing library
export * from "@testing-library/react";