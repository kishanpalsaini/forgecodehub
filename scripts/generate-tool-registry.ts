import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read and extract componentPath mappings manually
const toolFiles = [
    "../src/app/data/tools/productivity.ts",
    "../src/app/data/tools/dev.ts",
    "../src/app/data/tools/media.ts",
    "../src/app/data/tools/finance.ts",
]

const entries: string[] = []

for (const file of toolFiles) {
    const content = fs.readFileSync(path.resolve(__dirname, file), "utf-8")

    // Extract path + componentPath pairs using regex
    const blocks = content.split(/\{(?=[^{}]*href)/g)

    for (const block of blocks) {
        const pathMatch = block.match(/\bpath:\s*["']([^"']+)["']/)
        const componentMatch = block.match(/componentPath:\s*["']([^"']+)["']/)

        if (pathMatch && componentMatch) {
            entries.push(`    "${pathMatch[1]}": dynamic(() => import("${componentMatch[1]}")),`)
        }
    }
}

const output = `// AUTO-GENERATED — do not edit manually
// Run: npm run gen:registry

import dynamic from "next/dynamic"
import React from "react"

const TOOL_REGISTRY: Record<string, React.ComponentType> = {
${entries.join("\n")}
}

export default TOOL_REGISTRY
`

fs.writeFileSync(
    path.resolve(__dirname, "../src/app/components/tools/ToolRegistry.generated.ts"),
    output
)

console.log(`✅ ToolRegistry regenerated with ${entries.length} tools`)