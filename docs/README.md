# @page-speed/icon Docs

## Purpose

`@page-speed/icon` is the extracted micro-library for the DynamicIcon behavior currently used in `opensite-ui`.

## Primary Component

```tsx
import { Icon } from "@page-speed/icon";

<Icon name="lucide/home" size={24} apiKey="..." />;
```

## Migration From opensite-ui Dynamic Icon

### Before

```tsx
import { DynamicIcon } from "@/components/ui/dynamic-icon";
```

### After

```tsx
import { Icon } from "@page-speed/icon";

<Icon name="lucide/home" size={24} apiKey="..." />;
```

### Compatibility

`DynamicIcon` is also exported as an alias to ease incremental migration.

## Export Surface

- `@page-speed/icon`
- `@page-speed/icon/core`
- `@page-speed/icon/core/icon`
- `@page-speed/icon/types`
- `@page-speed/icon/utils`
- `@page-speed/icon/utils/icon-url`
- `@page-speed/icon/utils/svg`

## Validation Commands

```bash
pnpm install
pnpm build
pnpm type-check
pnpm test:ci
pnpm prepublish
```
