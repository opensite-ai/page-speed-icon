import { processSvgForCurrentColor } from "../src/utils/svg";

describe("processSvgForCurrentColor", () => {
  it("normalizes hardcoded black stroke/fill colors", () => {
    const svg =
      '<svg><path stroke="#000" fill="black" style="stroke: #000000; fill: rgb(0,0,0)"/></svg>';

    const processed = processSvgForCurrentColor(svg);

    expect(processed).toContain('stroke="currentColor"');
    expect(processed).toContain('fill="currentColor"');
    expect(processed).toContain("stroke: currentColor");
    expect(processed).toContain("fill: currentColor");
  });

  it("preserves fill=none", () => {
    const svg = '<svg><path fill="none" stroke="#000"/></svg>';
    const processed = processSvgForCurrentColor(svg);

    expect(processed).toContain('fill="none"');
    expect(processed).toContain('stroke="currentColor"');
  });
});
