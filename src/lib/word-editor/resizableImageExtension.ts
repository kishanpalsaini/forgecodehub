// lib/word-editor/resizableImageExtension.ts
// Custom Tiptap Image extension with drag-to-resize handles

import { Node as TiptapNode, mergeAttributes } from "@tiptap/core";

export const ResizableImage = TiptapNode.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:    { default: null },
      alt:    { default: "" },
      title:  { default: null },
      width:  { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, ...rest } = HTMLAttributes;
    const style = [
      width  ? `width:${typeof width  === "number" ? width  + "px" : width}`  : "",
      height ? `height:${typeof height === "number" ? height + "px" : height}` : "",
    ]
      .filter(Boolean)
      .join(";");
    return ["img", mergeAttributes(rest, { style: style || undefined, draggable: false })];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {

      // ── Wrapper ───────────────────────────────────────────────────────────
      const wrapper = document.createElement("div");
      wrapper.style.cssText = [
        "position:relative",
        "display:inline-block",
        "max-width:100%",
        "cursor:default",
        "user-select:none",
      ].join(";");

      // ── Image ─────────────────────────────────────────────────────────────
      const img = document.createElement("img");
      img.src = node.attrs.src  ?? "";
      img.alt = node.attrs.alt  ?? "";
      img.style.cssText = [
        "display:block",
        "max-width:100%",
        "height:auto",
        "border-radius:4px",
        "pointer-events:none",
      ].join(";");

      if (node.attrs.width)  img.style.width  = typeof node.attrs.width  === "number" ? node.attrs.width  + "px" : node.attrs.width;
      if (node.attrs.height) img.style.height = typeof node.attrs.height === "number" ? node.attrs.height + "px" : node.attrs.height;

      wrapper.appendChild(img);

      // ── Selection highlight ───────────────────────────────────────────────
      const setSelected = (sel: boolean) => {
        wrapper.style.outline = sel ? "2px solid #6366f1" : "none";
        handles.forEach(h => { h.style.display = sel ? "block" : "none"; });
      };

      wrapper.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();
        setSelected(true);
      });

      // Use HTMLElement instead of Tiptap's Node to avoid the clash
      const outsideClickHandler = (e: MouseEvent) => {
        if (!wrapper.contains(e.target as HTMLElement)) setSelected(false);
      };
      document.addEventListener("click", outsideClickHandler);

      // ── Resize handles ────────────────────────────────────────────────────
      type Corner = "se" | "sw" | "ne" | "nw";
      const corners: Corner[] = ["se", "sw", "ne", "nw"];

      const cornerCSS: Record<Corner, string> = {
        se: "bottom:-5px;right:-5px;cursor:se-resize;",
        sw: "bottom:-5px;left:-5px;cursor:sw-resize;",
        ne: "top:-5px;right:-5px;cursor:ne-resize;",
        nw: "top:-5px;left:-5px;cursor:nw-resize;",
      };

      const baseHandleCSS = [
        "position:absolute",
        "width:10px",
        "height:10px",
        "background:#6366f1",
        "border:2px solid #fff",
        "border-radius:50%",
        "display:none",
        "z-index:10",
        "box-shadow:0 1px 4px rgba(0,0,0,.35)",
      ].join(";");

      const handles: HTMLDivElement[] = corners.map(corner => {
        const handle = document.createElement("div");
        handle.style.cssText = `${baseHandleCSS};${cornerCSS[corner]}`;
        wrapper.appendChild(handle);

        handle.addEventListener("mousedown", (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const startW = img.offsetWidth;
          const startH = img.offsetHeight;
          const aspect = startW / startH;

          const onMove = (ev: MouseEvent) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let newW: number;
            if (corner === "se" || corner === "ne") {
              newW = Math.max(40, startW + dx);
            } else {
              newW = Math.max(40, startW - dx);
            }

            let newH: number;
            if (ev.shiftKey) {
              if (corner === "se" || corner === "sw") {
                newH = Math.max(40, startH + dy);
              } else {
                newH = Math.max(40, startH - dy);
              }
            } else {
              newH = newW / aspect;
            }

            img.style.width  = newW + "px";
            img.style.height = newH + "px";
          };

          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);

            // Persist size — guard against getPos returning undefined
            if (typeof getPos !== "function") return;
            const pos = getPos();
            if (pos === undefined) return;          // ← fixes the ts(2345) error

            editor.chain().focus().command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                width:  img.offsetWidth,
                height: img.offsetHeight,
              });
              return true;
            }).run();
          };

          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        });

        return handle;
      });

      // ── Tooltip hint ──────────────────────────────────────────────────────
      const hint = document.createElement("div");
      hint.textContent = "Hold Shift to resize freely";
      hint.style.cssText = [
        "position:absolute",
        "bottom:-24px",
        "left:50%",
        "transform:translateX(-50%)",
        "background:rgba(0,0,0,.7)",
        "color:#fff",
        "font-size:11px",
        "padding:2px 8px",
        "border-radius:4px",
        "white-space:nowrap",
        "pointer-events:none",
        "display:none",
        "z-index:20",
      ].join(";");
      wrapper.appendChild(hint);

      handles.forEach(h => {
        h.addEventListener("mouseenter", () => { hint.style.display = "block"; });
        h.addEventListener("mouseleave", () => { hint.style.display = "none"; });
      });

      return {
        dom: wrapper,

        update(updatedNode) {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src ?? "";
          img.alt = updatedNode.attrs.alt ?? "";
          if (updatedNode.attrs.width)  img.style.width  = updatedNode.attrs.width  + "px";
          if (updatedNode.attrs.height) img.style.height = updatedNode.attrs.height + "px";
          return true;
        },

        destroy() {
          document.removeEventListener("click", outsideClickHandler);
        },
      };
    };
  },
});