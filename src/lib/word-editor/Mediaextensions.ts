// lib/word-editor/mediaExtensions.ts
// Custom Tiptap nodes for Audio and Video embedding

import { Node, mergeAttributes } from "@tiptap/core";

// ── Audio Node ────────────────────────────────────────────────────────────────
export const AudioNode = Node.create({
  name: "audio",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src:     { default: null },
      controls:{ default: true },
      title:   { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "audio" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes({ controls: true, style: "width:100%;margin:8px 0;" }, HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement("div");
      container.style.cssText = "position:relative;margin:12px 0;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;display:flex;align-items:center;gap:12px;";

      const icon = document.createElement("div");
      icon.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;

      const audio = document.createElement("audio");
      audio.src = node.attrs.src;
      audio.controls = true;
      audio.style.cssText = "flex:1;height:40px;";

      const label = document.createElement("span");
      label.textContent = node.attrs.title || "Audio";
      label.style.cssText = "font-size:13px;color:#64748b;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

      container.appendChild(icon);
      container.appendChild(audio);
      container.appendChild(label);

      return { dom: container };
    };
  },
});

// ── Video Node ────────────────────────────────────────────────────────────────
export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src:      { default: null },
      controls: { default: true },
      width:    { default: "100%" },
      title:    { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes({
      controls: true,
      style: "max-width:100%;margin:8px 0;border-radius:8px;",
    }, HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement("div");
      container.style.cssText = "position:relative;margin:12px 0;border-radius:10px;overflow:hidden;background:#000;";

      const video = document.createElement("video");
      video.src = node.attrs.src;
      video.controls = true;
      video.style.cssText = "width:100%;max-height:420px;display:block;";

      container.appendChild(video);
      return { dom: container };
    };
  },
});