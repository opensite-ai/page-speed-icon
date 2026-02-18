const HEX_BLACK_REGEX = /#000000\b|#000\b/i;
const BLACK_WORD_REGEX = /\bblack\b/i;
const RGB_BLACK_REGEX = /rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/i;

const STROKE_ATTR_REGEX = /stroke=["']([^"']+)["']/gi;
const FILL_ATTR_REGEX = /fill=["']([^"']+)["']/gi;
const STYLE_ATTR_REGEX = /style=["']([^"']+)["']/gi;

function normalizeColorToken(value: string): string {
  const trimmed = value.trim();
  if (
    HEX_BLACK_REGEX.test(trimmed) ||
    BLACK_WORD_REGEX.test(trimmed) ||
    RGB_BLACK_REGEX.test(trimmed)
  ) {
    return "currentColor";
  }
  return trimmed;
}

function normalizeStyleInline(style: string): string {
  return style
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const [rawProperty, rawValue] = segment.split(":");
      if (!rawProperty || !rawValue) {
        return segment;
      }
      const property = rawProperty.trim().toLowerCase();
      if (property !== "stroke" && property !== "fill") {
        return segment;
      }
      const value = normalizeColorToken(rawValue);
      return `${rawProperty.trim()}: ${value}`;
    })
    .join("; ");
}

export function processSvgForCurrentColor(svg: string): string {
  let processed = svg;

  processed = processed.replace(STROKE_ATTR_REGEX, (_full, value: string) => {
    const nextValue = normalizeColorToken(value);
    return `stroke="${nextValue}"`;
  });

  processed = processed.replace(FILL_ATTR_REGEX, (_full, value: string) => {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === "none") {
      return `fill="${trimmed}"`;
    }
    const nextValue = normalizeColorToken(trimmed);
    return `fill="${nextValue}"`;
  });

  processed = processed.replace(STYLE_ATTR_REGEX, (_full, value: string) => {
    const normalized = normalizeStyleInline(value);
    return `style="${normalized}"`;
  });

  return processed;
}
