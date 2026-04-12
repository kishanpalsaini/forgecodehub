// lib/word-editor/editorExtensions.ts

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Extension } from "@tiptap/core";
import { AudioNode, VideoNode } from "./Mediaextensions";
// Use ResizableImage instead of @tiptap/extension-image — it registers the
// same "image" node type but adds drag-to-resize handles.
import { ResizableImage } from "./resizableImageExtension";

// FontSize stored as a TextStyle attribute
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
});

export const editorExtensions = [
  StarterKit.configure({ codeBlock: {} }),

  Table.configure({ resizable: true, HTMLAttributes: { class: "editor-table" } }),
  TableRow,
  TableHeader,
  TableCell,

  Underline,
  TextStyle,
  FontFamily.configure({ types: ["textStyle"] }),
  FontSize,
  Color,
  Highlight.configure({ multicolor: true }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
  }),

  // ResizableImage replaces @tiptap/extension-image entirely.
  // Do NOT import both — they share the node name "image" and will conflict.
  ResizableImage,

  AudioNode,
  VideoNode,

  Link.configure({
    openOnClick: false,
    HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
  }),

  TaskList,
  TaskItem.configure({ nested: true }),
  CharacterCount.configure({ limit: null }),
  Placeholder.configure({ placeholder: "Start typing your document…" }),
];