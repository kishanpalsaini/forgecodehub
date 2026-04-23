import dynamic from "next/dynamic"

// Add every tool here — one line per tool
// key = tool_link value stored in Supabase
const TOOL_REGISTRY: Record<string, React.ComponentType> = {
    // "/calculators/emi": dynamic(() => import("@/app/calculators/emi/EMICalculator").catch(() => null)),
    // "/calculators/gst": dynamic(() => import("@/app/calculators/gst/[state]")),
    // "/calculators/sip": dynamic(() => import("@/app/calculators/sip/SIPCalculator")),
    "/tools/online-word-editor": dynamic(() => import("@/app/components/tools/online-word-editor/WordEditor")),
    "/tools/json-formatter": dynamic(() => import("@/app/tools/online-json-formatterhub/page")),
    // Add more tools here as you build them — blog posts update automatically
}

type ToolEmbedProps = {
    toolLink: string | null
    toolName: string | null
}

export function ToolEmbed({ toolLink, toolName }: ToolEmbedProps) {
    if (!toolLink) return null

    const ToolComponent = TOOL_REGISTRY[toolLink]

    if (!ToolComponent) return null

    return (
        <div style={{
            margin: "40px 0",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{
                padding: "12px 20px",
                borderBottom: "1px solid #2a2a2a",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#111",
            }}>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                    Try it right here ↓
                </span>
                <span style={{
                    fontSize: "12px",
                    background: "#f97316",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontWeight: 500,
                }}>
                    {toolName ?? "Free Tool"}
                </span>
            </div>

            {/* The actual tool component */}
            <div style={{ padding: "24px", background: "#0a0a0a" }}>
                <ToolComponent />
            </div>
        </div>
    )
}