# @page-speed/icon

## Performance-optimized dynamic icon loader for the [OpenSite AI site builder](https://opensite.ai) platform

![PageSpeed Map React Component](https://octane.cdn.ing/api/v1/images/transform?url=https://cdn.ing/assets/i/r/290196/x4vsob48dfgyoyc6gu2hxne39w5j/pagespeed-opensite-mobile-ui-icon-banner.png&f=webp)

<br />

[![npm version](https://img.shields.io/npm/v/@page-speed/icon?style=for-the-badge)](https://www.npmjs.com/package/@page-speed/icon)
[![npm downloads](https://img.shields.io/npm/dm/@page-speed/icon?style=for-the-badge)](https://www.npmjs.com/package/@page-speed/icon)
[![License](https://img.shields.io/npm/l/@page-speed/icon?style=for-the-badge)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge)](./tsconfig.json)
[![Tree-Shakeable](https://img.shields.io/badge/Tree%20Shakeable-Yes-brightgreen?style=for-the-badge)](#tree-shaking)

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

