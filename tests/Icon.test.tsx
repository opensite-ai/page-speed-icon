import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import { Icon } from "../src/core/Icon";
import { clearIconCache } from "../src/utils/fetchIconSvg";

function createFetchResponse(svg: string, ok = true, status = 200): Response {
  return {
    ok,
    status,
    text: vi.fn().mockResolvedValue(svg)
  } as unknown as Response;
}

describe("Icon", () => {
  beforeEach(() => {
    clearIconCache();
    vi.restoreAllMocks();
  });

  it("loads and renders inline svg", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(createFetchResponse('<svg><path fill="#000"/></svg>'));

    render(<Icon name="lucide/home" size={24} apiKey="abc123" alt="Home" />);

    const icon = await screen.findByRole("img", { name: "Home" });
    expect(icon).toHaveAttribute("data-state", "ready");
    expect(icon.innerHTML).toContain('fill="currentColor"');

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    expect(fetchSpy.mock.calls[0]?.[0]).toContain("/api/icon/lucide/home");
    expect(fetchSpy.mock.calls[0]?.[0]).toContain("key=abc123");
    expect(fetchSpy.mock.calls[0]?.[0]).toContain("width=24");
  });

  it("shows fallback state when icon request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      createFetchResponse("", false, 401)
    );

    render(
      <Icon
        name="lucide/home"
        apiKey="bad-key"
        alt="Home"
        fallback={<span data-testid="icon-fallback">x</span>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("icon-fallback")).toBeInTheDocument();
    });

    expect(screen.getByRole("img", { name: "Home" })).toHaveAttribute(
      "data-state",
      "error"
    );
  });

  it("de-duplicates network requests for matching icons", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(createFetchResponse('<svg><path stroke="#000"/></svg>'));

    render(
      <>
        <Icon name="lucide/home" apiKey="abc123" />
        <Icon name="lucide/home" apiKey="abc123" />
      </>
    );

    await waitFor(() => {
      const rendered = screen.getAllByRole("img", { name: "home" });
      expect(rendered).toHaveLength(2);
      for (const icon of rendered) {
        expect(icon).toHaveAttribute("data-state", "ready");
      }
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("handles invalid icon name as error state", async () => {
    render(
      <Icon
        name="invalid-name"
        apiKey="abc123"
        alt="Broken"
        fallback={<span data-testid="icon-fallback">x</span>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("icon-fallback")).toBeInTheDocument();
    });

    expect(screen.getByRole("img", { name: "Broken" })).toHaveAttribute(
      "data-state",
      "error"
    );
  });
});
