# @page-speed/icon

![PageSpeed Map React Component](https://octane.cdn.ing/api/v1/images/transform?url=https://cdn.ing/assets/i/r/290196/x4vsob48dfgyoyc6gu2hxne39w5j/pagespeed-opensite-mobile-ui-icon-banner.png&f=webp)

Performance-optimized dynamic icon loader for DashTrack and OpenSite.

## Install

```bash
pnpm add @page-speed/icon
```

## Usage

```tsx
import { Icon } from "@page-speed/icon";

<Icon name="lucide/home" size={24} apiKey="your-icons-api-key" />;
```

## Features

- Dynamic icon fetch from `icons.opensite.ai`
- `prefix/name` and `prefix:name` name formats
- Inline SVG rendering with `currentColor` normalization
- In-memory response caching with in-flight request de-duplication
- Tree-shakable exports for core/types/utils

## API

- `Icon` (primary component)
- `DynamicIcon` (compatibility alias)
- `buildIconRequestUrl(...)`
- `parseIconName(...)`
- `processSvgForCurrentColor(...)`

See `docs/README.md` for migration and detailed API docs.
