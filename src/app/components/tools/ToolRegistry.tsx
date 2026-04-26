import TOOL_REGISTRY from "@/app/components/tools/ToolRegistry.generated"

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
            <div style={{ padding: "24px", background: "#0a0a0a" }}>
                <ToolComponent />
            </div>
        </div>
    )
}