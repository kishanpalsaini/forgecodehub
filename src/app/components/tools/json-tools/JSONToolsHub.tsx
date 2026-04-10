"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./JSONToolsHub.module.css";
import JSONFormatter from "./JSONFormatter";
import JSONViewer from "./JSONViewer";
import JSONDiff from "./JSONDiff";
import JSONValidator from "./JSONValidator";
import JSONToCSV from "./JSONToCSV";
import JSONPath from "./JSONPath";

type ToolType = "formatter" | "viewer" | "diff" | "validator" | "csv" | "path";

interface Tool {
  id: ToolType;
  label: string;
  icon: string;
  description: string;
  path: string;
}

const TOOLS: Tool[] = [
  {
    id: "formatter",
    label: "Formatter",
    icon: "🎨",
    description: "Format & beautify JSON",
    path: "formatter",
  },
  {
    id: "viewer",
    label: "Viewer",
    icon: "👁️",
    description: "Interactive tree view",
    path: "viewer",
  },
  {
    id: "diff",
    label: "Diff",
    icon: "⚖️",
    description: "Compare JSON objects",
    path: "diff",
  },
  {
    id: "validator",
    label: "Validator",
    icon: "✓",
    description: "Validate JSON syntax",
    path: "validator",
  },
  {
    id: "csv",
    label: "To CSV",
    icon: "📊",
    description: "Convert to CSV",
    path: "csv",
  },
  {
    id: "path",
    label: "JSONPath",
    icon: "🔍",
    description: "Query with JSONPath",
    path: "path",
  },
];

export default function JSONToolsHub() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-detect tool from URL
  const getToolFromURL = (): ToolType => {
    // Check query parameter first
    const toolParam = searchParams.get("tool") as ToolType | null;
    if (toolParam && TOOLS.some((t) => t.id === toolParam)) {
      return toolParam;
    }

    // Check pathname for dedicated tool pages
    if (pathname.includes("json-viewer")) return "viewer";
    if (pathname.includes("json-diff")) return "diff";
    if (pathname.includes("json-validator")) return "validator";
    if (pathname.includes("json-to-csv")) return "csv";
    if (pathname.includes("json-path")) return "path";

    // Default to formatter
    return "formatter";
  };

  const [activeTool, setActiveTool] = useState<ToolType>(getToolFromURL());

  // Update active tool when URL changes (browser back/forward or direct navigation)
  useEffect(() => {
    const detectedTool = getToolFromURL();
    setActiveTool(detectedTool);
  }, [pathname, searchParams]);

  // Handle tool change via tab click
  const handleToolChange = (toolId: ToolType) => {
    setActiveTool(toolId);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tool", toolId);
    router.push(url.pathname + url.search, { scroll: false });
  };

  // Render the active tool component
  const renderTool = () => {
    switch (activeTool) {
      case "formatter":
        return <JSONFormatter />;
      case "viewer":
        return <JSONViewer />;
      case "diff":
        return <JSONDiff />;
      case "validator":
        return <JSONValidator />;
      case "csv":
        return <JSONToCSV />;
      case "path":
        return <JSONPath />;
      default:
        return <JSONFormatter />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>🛠️ Developer Tools</div>
        <h1 className={styles.title}>JSON Tools Suite</h1>
        <p className={styles.description}>
          Complete toolkit for working with JSON: Format, validate, compare, visualize, and convert — all in your browser
        </p>
      </div>

      {/* Tool Tabs */}
      <div className={styles.toolTabs}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolChange(tool.id)}
            className={`${styles.toolTab} ${activeTool === tool.id ? styles.toolTabActive : ""}`}
          >
            <span className={styles.toolIcon}>{tool.icon}</span>
            <div className={styles.toolInfo}>
              <div className={styles.toolLabel}>{tool.label}</div>
              <div className={styles.toolDescription}>{tool.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Tool Content */}
      <div className={styles.toolContent}>{renderTool()}</div>
    </div>
  );
}