export { DynamicIcon, Icon } from "./core";

export type {
  BuildIconRequestUrlOptions,
  FetchIconSvgOptions,
  IconProps,
  ParsedIconName
} from "./types";

export {
  buildIconRequestUrl,
  clearIconCache,
  DEFAULT_ICON_API_BASE_URL,
  fetchIconSvg,
  parseIconName,
  processSvgForCurrentColor
} from "./utils";
