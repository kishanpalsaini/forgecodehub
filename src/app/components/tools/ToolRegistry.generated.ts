// AUTO-GENERATED — do not edit manually
// Run: npm run gen:registry

import dynamic from "next/dynamic"
import React from "react"

const TOOL_REGISTRY: Record<string, React.ComponentType> = {
    "/tools/online-word-editor": dynamic(() => import("@/app/components/tools/online-word-editor/WordEditor")),
    "/tools/online-qr-generator": dynamic(() => import("@/app/components/tools/online-qr-barcode-generator/qr-barcode-generator")),
    "/tools/online-barcode-generator": dynamic(() => import("@/app/components/tools/online-qr-barcode-generator/qr-barcode-generator")),
    "/tools/online-text-writing-tools": dynamic(() => import("@/app/components/tools/text-writing-tools/TextWritingTools")),
    "/tools/online-word-counter": dynamic(() => import("@/app/components/tools/text-writing-tools/WordCounter")),
    "/tools/online-character-counter": dynamic(() => import("@/app/components/tools/text-writing-tools/CharacterCounter")),
    "/tools/online-case-converter": dynamic(() => import("@/app/components/tools/text-writing-tools/CaseConverter")),
    "/tools/online-fancy-font-generator": dynamic(() => import("@/app/components/tools/text-writing-tools/FancyFontGenerator")),
    "/tools/online-remove-extra-spaces": dynamic(() => import("@/app/components/tools/text-writing-tools/RemoveSpaces")),
    "/tools/online-line-break-remover": dynamic(() => import("@/app/components/tools/text-writing-tools/LineBreakRemover")),
    "/tools/online-text-sorter": dynamic(() => import("@/app/components/tools/text-writing-tools/TextSorter")),
    "/tools/online-duplicate-remover": dynamic(() => import("@/app/components/tools/text-writing-tools/DuplicateRemover")),
    "/tools/online-text-to-emoji": dynamic(() => import("@/app/components/tools/text-writing-tools/TextToEmoji")),
    "/tools/online-reverse-text-generator": dynamic(() => import("@/app/components/tools/text-writing-tools/ReverseText")),
    "/tools/online-json-formatter": dynamic(() => import("@/app/components/tools/json-formatter/json-formatter-client")),
    "/tools/online-base-64-client": dynamic(() => import("@/app/components/tools/base-64-client/base-64-client")),
    "/tools/online-url-encoder-decoder": dynamic(() => import("@/app/components/tools/url-encoder-client/url-encoder-client")),
    "/tools/online-html-minifier": dynamic(() => import("@/app/components/tools/html-minifier/html-minifier-client")),
    "/tools/online-css-minifier": dynamic(() => import("@/app/components/tools/css-minifier/css-minifier-client")),
    "/tools/online-crypto-encrypt-decrypt": dynamic(() => import("@/app/components/tools/crypto-encrypt-decrypt/crypto-encrypt-decrypt-client")),
    "/tools/json-formatterhub": dynamic(() => import("@/app/components/tools/json-tools/JSONToolsHub")),
    "/tools/json-viewer": dynamic(() => import("@/app/components/tools/json-tools/JSONViewer")),
    "/tools/online-json-diff": dynamic(() => import("@/app/components/tools/json-tools/JSONDiff")),
    "/tools/online-json-validator": dynamic(() => import("@/app/components/tools/json-tools/JSONValidator")),
    "/tools/online-json-to-csv": dynamic(() => import("@/app/components/tools/json-tools/JSONToCSV")),
    "/tools/online-json-path": dynamic(() => import("@/app/components/tools/json-tools/JSONPath")),
    "/tools/images/online-png-to-jpg": dynamic(() => import("@/app/components/tools/images/png-to-jpg/PngToJpgClient")),
    "/tools/images/online-jpg-to-png": dynamic(() => import("@/app/components/tools/images/jpg-to-png/JpgToPngClient")),
    "/tools/images/online-universal-image-converter": dynamic(() => import("@/app/components/tools/images/converters/UniversalConverter")) as React.ComponentType<object>,
    // "/tools/images/online-universal-image-converter": dynamic(() => 
    //   import("@/app/components/tools/images/converters/UniversalConverter")
    // ) as any, // Type assertion to bypass type checking for this specific component
}

export default TOOL_REGISTRY
