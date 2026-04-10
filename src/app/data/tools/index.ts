import { financeTools } from "./finance";
import { devTools } from "./dev";
import { mediaTools } from "./media";
import { productivityTools } from "./productivity";

// All tools combined — use this wherever you need the full list
export const tools = [
    ...financeTools,
    ...mediaTools,
    ...devTools,
    ...productivityTools,
];

// Individual category exports — use these for category-specific pages
export { financeTools, devTools, mediaTools, productivityTools };

// Type export
export type Tool = typeof tools[number];