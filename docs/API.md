# API Reference

## `<Icon />`

### Props

- `name: string` (required)
  - Formats: `prefix/name` or `prefix:name`
- `apiKey: string` (required)
  - API key for `icons.opensite.ai`
- `size?: number`
  - Icon dimensions in px, default `28`
- `color?: string`
  - Explicit icon color, otherwise inherits parent color
- `className?: string`
- `alt?: string`
  - Accessible label
- `baseUrl?: string`
  - Override icon API host
- `fallback?: ReactNode`
  - Rendered when request fails or name is invalid

### Output states

The rendered span includes `data-state` with one of:
- `loading`
- `ready`
- `error`

## Utility Functions

- `parseIconName(name)`
- `buildIconRequestUrl({ name, size, apiKey, baseUrl? })`
- `processSvgForCurrentColor(svg)`
- `fetchIconSvg(url)`
- `clearIconCache()`
